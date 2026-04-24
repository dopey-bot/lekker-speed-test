import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Home from "@/pages/Home";
import Result from "@/pages/Result";
import Suggest from "@/pages/Suggest";
import Advertise from "@/pages/Advertise";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <SiteHeader />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/result/:id" element={<Result />} />
              <Route path="/suggest" element={<Suggest />} />
              <Route path="/advertise" element={<Advertise />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <SiteFooter />
        </div>
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </HelmetProvider>
  );
}