import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import BookService from "./pages/BookService";
import CustomerDashboard from "./pages/CustomerDashboard";
import StandardServices from "./pages/StandardServices";
import Vendors from "./pages/Vendors";
import VendorDetail from "./pages/VendorDetail";
import BookStandard from "./pages/BookStandard";
import BookVendor from "./pages/BookVendor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/book/:id" element={<BookService />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/standard-services" element={<StandardServices />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendor/:id" element={<VendorDetail />} />
          <Route path="/book-standard/:id" element={<BookStandard />} />
          <Route path="/book-vendor/:id" element={<BookVendor />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
