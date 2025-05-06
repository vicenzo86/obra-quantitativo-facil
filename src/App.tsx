
import React, { useState, useEffect, createContext } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/hooks/useCart";
import Login from "./pages/Login";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";
import { createClient } from "@supabase/supabase-js";

// Criar contexto para gerenciar o Supabase e autenticação
export const SupabaseContext = createContext<{
  supabase: any;
  user: any;
  loading: boolean;
}>({
  supabase: null,
  user: null,
  loading: true
});

const queryClient = new QueryClient();

// Preparar conexão com Supabase - será configurado quando o usuário fornecer as credenciais
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Inicializa o cliente Supabase apenas se as credenciais existirem
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Componente ProtectedRoute que verifica autenticação
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }
  
  // Se não houver cliente Supabase ou usuário, redireciona para login
  if (!supabase || !user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Hook personalizado para simplificar o acesso ao contexto do Supabase
const useAuth = () => {
  const { user, loading } = React.useContext(SupabaseContext);
  return { user, loading };
};

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se o cliente Supabase foi inicializado
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseContext.Provider value={{ supabase, user, loading }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Mudança para tornar a página de login como rota padrão */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/produtos" element={
                  // Se não houver Supabase configurado, mostra o Index sem proteção
                  supabase ? <ProtectedRoute><Index /></ProtectedRoute> : <Index />
                } />
                <Route path="/produto/:id" element={
                  supabase ? <ProtectedRoute><ProductDetail /></ProtectedRoute> : <ProductDetail />
                } />
                <Route path="/carrinho" element={
                  supabase ? <ProtectedRoute><Cart /></ProtectedRoute> : <Cart />
                } />
                <Route path="/pedidos" element={
                  supabase ? <ProtectedRoute><Orders /></ProtectedRoute> : <Orders />
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </SupabaseContext.Provider>
  );
};

export default App;
