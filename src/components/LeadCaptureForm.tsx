import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const leadSchema = z.object({
  full_name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Valid email is required").max(255),
  phone: z.string().max(20).optional().or(z.literal("")),
  situation: z.string().max(500).optional().or(z.literal("")),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadCaptureFormProps {
  estimateId?: string;
}

const LeadCaptureForm = ({ estimateId }: LeadCaptureFormProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      situation: "",
    },
  });

  const onSubmit = async (values: LeadFormValues) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const { error } = await supabase.from("vm_leads").insert({
        estimate_id: estimateId || null,
        full_name: values.full_name,
        email: values.email,
        phone: values.phone || null,
        situation: values.situation || null,
        utm_source: params.get("utm_source") || null,
        utm_medium: params.get("utm_medium") || null,
        utm_campaign: params.get("utm_campaign") || null,
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Thank you!",
        description: "We'll send your detailed report shortly.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky/10">
            <FileText className="h-6 w-6 text-sky" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-navy mb-2">Report Requested!</h3>
        <p className="text-sm text-mid">
          Check your inbox for your detailed property valuation report.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy">
          <FileText className="h-5 w-5 text-sky" />
        </div>
        <div>
          <h3 className="text-base font-bold text-navy">Get Full Report</h3>
          <p className="text-xs text-mid">
            Receive a detailed PDF with comps and analysis.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-navy">Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Jane Smith"
                    className="rounded-md"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-navy">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="jane@example.com"
                    className="rounded-md"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-navy">
                  Phone <span className="text-mid">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="(555) 123-4567"
                    className="rounded-md"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="situation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-navy">
                  Your Situation <span className="text-mid">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Thinking of selling, refinancing, etc."
                    className="rounded-md resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-navy text-sky hover:bg-navy/90 font-semibold h-11 transition-all"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {loading ? "Submitting…" : "Get My Report"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LeadCaptureForm;
