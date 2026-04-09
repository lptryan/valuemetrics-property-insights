import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
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
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center bg-card border border-border rounded-md overflow-hidden h-14">
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
    </form>
  );
};

export default AddressSearch;
