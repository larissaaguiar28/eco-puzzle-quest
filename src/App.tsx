import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HomeLayout from "./layouts/HomeLayout";
import Dashboard from "./pages/home/Dashboard";
import NewsFeed from "./pages/home/NewsFeed";
import Chatbot from "./pages/home/Chatbot";
import Games from "./pages/home/Games";
import Profile from "./pages/home/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<HomeLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="feed" element={<NewsFeed />} />
            <Route path="chatbot" element={<Chatbot />} />
            <Route path="games" element={<Games />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
