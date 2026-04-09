import AddressSearch from "./AddressSearch";
import { TrendingUp, Shield, Zap } from "lucide-react";

const stats = [
  { icon: TrendingUp, label: "Properties Valued", value: "2.4M+" },
  { icon: Shield, label: "Data Accuracy", value: "97.3%" },
  { icon: Zap, label: "Instant Results", value: "<3s" },
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-slate-bg">
      {/* Decorative bg */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-sky/5" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-navy/5" />
      </div>

      <div className="container relative pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-navy/5 text-navy text-xs font-semibold px-4 py-1.5 rounded-full">
            <Zap className="h-3.5 w-3.5 text-sky" />
            Powered by ATTOM AVM Data
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight tracking-tight">
            Know Your Property's
            <span className="text-sky"> True Value</span>
          </h1>

          <p className="text-lg md:text-xl text-mid max-w-xl mx-auto leading-relaxed">
            Get an instant, data-driven property valuation backed by
            comparable sales and neighborhood analytics.
          </p>

          <AddressSearch />
        </div>

        {/* Stats bar */}
        <div className="mt-16 max-w-2xl mx-auto grid grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center space-y-1">
              <div className="flex justify-center">
                <stat.icon className="h-5 w-5 text-sky" />
              </div>
              <p className="text-2xl font-bold text-navy tabular-nums">
                {stat.value}
              </p>
              <p className="text-xs text-mid font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
