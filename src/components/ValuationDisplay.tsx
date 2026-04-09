import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ValuationDisplayProps {
  estimatedValue: number;
  confidenceLow: number;
  confidenceHigh: number;
  confidenceScore: number;
  formattedAddress: string;
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);

const ValuationDisplay = ({
  estimatedValue,
  confidenceLow,
  confidenceHigh,
  confidenceScore,
  formattedAddress,
}: ValuationDisplayProps) => {
  const confidencePercent = Math.round(confidenceScore * 100);
  const confidenceColor =
    confidencePercent >= 80
      ? "text-emerald-600"
      : confidencePercent >= 60
        ? "text-amber-500"
        : "text-red-500";

  return (
    <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
      <p className="text-sm text-mid mb-1">Estimated Market Value</p>
      <p className="text-sm font-medium text-navy mb-4">{formattedAddress}</p>

      <p className="text-5xl font-bold text-navy tabular-nums mb-2">
        {formatCurrency(estimatedValue)}
      </p>

      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-1.5">
          <TrendingDown className="h-4 w-4 text-mid" />
          <span className="text-sm text-mid tabular-nums">
            {formatCurrency(confidenceLow)}
          </span>
        </div>
        <Minus className="h-4 w-4 text-border" />
        <div className="flex items-center gap-1.5">
          <TrendingUp className="h-4 w-4 text-mid" />
          <span className="text-sm text-mid tabular-nums">
            {formatCurrency(confidenceHigh)}
          </span>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-mid">Confidence</span>
          <span className={`text-sm font-bold tabular-nums ${confidenceColor}`}>
            {confidencePercent}%
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-sky rounded-full transition-all duration-500"
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ValuationDisplay;
