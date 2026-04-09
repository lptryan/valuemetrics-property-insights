import { useState, useMemo } from "react";
import { ArrowUpDown } from "lucide-react";

interface Comp {
  address: string;
  salePrice: number;
  saleDate: string;
  sqft: number;
  beds: number;
  baths: number;
  distance: string;
}

interface ComparableSalesProps {
  comps: Comp[];
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);

type SortDir = "asc" | "desc";

const ComparableSales = ({ comps }: ComparableSalesProps) => {
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(
    () =>
      [...comps].sort((a, b) =>
        sortDir === "desc" ? b.salePrice - a.salePrice : a.salePrice - b.salePrice
      ),
    [comps, sortDir]
  );

  if (!comps.length) return null;

  const toggleSort = () => setSortDir((d) => (d === "desc" ? "asc" : "desc"));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-navy">
        {comps.length} Recent Sales Nearby
      </h3>

      <div className="overflow-x-auto rounded-xl border border-border -mx-4 md:mx-0">
        <table className="w-full text-left min-w-[640px]">
          <thead>
            <tr
              className="bg-sky text-white"
              style={{ fontSize: "11px", letterSpacing: "0.05em" }}
            >
              <th className="uppercase font-semibold px-4 py-3 sticky left-0 bg-sky z-10 min-w-[180px]">
                Address
              </th>
              <th className="uppercase font-semibold px-3 py-3">Beds/Baths</th>
              <th className="uppercase font-semibold px-3 py-3">Sq Ft</th>
              <th className="uppercase font-semibold px-3 py-3">
                <button
                  onClick={toggleSort}
                  className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                >
                  Sale Price
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="uppercase font-semibold px-3 py-3">Sale Date</th>
              <th className="uppercase font-semibold px-3 py-3">$/SqFt</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((comp, i) => {
              const pricePerSqft = Math.round(comp.salePrice / comp.sqft);
              const rowBg = i % 2 === 1 ? "bg-slate-bg" : "bg-card";
              return (
                <tr key={i} className={rowBg}>
                  <td
                    className={`px-4 py-3 text-sm font-semibold text-navy sticky left-0 z-10 ${rowBg}`}
                  >
                    {comp.address}
                  </td>
                  <td className="px-3 py-3 text-sm text-foreground tabular-nums">
                    {comp.beds}bd / {comp.baths}ba
                  </td>
                  <td className="px-3 py-3 text-sm text-foreground tabular-nums">
                    {comp.sqft.toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-sm font-semibold text-navy tabular-nums">
                    {formatCurrency(comp.salePrice)}
                  </td>
                  <td className="px-3 py-3 text-sm text-mid">
                    {comp.saleDate}
                  </td>
                  <td className="px-3 py-3 text-sm font-semibold text-sky tabular-nums">
                    ${pricePerSqft}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparableSales;
