import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  BarChart3,
  TrendingUp,
  DollarSign,
  Download,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  UserCheck,
  Settings,
  X,
  ArrowUpDown,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";

const PAGE_SIZE = 20;

const SITUATIONS = [
  "Thinking about selling soon",
  "Just curious about my home's value",
  "Exploring refinancing",
  "Researching the neighborhood",
  "Evaluating an investment",
];

function formatCurrency(val: number | null) {
  if (val == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
}

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDateTime(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

async function fetchAdminData(
  session: Session | null,
  table: string,
  page: number,
  filters: Record<string, string> = {},
) {
  if (!session) throw new Error("Not authenticated");
  const params = new URLSearchParams({
    table,
    limit: String(PAGE_SIZE),
    offset: String(page * PAGE_SIZE),
    ...filters,
  });
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-data?${params}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || "Failed to fetch");
  }
  return res.json();
}

/* ─── Sidebar nav items ─────────────────────────────── */
const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { label: "Leads", icon: UserCheck, id: "leads" },
  { label: "Estimates", icon: BarChart3, id: "estimates" },
  { label: "Settings", icon: Settings, id: "settings" },
];

const Admin = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("dashboard");

  // Leads state
  const [leadsPage, setLeadsPage] = useState(0);
  const [situationFilter, setSituationFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedLead, setSelectedLead] = useState<any>(null);

  // Auth check
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
      if (!session) navigate("/admin/login");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) navigate("/admin/login");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const leadsFilters: Record<string, string> = {
    sort_by: sortBy,
    sort_dir: sortDir,
  };
  if (situationFilter) leadsFilters.situation = situationFilter;
  if (dateFrom) leadsFilters.date_from = dateFrom;
  if (dateTo) leadsFilters.date_to = dateTo;

  const leads = useQuery({
    queryKey: ["admin", "leads", leadsPage, leadsFilters],
    queryFn: () => fetchAdminData(session, "leads", leadsPage, leadsFilters),
    enabled: !!session,
  });

  const estimates = useQuery({
    queryKey: ["admin", "estimates"],
    queryFn: () => fetchAdminData(session, "estimates", 0, { limit: "1" } as any),
    enabled: !!session,
  });

  const leadsCount = leads.data?.count ?? 0;
  const estimatesCount = estimates.data?.count ?? 0;
  const avgValue = estimates.data?.avgValue ?? 0;
  const conversionRate = estimatesCount > 0 ? Math.round((leadsCount / estimatesCount) * 100) : 0;

  const handleSort = (col: string) => {
    if (sortBy === col) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(col);
      setSortDir("desc");
    }
    setLeadsPage(0);
  };

  const handleExportCSV = useCallback(async () => {
    if (!session) return;
    const params = new URLSearchParams({
      table: "leads",
      export_csv: "true",
      ...leadsFilters,
    });
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-data?${params}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
    });
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `leads-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [session, leadsFilters]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-card">
        <div className="h-6 w-6 border-2 border-sky border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen flex bg-card">
      {/* Mobile block */}
      <div className="lg:hidden flex items-center justify-center min-h-screen w-full px-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-navy">
              <span className="text-sky font-bold text-sm">vm</span>
            </div>
            <span className="text-lg font-bold text-navy">Valuemetrics</span>
          </div>
          <p className="text-mid text-sm">Admin dashboard is available on desktop only.</p>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-[220px] bg-navy text-white shrink-0 min-h-screen">
        <div className="p-5 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10">
            <span className="text-sky font-bold text-xs">vm</span>
          </div>
          <span className="font-bold text-sm text-white/90">Valuemetrics</span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeNav === item.id
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="hidden lg:flex flex-col flex-1 min-h-screen">
        <div className="mx-auto w-full max-w-[1200px] px-8 py-8 space-y-6">
          {/* Page title */}
          <div>
            <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
            <p className="text-sm text-mid mt-1">Overview of leads and estimates</p>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-4">
            <SummaryCard icon={Users} label="Total Leads" value={String(leadsCount)} loading={leads.isLoading} />
            <SummaryCard icon={BarChart3} label="Total Estimates" value={String(estimatesCount)} loading={estimates.isLoading} />
            <SummaryCard icon={TrendingUp} label="Conversion Rate" value={`${conversionRate}%`} loading={leads.isLoading || estimates.isLoading} />
            <SummaryCard icon={DollarSign} label="Avg. Est. Value" value={formatCurrency(avgValue)} loading={estimates.isLoading} />
          </div>

          <Separator />

          {/* Filters + export */}
          <div className="flex items-center gap-3 flex-wrap">
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setLeadsPage(0); }}
              className="w-[160px] rounded-md text-sm"
              placeholder="From"
            />
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setLeadsPage(0); }}
              className="w-[160px] rounded-md text-sm"
              placeholder="To"
            />
            <Select
              value={situationFilter}
              onValueChange={(v) => { setSituationFilter(v === "all" ? "" : v); setLeadsPage(0); }}
            >
              <SelectTrigger className="w-[220px] rounded-md text-sm">
                <SelectValue placeholder="All situations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All situations</SelectItem>
                {SITUATIONS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="text-sm font-medium"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Export CSV
            </Button>
          </div>

          {/* Leads table */}
          <div className="border border-border rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <SortableHead label="Date" column="created_at" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  <SortableHead label="Name" column="full_name" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                  <TableHead className="text-xs uppercase text-mid font-semibold">Email</TableHead>
                  <TableHead className="text-xs uppercase text-mid font-semibold">Phone</TableHead>
                  <TableHead className="text-xs uppercase text-mid font-semibold">Address</TableHead>
                  <TableHead className="text-xs uppercase text-mid font-semibold">Situation</TableHead>
                  <TableHead className="text-xs uppercase text-mid font-semibold">Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-mid">Loading…</TableCell>
                  </TableRow>
                )}
                {!leads.isLoading && leads.data?.data?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-mid">No leads found</TableCell>
                  </TableRow>
                )}
                {leads.data?.data?.map((lead: any, i: number) => (
                  <TableRow
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="cursor-pointer hover:bg-sky/5 transition-colors"
                    style={i % 2 === 1 ? { backgroundColor: "hsl(var(--muted) / 0.3)" } : undefined}
                  >
                    <TableCell className="text-sm text-mid whitespace-nowrap">{formatDate(lead.created_at)}</TableCell>
                    <TableCell className="text-sm font-medium text-navy">{lead.full_name || "—"}</TableCell>
                    <TableCell className="text-sm">{lead.email}</TableCell>
                    <TableCell className="text-sm text-mid">{lead.phone || "—"}</TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">
                      {lead.vm_estimates?.formatted_address || lead.vm_estimates?.address_input || "—"}
                    </TableCell>
                    <TableCell className="text-sm max-w-[180px] truncate text-mid">{lead.situation || "—"}</TableCell>
                    <TableCell className="text-sm text-mid">{lead.utm_source || "direct"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {leadsCount > PAGE_SIZE && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <span className="text-xs text-mid">
                  Page {leadsPage + 1} of {Math.ceil(leadsCount / PAGE_SIZE)}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={leadsPage === 0} onClick={() => setLeadsPage((p) => p - 1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" disabled={(leadsPage + 1) * PAGE_SIZE >= leadsCount} onClick={() => setLeadsPage((p) => p + 1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Lead detail slide-in */}
      {selectedLead && (
        <LeadDetailPanel lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}
    </div>
  );
};

/* ─── Summary Card ──────────────────────────────────── */
function SummaryCard({ icon: Icon, label, value, loading }: {
  icon: any; label: string; value: string; loading: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-mid uppercase tracking-wide">{label}</span>
        <Icon className="h-4 w-4 text-sky" />
      </div>
      <p className="text-sky font-bold tabular-nums" style={{ fontSize: "32px" }}>
        {loading ? "…" : value}
      </p>
    </div>
  );
}

/* ─── Sortable Table Head ───────────────────────────── */
function SortableHead({ label, column, sortBy, sortDir, onSort }: {
  label: string; column: string; sortBy: string; sortDir: string; onSort: (col: string) => void;
}) {
  const active = sortBy === column;
  return (
    <TableHead
      className="text-xs uppercase text-mid font-semibold cursor-pointer hover:text-navy transition-colors"
      onClick={() => onSort(column)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown className={`h-3 w-3 ${active ? "text-navy" : ""}`} />
      </span>
    </TableHead>
  );
}

/* ─── Lead Detail Panel ─────────────────────────────── */
function LeadDetailPanel({ lead, onClose }: { lead: any; onClose: () => void }) {
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-[400px] bg-card border-l border-border z-50 shadow-xl animate-in slide-in-from-right duration-200 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy">Lead Details</h2>
            <button onClick={onClose} className="text-mid hover:text-navy transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky/10 text-sky text-xs font-semibold uppercase">
            New
          </div>

          <div className="space-y-4">
            <DetailField label="Full Name" value={lead.full_name} />
            <DetailField label="Email" value={lead.email} />
            <DetailField label="Phone" value={lead.phone} />
            <DetailField label="Address" value={lead.vm_estimates?.formatted_address || lead.vm_estimates?.address_input} />
            <DetailField label="Estimated Value" value={lead.vm_estimates?.estimated_value ? formatCurrency(lead.vm_estimates.estimated_value) : null} />
            <DetailField label="Situation" value={lead.situation} />
            <DetailField label="Submitted" value={formatDateTime(lead.created_at)} />
            <DetailField label="Source" value={[lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(" / ") || "Direct"} />
          </div>
        </div>
      </div>
    </>
  );
}

function DetailField({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs font-medium text-mid mb-0.5">{label}</p>
      <p className="text-sm text-navy">{value || "—"}</p>
    </div>
  );
}

export default Admin;
