import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full bg-card sticky top-0 z-50 h-16 border-b border-border">
      <div className="container flex h-full items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-navy">
            <span className="text-sky font-bold text-sm leading-none">vm</span>
          </div>
          <span className="text-lg font-bold text-navy tracking-tight font-primary">
            Valuemetrics
          </span>
        </Link>
        <Link
          to="/"
          className="text-sm font-medium text-mid hover:text-navy transition-colors"
        >
          For Professionals
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
