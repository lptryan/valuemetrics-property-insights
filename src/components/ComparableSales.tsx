import { Home, Calendar, Ruler } from "lucide-react";

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

const ComparableSales = ({ comps }: ComparableSalesProps) => {
  if (!comps.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-navy">Comparable Sales</h3>
      <div className="grid gap-3">
        {comps.map((comp, i) => (
          <div
            key={i}
            className="bg-card rounded-lg border border-border p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Home className="h-4 w-4 text-sky shrink-0" />
                  <p className="text-sm font-semibold text-navy truncate">
                    {comp.address}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-mid mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {comp.saleDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Ruler className="h-3 w-3" />
                    {comp.sqft.toLocaleString()} sqft
                  </span>
                  <span>
                    {comp.beds}bd / {comp.baths}ba
                  </span>
                  <span>{comp.distance}</span>
                </div>
              </div>
              <p className="text-base font-bold text-navy tabular-nums whitespace-nowrap">
                {formatCurrency(comp.salePrice)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComparableSales;
