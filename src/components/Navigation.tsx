
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { SupabaseContext } from '@/App';
import { useContext } from 'react';
import { LogOut, LogIn } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { supabase } = useContext(SupabaseContext);
  const { toast } = useToast();
  
  const navItems = [
    { name: 'Produtos', path: '/produtos' },
    { name: 'Carrinho', path: '/carrinho' },
    { name: 'Pedidos', path: '/pedidos' }
  ];
  
  const handleLogout = async () => {
    if (!supabase) {
      toast({
        title: "Erro ao fazer logout",
        description: "Supabase não está configurado.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleNavigation = (path: string) => {
    // Navigation happens even without Supabase login
    navigate(path);
  };
  
  return (
    <nav className="laticrete-nav">
      {navItems.map(item => (
        <div 
          key={item.path}
          className={`laticrete-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => handleNavigation(item.path)}
        >
          {item.name}
        </div>
      ))}
      
      {supabase && user ? (
        <div 
          className="laticrete-nav-item flex items-center"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-1" />
          Sair
        </div>
      ) : (
        <div 
          className="laticrete-nav-item flex items-center"
          onClick={() => navigate('/login')}
        >
          <LogIn className="h-4 w-4 mr-1" />
          Entrar
        </div>
      )}
    </nav>
  );
};

export default Navigation;
