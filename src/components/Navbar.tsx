import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="w-full border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-navy">
            <Building2 className="h-5 w-5 text-sky" />
          </div>
          <span className="text-lg font-bold text-navy tracking-tight">
            Valuemetrics
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-mid hover:text-navy transition-colors"
          >
            Home
          </Link>
          <Link
            to="/"
            className="text-sm font-medium text-mid hover:text-navy transition-colors"
          >
            How It Works
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
