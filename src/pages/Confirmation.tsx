import { useLocation, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);

const Confirmation = () => {
  const location = useLocation();
  const state = location.state as {
    email?: string;
    address?: string;
    estimatedValue?: number;
    confidenceLow?: number;
    confidenceHigh?: number;
    resultsUrl?: string;
  } | null;

  const email = state?.email || "your email";
  const address = state?.address || "Your Property";
  const estimatedValue = state?.estimatedValue || 487500;
  const confidenceLow = state?.confidenceLow || 458000;
  const confidenceHigh = state?.confidenceHigh || 517000;
  const resultsUrl = state?.resultsUrl || "/results";

  const truncatedAddress =
    address.length > 50 ? address.slice(0, 47) + "…" : address;

  return (
    <div className="min-h-screen flex flex-col bg-slate-bg">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-[520px] space-y-5 md:space-y-6">
          {/* Main confirmation card */}
          <div className="bg-card rounded-xl p-6 md:p-12 text-center space-y-4 md:space-y-5">
            {/* Checkmark icon */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy">
              <Check className="h-6 w-6 text-sky" strokeWidth={3} />
            </div>

            <h1 className="text-2xl md:text-[28px] font-bold text-navy">Review Requested</h1>

            <p className="text-sm md:text-base text-mid leading-relaxed">
              We've sent your estimate summary to{" "}
              <span className="font-medium text-navy break-all">{email}</span>. A local
              specialist will be in touch within 2 hours.
            </p>

            <div className="border-t border-border my-4 md:my-6" />

            {/* Estimate recap card */}
            <div className="bg-slate-bg rounded-xl p-5 md:p-6 text-center space-y-2">
              <p className="text-sm text-mid truncate">{truncatedAddress}</p>
              <p
                className="text-2xl md:text-3xl font-extrabold text-navy"
                style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}
              >
                {formatCurrency(estimatedValue)}
              </p>
              <p
                className="text-xs md:text-sm text-mid"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {formatCurrency(confidenceLow)} – {formatCurrency(confidenceHigh)}
              </p>
            </div>

            <Link to={resultsUrl}>
              <Button
                variant="outline"
                className="w-full h-11 rounded-md border-sky text-sky hover:bg-sky/5 font-semibold mt-4"
              >
                View your estimate
              </Button>
            </Link>
          </div>

          {/* Editorial module */}
          <div className="bg-card rounded-xl p-6 md:p-8 text-center space-y-3">
            <h3 className="text-lg font-bold text-navy">Find homes near you</h3>
            <p className="text-sm text-mid leading-relaxed">
              Get free email alerts when homes matching your criteria hit the market.
            </p>
            <Button
              variant="ghost"
              className="text-sky hover:text-sky/80 font-semibold text-sm"
              asChild
            >
              <a href="#" className="inline-flex items-center gap-1">
                Explore Listings
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Confirmation;
