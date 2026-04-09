import { useSearchParams, useLocation, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ValuationDisplay from "@/components/ValuationDisplay";
import ComparableSales from "@/components/ComparableSales";
import NeighborhoodModule from "@/components/NeighborhoodModule";
import {
  ExpertReviewCTA,
  LeadCaptureModal,
  useLeadModal,
} from "@/components/LeadCaptureModal";
import { ArrowLeft } from "lucide-react";

const DEMO_VALUATION = {
  estimatedValue: 487500,
  confidenceLow: 458000,
  confidenceHigh: 517000,
  confidenceScore: 0.87,
};

const DEMO_COMPS = [
  { address: "456 Oak Ave, Anytown, CA 90210", salePrice: 510000, saleDate: "Mar 2024", sqft: 1850, beds: 3, baths: 2, distance: "0.3 mi" },
  { address: "789 Elm St, Anytown, CA 90210", salePrice: 495000, saleDate: "Feb 2024", sqft: 2100, beds: 4, baths: 2.5, distance: "0.5 mi" },
  { address: "321 Maple Dr, Anytown, CA 90210", salePrice: 472000, saleDate: "Jan 2024", sqft: 1720, beds: 3, baths: 2, distance: "0.7 mi" },
  { address: "654 Pine Ct, Anytown, CA 90210", salePrice: 465000, saleDate: "Dec 2023", sqft: 1680, beds: 3, baths: 2, distance: "0.8 mi" },
  { address: "987 Cedar Ln, Anytown, CA 90210", salePrice: 520000, saleDate: "Nov 2023", sqft: 2050, beds: 4, baths: 3, distance: "0.9 mi" },
];

const DEMO_NEIGHBORHOOD = {
  medianPricePerSqft: 268,
  avgDaysOnMarket: 22,
  activeListings: 14,
  priceTrend3Month: 3.2,
  trendData: [
    { month: "Apr", median: 245 }, { month: "May", median: 248 },
    { month: "Jun", median: 252 }, { month: "Jul", median: 250 },
    { month: "Aug", median: 255 }, { month: "Sep", median: 258 },
    { month: "Oct", median: 260 }, { month: "Nov", median: 257 },
    { month: "Dec", median: 262 }, { month: "Jan", median: 264 },
    { month: "Feb", median: 266 }, { month: "Mar", median: 268 },
  ],
};

const Results = () => {
  const [params] = useSearchParams();
  const location = useLocation();
  const { open, submitted, openModal, closeModal, markSubmitted } = useLeadModal();

  const state = location.state as {
    valuation?: typeof DEMO_VALUATION;
    comps?: typeof DEMO_COMPS;
    formattedAddress?: string;
    error?: boolean;
  } | null;

  const address = state?.formattedAddress || params.get("address") || "Unknown Address";
  const valuation = state?.valuation || DEMO_VALUATION;
  const comps = state?.comps || DEMO_COMPS;
  const hasError = state?.error;

  return (
    <div className="min-h-screen flex flex-col bg-card">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-[960px] px-4 py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-mid hover:text-navy transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            New Search
          </Link>

          {hasError && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-destructive">
                Estimate unavailable for this property. Values shown are approximate.
              </p>
            </div>
          )}

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left – 40% */}
            <div className="lg:col-span-2 space-y-6">
              <ValuationDisplay formattedAddress={address} {...valuation} />
              {!submitted && <ExpertReviewCTA onClick={openModal} />}
            </div>

            {/* Right – 60% */}
            <div className="lg:col-span-3 space-y-6">
              <ComparableSales comps={comps} />
              <NeighborhoodModule data={DEMO_NEIGHBORHOOD} />
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Mobile sticky CTA */}
      {!submitted && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-3 z-40">
          <Button
            onClick={openModal}
            className="w-full h-12 rounded-md bg-navy text-sky hover:bg-navy/90 font-semibold text-base"
          >
            Get Expert Review
          </Button>
        </div>
      )}

      <LeadCaptureModal
        open={open}
        onClose={closeModal}
        onSubmitted={markSubmitted}
      />
    </div>
  );
};

export default Results;
