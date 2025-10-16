
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ContentManager from "./pages/admin/ContentManager";
import GalleryManager from "./pages/admin/GalleryManager";
import TestimonialsManager from "./pages/admin/TestimonialsManager";
import UsersManager from "./pages/admin/UsersManager";
import SettingsManager from "./pages/admin/SettingsManager";
import MediaManager from "./pages/admin/MediaManager";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ Dados ficam "fresh" por apenas 30 segundos
      staleTime: 30 * 1000, // 30s
      
      // ✅ Cache mantido por 5 minutos
      gcTime: 5 * 60 * 1000, // 5min (antes era cacheTime)
      
      // ✅ Refetch quando usuário retorna à aba
      refetchOnWindowFocus: true,
      
      // ✅ Refetch quando reconecta à internet
      refetchOnReconnect: true,
      
      // ✅ Não retentar em caso de erro (para não sobrecarregar)
      retry: 1,
      
      // ✅ Tempo de retry
      retryDelay: 1000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/contato" element={<Contact />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            
            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/conteudo" element={<ContentManager />} />
              <Route path="/admin/galeria" element={<GalleryManager />} />
              <Route path="/admin/depoimentos" element={<TestimonialsManager />} />
              <Route path="/admin/midia" element={<MediaManager />} />
            </Route>
            
            {/* Admin Only Routes */}
            <Route element={<ProtectedRoute requireAdmin />}>
              <Route path="/admin/usuarios" element={<UsersManager />} />
              <Route path="/admin/configuracoes" element={<SettingsManager />} />
            </Route>
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
