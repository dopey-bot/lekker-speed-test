import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

export default function NotFound() {
  return (
    <>
      <SEO
        title="Page not found"
        description="This page doesn't exist."
        path="/404"
        noindex
      />
      <div className="container py-20 text-center space-y-4">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link to="/">Go home</Link>
        </Button>
      </div>
    </>
  );
}
