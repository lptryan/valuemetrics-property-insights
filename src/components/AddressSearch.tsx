import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const AddressSearch = () => {
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      navigate(`/results?address=${encodeURIComponent(address.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center bg-card rounded-lg shadow-lg border border-border overflow-hidden">
        <div className="flex items-center pl-4 text-mid">
          <MapPin className="h-5 w-5" />
        </div>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter a property address…"
          className="flex-1 px-4 py-4 text-base bg-transparent text-foreground placeholder:text-mid outline-none font-primary"
        />
        <Button
          type="submit"
          className="m-1.5 rounded-md bg-navy text-sky hover:bg-navy/90 px-6 h-10 font-semibold transition-all"
          disabled={!address.trim()}
        >
          <Search className="h-4 w-4 mr-2" />
          Estimate
        </Button>
      </div>
      <p className="text-xs text-mid mt-3 text-center">
        Try: 123 Main St, Anytown, CA 90210
      </p>
    </form>
  );
};

export default AddressSearch;
