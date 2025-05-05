
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/App';
import { SupabaseContext } from '@/App';
import { useContext } from 'react';
import { LogOut } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { supabase } = useContext(SupabaseContext);
  const { toast } = useToast();
  
  const navItems = [
    { name: 'Produtos', path: '/' },
    { name: 'Carrinho', path: '/carrinho' },
    { name: 'Pedidos', path: '/pedidos' }
  ];
  
  const handleLogout = async () => {
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
  
  return (
    <nav className="laticrete-nav">
      {navItems.map(item => (
        <div 
          key={item.path}
          className={`laticrete-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          {item.name}
        </div>
      ))}
      
      {user && (
        <div 
          className="laticrete-nav-item flex items-center"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-1" />
          Sair
        </div>
      )}
    </nav>
  );
};

export default Navigation;
