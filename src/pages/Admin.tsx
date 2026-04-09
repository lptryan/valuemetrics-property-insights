import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 20;

function useAdminData(table: string, page: number) {
  return useQuery({
    queryKey: ["admin", table, page],
    queryFn: async () => {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-data?table=${table}&limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch admin data");
      return res.json() as Promise<{ data: any[]; count: number }>;
    },
  });
}

function formatCurrency(val: number | null) {
  if (val == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
}

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const Admin = () => {
  const [leadsPage, setLeadsPage] = useState(0);
  const [estimatesPage, setEstimatesPage] = useState(0);

  const leads = useAdminData("leads", leadsPage);
  const estimates = useAdminData("estimates", estimatesPage);

  const leadsCount = leads.data?.count ?? 0;
  const estimatesCount = estimates.data?.count ?? 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Admin Dashboard</h1>
          <p className="text-sm text-mid mt-1">View submitted leads and valuation history</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-mid">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-sky" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tabular-nums text-navy">{leads.isLoading ? "…" : leadsCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-mid">Total Estimates</CardTitle>
              <BarChart3 className="h-4 w-4 text-sky" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tabular-nums text-navy">{estimates.isLoading ? "…" : estimatesCount}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="leads">
          <TabsList>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="estimates">Estimates</TabsTrigger>
          </TabsList>

          {/* Leads tab */}
          <TabsContent value="leads">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Situation</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.isLoading && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-mid">Loading…</TableCell>
                      </TableRow>
                    )}
                    {leads.data?.data?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-mid">No leads yet</TableCell>
                      </TableRow>
                    )}
                    {leads.data?.data?.map((lead: any) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.full_name || "—"}</TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell>{lead.phone || "—"}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{lead.situation || "—"}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{lead.vm_estimates?.formatted_address || "—"}</TableCell>
                        <TableCell className="tabular-nums">{formatCurrency(lead.vm_estimates?.estimated_value)}</TableCell>
                        <TableCell className="text-mid text-xs whitespace-nowrap">{formatDate(lead.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {leadsCount > PAGE_SIZE && (
                  <div className="flex items-center justify-between px-4 py-3 border-t">
                    <span className="text-xs text-mid">Page {leadsPage + 1} of {Math.ceil(leadsCount / PAGE_SIZE)}</span>
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Estimates tab */}
          <TabsContent value="estimates">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Address</TableHead>
                      <TableHead>Estimated Value</TableHead>
                      <TableHead>Range</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {estimates.isLoading && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-mid">Loading…</TableCell>
                      </TableRow>
                    )}
                    {estimates.data?.data?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-mid">No estimates yet</TableCell>
                      </TableRow>
                    )}
                    {estimates.data?.data?.map((est: any) => (
                      <TableRow key={est.id}>
                        <TableCell className="font-medium max-w-[280px] truncate">{est.formatted_address || est.address_input || "—"}</TableCell>
                        <TableCell className="tabular-nums font-semibold">{formatCurrency(est.estimated_value)}</TableCell>
                        <TableCell className="tabular-nums text-mid text-sm">
                          {est.confidence_low && est.confidence_high ? `${formatCurrency(est.confidence_low)} – ${formatCurrency(est.confidence_high)}` : "—"}
                        </TableCell>
                        <TableCell className="tabular-nums">{est.confidence_score != null ? `${est.confidence_score}%` : "—"}</TableCell>
                        <TableCell className="text-mid text-xs whitespace-nowrap">{formatDate(est.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {estimatesCount > PAGE_SIZE && (
                  <div className="flex items-center justify-between px-4 py-3 border-t">
                    <span className="text-xs text-mid">Page {estimatesPage + 1} of {Math.ceil(estimatesCount / PAGE_SIZE)}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled={estimatesPage === 0} onClick={() => setEstimatesPage((p) => p - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" disabled={(estimatesPage + 1) * PAGE_SIZE >= estimatesCount} onClick={() => setEstimatesPage((p) => p + 1)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
