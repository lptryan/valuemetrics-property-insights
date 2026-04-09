import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const QuerySchema = z.object({
  table: z.enum(["leads", "estimates"]),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
  situation: z.string().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  sort_by: z.string().optional(),
  sort_dir: z.enum(["asc", "desc"]).default("desc"),
  export_csv: z.enum(["true", "false"]).default("false"),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Validate JWT — only authenticated users can access
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify the user's token
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role for data queries (bypasses RLS)
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const url = new URL(req.url);
    const rawParams: Record<string, string> = {};
    url.searchParams.forEach((v, k) => { rawParams[k] = v; });
    
    const parsed = QuerySchema.safeParse(rawParams);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const params = parsed.data;

    if (params.table === "leads") {
      let query = supabase
        .from("vm_leads")
        .select("*, vm_estimates(formatted_address, estimated_value, address_input)", { count: "exact" });

      if (params.situation) {
        query = query.eq("situation", params.situation);
      }
      if (params.date_from) {
        query = query.gte("created_at", params.date_from);
      }
      if (params.date_to) {
        query = query.lte("created_at", params.date_to);
      }

      const sortColumn = params.sort_by || "created_at";
      query = query.order(sortColumn, { ascending: params.sort_dir === "asc" });

      if (params.export_csv === "true") {
        // Fetch all for CSV
        const { data, error } = await query;
        if (error) throw error;

        const csvHeader = "Date,Name,Email,Phone,Address,Situation,Estimated Value";
        const csvRows = (data || []).map((lead: any) => {
          const addr = lead.vm_estimates?.formatted_address || lead.vm_estimates?.address_input || "";
          const val = lead.vm_estimates?.estimated_value || "";
          return [
            lead.created_at || "",
            (lead.full_name || "").replace(/,/g, " "),
            lead.email,
            lead.phone || "",
            addr.replace(/,/g, " "),
            (lead.situation || "").replace(/,/g, " "),
            val,
          ].join(",");
        });

        const csv = [csvHeader, ...csvRows].join("\n");
        return new Response(csv, {
          headers: {
            ...corsHeaders,
            "Content-Type": "text/csv",
            "Content-Disposition": "attachment; filename=leads-export.csv",
          },
        });
      }

      query = query.range(params.offset, params.offset + params.limit - 1);
      const { data, error, count } = await query;
      if (error) throw error;

      return new Response(JSON.stringify({ data, count }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (params.table === "estimates") {
      let query = supabase
        .from("vm_estimates")
        .select("*", { count: "exact" });

      if (params.date_from) {
        query = query.gte("created_at", params.date_from);
      }
      if (params.date_to) {
        query = query.lte("created_at", params.date_to);
      }

      const sortColumn = params.sort_by || "created_at";
      query = query.order(sortColumn, { ascending: params.sort_dir === "asc" });
      query = query.range(params.offset, params.offset + params.limit - 1);

      const { data, error, count } = await query;
      if (error) throw error;

      // Compute avg estimated value
      const { data: avgData } = await supabase
        .from("vm_estimates")
        .select("estimated_value");
      const values = (avgData || []).map((e: any) => e.estimated_value).filter(Boolean);
      const avgValue = values.length ? Math.round(values.reduce((a: number, b: number) => a + b, 0) / values.length) : 0;

      return new Response(JSON.stringify({ data, count, avgValue }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid table" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
