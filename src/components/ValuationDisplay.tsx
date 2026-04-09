import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const getConfidenceLabel = (score: number) => {
  if (score > 0.75) return "HIGH CONFIDENCE";
  if (score > 0.5) return "MODERATE CONFIDENCE";
  return "LOW CONFIDENCE";
};

const ValuationDisplay = ({
  estimatedValue,
  confidenceLow,
  confidenceHigh,
  confidenceScore,
  formattedAddress,
}: ValuationDisplayProps) => {
  return (
    <div className="space-y-5">
      {/* Address */}
      <p className="text-sm font-medium text-navy">{formattedAddress}</p>

      {/* Eyebrow */}
      <p
        className="text-sky font-semibold uppercase"
        style={{ fontSize: "11px", letterSpacing: "0.1em" }}
      >
        ESTIMATED MARKET VALUE
      </p>

      {/* Big value */}
      <p
        className="text-navy font-extrabold"
        style={{
          fontSize: "56px",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}
      >
        {formatCurrency(estimatedValue)}
      </p>

      {/* Confidence range + tooltip */}
      <div className="flex items-center gap-2">
        <p
          className="text-mid"
          style={{
            fontSize: "20px",
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.02em",
          }}
        >
          {formatCurrency(confidenceLow)} – {formatCurrency(confidenceHigh)}
        </p>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-mid hover:text-navy transition-colors">
              <Info className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-[260px] text-xs">
            Our confidence range reflects the variability in recent comparable
            sales. High confidence means recent nearby sales are closely priced.
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Confidence badge */}
      <div>
        <span
          className="inline-block bg-sky/15 text-sky font-bold uppercase rounded-full px-3 py-1"
          style={{ fontSize: "10px", letterSpacing: "0.08em" }}
        >
          {getConfidenceLabel(confidenceScore)}
        </span>
      </div>

      {/* Date line */}
      <p className="text-mid" style={{ fontSize: "12px" }}>
        Based on data through March 2026
      </p>
    </div>
  );
};

export default ValuationDisplay;
