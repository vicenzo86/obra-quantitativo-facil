
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

// Hook personalizado para simplificar o acesso ao contexto do Supabase
const useAuth = () => {
  const { user, loading } = React.useContext(SupabaseContext);
  return { user, loading };
};

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false); // Alterado para iniciar como false para permitir acesso imediato

  useEffect(() => {
    // Verificar se o cliente Supabase foi inicializado
    if (!supabase) {
      // Se não houver Supabase configurado, não bloqueamos mais o acesso
      setLoading(false);
      return;
    }

    // Verificar sessão atual apenas se Supabase estiver configurado
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    // Escutar mudanças na autenticação apenas se Supabase estiver configurado
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

  // Simulação de usuário para teste quando Supabase não está configurado
  useEffect(() => {
    if (!supabase) {
      // Criar um usuário de teste fictício para permitir navegação sem Supabase
      setUser({
        id: 'test-user-id',
        email: 'teste@exemplo.com',
        user_metadata: {
          name: 'Usuário de Teste'
        }
      });
    }
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
                <Route path="/" element={<Navigate to="/produtos" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/produtos" element={<Index />} />
                <Route path="/produto/:id" element={<ProductDetail />} />
                <Route path="/carrinho" element={<Cart />} />
                <Route path="/pedidos" element={<Orders />} />
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
