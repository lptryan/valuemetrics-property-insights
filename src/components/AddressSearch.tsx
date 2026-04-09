import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import EstimateLoading from "@/components/EstimateLoading";

// Demo data used until ATTOM API is wired up
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

const AddressSearch = () => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      setLoading(true);
    }
  };

  const handleLoadingComplete = () => {
    navigate(`/results?address=${encodeURIComponent(address.trim())}`, {
      state: {
        valuation: DEMO_VALUATION,
        comps: DEMO_COMPS,
        formattedAddress: address.trim(),
      },
    });
  };

  return (
    <>
      {loading && (
        <EstimateLoading
          address={address.trim()}
          onComplete={handleLoadingComplete}
        />
      )}
      <form onSubmit={handleSubmit} className="w-full">
        {/* Desktop: inline button */}
        <div className="hidden md:flex relative items-center bg-card border border-border rounded-md overflow-hidden h-14 focus-within:border-sky focus-within:ring-[3px] focus-within:ring-sky/15 transition-all">
          <div className="flex items-center pl-4 text-mid">
            <MapPin className="h-5 w-5" />
          </div>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your property address"
            className="flex-1 px-3 py-3 text-base bg-transparent text-foreground placeholder:text-mid outline-none font-primary"
          />
          <Button
            type="submit"
            className="m-1.5 rounded-full bg-navy text-sky hover:bg-navy/90 px-5 h-10 font-semibold text-base transition-all"
            disabled={!address.trim()}
          >
            Estimate Value
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Mobile: stacked input + full-width button */}
        <div className="flex md:hidden flex-col gap-3">
          <div className="flex items-center bg-card border border-border rounded-md h-14 focus-within:border-sky focus-within:ring-[3px] focus-within:ring-sky/15 transition-all">
            <div className="flex items-center pl-4 text-mid">
              <MapPin className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your property address"
              className="flex-1 px-3 py-3 text-base bg-transparent text-foreground placeholder:text-mid outline-none font-primary"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-12 rounded-md bg-navy text-sky hover:bg-navy/90 font-semibold text-base transition-all"
            disabled={!address.trim()}
          >
            Estimate Value
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </form>
    </>
  );
};

export default AddressSearch;
