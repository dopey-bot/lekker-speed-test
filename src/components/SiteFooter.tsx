import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="border-t mt-16">
      <div className="container py-8 text-sm text-muted-foreground grid gap-6 md:grid-cols-3">
        <div>
          <p className="font-semibold text-foreground">Lekker Speed Test</p>
          <p>
            South Africa's internet speed test — with local humour. Powered by
            Cloudflare's edges in Johannesburg and Cape Town.
          </p>
        </div>
        <div className="flex gap-4 md:justify-center">
          <Link to="/" className="hover:text-primary">Test</Link>
          <Link to="/suggest" className="hover:text-primary">Suggest a slogan</Link>
          <Link to="/advertise" className="hover:text-primary">Advertise</Link>
        </div>
        <div className="md:text-right">
          <p>© {new Date().getFullYear()} Lekker Speed Test.</p>
          <p>No ISPs were harmed in the making of this website.</p>
        </div>
      </div>
    </footer>
  );
}