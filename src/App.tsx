
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import ConsumptionList from "./pages/ConsumptionList";
import SheetsList from "./pages/SheetsList";
import TechnicalSheet from "./pages/TechnicalSheet";
import Calculator from "./pages/Calculator";
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
          <Route path="/produto/:id" element={<ProductDetail />} />
          <Route path="/consumo" element={<ConsumptionList />} />
          <Route path="/fichas" element={<SheetsList />} />
          <Route path="/ficha/:id" element={<TechnicalSheet />} />
          <Route path="/calculadora" element={<Calculator />} />
          <Route path="/calculadora/:id" element={<Calculator />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
