import { useSearchParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ValuationDisplay from "@/components/ValuationDisplay";
import ComparableSales from "@/components/ComparableSales";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import { ArrowLeft } from "lucide-react";

// Demo data — replaced by real API calls once ATTOM key is configured
const DEMO_VALUATION = {
  estimatedValue: 685000,
  confidenceLow: 645000,
  confidenceHigh: 725000,
  confidenceScore: 0.87,
};

const DEMO_COMPS = [
  {
    address: "456 Oak Ave, Anytown, CA 90210",
    salePrice: 670000,
    saleDate: "Mar 2024",
    sqft: 1850,
    beds: 3,
    baths: 2,
    distance: "0.3 mi",
  },
  {
    address: "789 Elm St, Anytown, CA 90210",
    salePrice: 710000,
    saleDate: "Feb 2024",
    sqft: 2100,
    beds: 4,
    baths: 2.5,
    distance: "0.5 mi",
  },
  {
    address: "321 Maple Dr, Anytown, CA 90210",
    salePrice: 655000,
    saleDate: "Jan 2024",
    sqft: 1720,
    beds: 3,
    baths: 2,
    distance: "0.7 mi",
  },
];

const Results = () => {
  const [params] = useSearchParams();
  const address = params.get("address") || "Unknown Address";

  return (
    <div className="min-h-screen flex flex-col bg-slate-bg">
      <Navbar />
      <main className="flex-1">
        <div className="container py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-mid hover:text-navy transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            New Search
          </Link>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left column — valuation + comps */}
            <div className="lg:col-span-2 space-y-6">
              <ValuationDisplay
                formattedAddress={address}
                {...DEMO_VALUATION}
              />
              <ComparableSales comps={DEMO_COMPS} />
            </div>

            {/* Right column — lead capture */}
            <div>
              <LeadCaptureForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
