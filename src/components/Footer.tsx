import { Building2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navy py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sky/20">
              <Building2 className="h-4 w-4 text-sky" />
            </div>
            <span className="text-base font-bold text-sky tracking-tight">
              Valuemetrics
            </span>
          </div>
          <p className="text-sm text-sky/60">
            © {new Date().getFullYear()} Valuemetrics Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
