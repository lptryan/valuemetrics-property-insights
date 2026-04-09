import AddressSearch from "./AddressSearch";
import { Shield } from "lucide-react";

const sampleEstimates = [
  {
    address: "1█2 Oak ████ Dr",
    city: "Austin, TX",
    value: "$485,000",
    confidence: 91,
  },
  {
    address: "7█8 Maple ██ Ave",
    city: "Denver, CO",
    value: "$612,000",
    confidence: 87,
  },
  {
    address: "3█5 Pine ████ Ln",
    city: "Raleigh, NC",
    value: "$339,000",
    confidence: 94,
  },
];

const HeroSection = () => {
  return (
    <section className="bg-slate-bg min-h-[calc(100vh-64px)] flex flex-col">
      {/* Main hero content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-[680px] text-center space-y-5 md:space-y-7 animate-fade-in">
          {/* Eyebrow */}
          <p
            className="text-sky font-semibold uppercase"
            style={{ fontSize: "11px", letterSpacing: "0.12em" }}
          >
            Data-Powered Valuation
          </p>

          {/* H1 — 36px on mobile, 52px on desktop */}
          <h1
            className="text-navy font-bold font-primary leading-tight text-[36px] md:text-[52px]"
          >
            What is your home worth?
          </h1>

          {/* Subhead */}
          <p className="text-mid font-primary max-w-[520px] mx-auto leading-relaxed text-base md:text-lg">
            Powered by public records, recent sales data, and ATTOM Analytics. No login required.
          </p>

          {/* Address input */}
          <AddressSearch />

          {/* Trust bar — stacked on mobile, inline on desktop */}
          <div className="hidden md:flex items-center justify-center gap-0 h-12 text-mid" style={{ fontSize: "13px" }}>
            <span className="tabular-nums">450,000+ Estimates Generated</span>
            <span className="mx-4 w-px h-4 bg-border" />
            <span>ATTOM Data Certified</span>
            <span className="mx-4 w-px h-4 bg-border" />
            <span>No Account Required</span>
          </div>
          <div className="flex md:hidden flex-col items-center gap-1.5 text-mid" style={{ fontSize: "13px" }}>
            <span className="tabular-nums">450,000+ Estimates Generated</span>
            <span>ATTOM Data Certified</span>
            <span>No Account Required</span>
          </div>
        </div>
      </div>

      {/* Sample estimate cards — horizontal scroll on mobile */}
      <div className="border-t border-border">
        <div className="container py-6 md:py-8">
          <div className="flex md:grid md:grid-cols-3 gap-4 max-w-4xl mx-auto overflow-x-auto pb-2 md:pb-0 snap-x snap-mandatory scrollbar-hide">
            {sampleEstimates.map((est, i) => (
              <div
                key={i}
                className="bg-card rounded-lg border border-border p-5 space-y-3 min-w-[260px] md:min-w-0 snap-start flex-shrink-0"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-navy blur-[1.5px] select-none">
                    {est.address}
                  </p>
                  <p className="text-xs text-mid">{est.city}</p>
                </div>
                <p className="text-2xl font-bold text-navy tabular-nums">
                  {est.value}
                </p>
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-sky" />
                  <span className="text-xs font-medium text-sky tabular-nums">
                    {est.confidence}% confidence
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
