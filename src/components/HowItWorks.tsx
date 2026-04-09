import { MapPin, BarChart3, FileText } from "lucide-react";

const steps = [
  {
    icon: MapPin,
    title: "Enter Address",
    description: "Type any U.S. residential property address to begin.",
  },
  {
    icon: BarChart3,
    title: "Get Valuation",
    description: "Our AVM analyzes comparable sales and market data instantly.",
  },
  {
    icon: FileText,
    title: "Download Report",
    description: "Share your name & email to receive a detailed PDF report.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-card">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-navy mb-3">How It Works</h2>
          <p className="text-mid text-base max-w-md mx-auto">
            Three simple steps to an accurate property valuation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative bg-slate-bg rounded-lg p-8 text-center border border-border hover:shadow-md transition-shadow"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-navy text-sky text-xs font-bold">
                {i + 1}
              </div>
              <div className="flex justify-center mb-5 mt-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky/10">
                  <step.icon className="h-6 w-6 text-sky" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">{step.title}</h3>
              <p className="text-sm text-mid leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
