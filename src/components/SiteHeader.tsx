import { Link } from "react-router-dom";
import { SAFlag } from "./SAFlag";

export function SiteHeader() {
  return (
    <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 font-bold text-lg">
          <SAFlag className="h-6 w-9 rounded-sm shadow-sm" />
          <span>Lekker Speed Test</span>
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link to="/suggest" className="hover:text-primary">
            Suggest a slogan
          </Link>
          <Link to="/advertise" className="hover:text-primary">
            Advertise
          </Link>
        </nav>
      </div>
    </header>
  );
}