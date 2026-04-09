import { useSearchParams, useLocation, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ValuationDisplay from "@/components/ValuationDisplay";
import ComparableSales from "@/components/ComparableSales";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import { ArrowLeft } from "lucide-react";

// Fallback demo data if navigated directly without state
const FALLBACK_VALUATION = {
  estimatedValue: 685000,
  confidenceLow: 645000,
  confidenceHigh: 725000,
  confidenceScore: 0.87,
};

const FALLBACK_COMPS = [
  { address: "456 Oak Ave, Anytown, CA 90210", salePrice: 670000, saleDate: "Mar 2024", sqft: 1850, beds: 3, baths: 2, distance: "0.3 mi" },
  { address: "789 Elm St, Anytown, CA 90210", salePrice: 710000, saleDate: "Feb 2024", sqft: 2100, beds: 4, baths: 2.5, distance: "0.5 mi" },
  { address: "321 Maple Dr, Anytown, CA 90210", salePrice: 655000, saleDate: "Jan 2024", sqft: 1720, beds: 3, baths: 2, distance: "0.7 mi" },
];

const Results = () => {
  const [params] = useSearchParams();
  const location = useLocation();

  const state = location.state as {
    valuation?: typeof FALLBACK_VALUATION;
    comps?: typeof FALLBACK_COMPS;
    formattedAddress?: string;
    error?: boolean;
  } | null;

  const address = state?.formattedAddress || params.get("address") || "Unknown Address";
  const valuation = state?.valuation || FALLBACK_VALUATION;
  const comps = state?.comps || FALLBACK_COMPS;
  const hasError = state?.error;

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

          {hasError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700">
                Estimate unavailable for this property. The values shown below are approximate. Please fill out the form for a professional assessment.
              </p>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ValuationDisplay
                formattedAddress={address}
                {...valuation}
              />
              <ComparableSales comps={comps} />
            </div>
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
