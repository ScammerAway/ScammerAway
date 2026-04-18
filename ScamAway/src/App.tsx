import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Landing from "./pages/Landing.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import Home from "./pages/Home.tsx";
import LearnIndex from "./pages/LearnIndex.tsx";
import LessonView from "./pages/LessonView.tsx";
import PracticeIndex from "./pages/PracticeIndex.tsx";
import PracticeRun from "./pages/PracticeRun.tsx";
import Test from "./pages/Test.tsx";
import Resource from "./pages/Resource.tsx"

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/app" element={<Home />} />
          <Route path="/learn" element={<LearnIndex />} />
          <Route path="/learn/:id" element={<LessonView />} />
          <Route path="/practice" element={<PracticeIndex />} />
          <Route path="/practice/:id" element={<PracticeRun />} />
          <Route path="/test" element={<Test />} />
          <Route path="/legacy" element={<Index />} />
          <Route path="/resource" element={<Resource/>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
