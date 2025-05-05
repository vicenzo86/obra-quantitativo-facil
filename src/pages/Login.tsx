
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { SupabaseContext } from '@/App';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { supabase, user } = useContext(SupabaseContext);
  
  // Se já estiver autenticado, redireciona para a página inicial
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        // Login com Supabase
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta!",
        });
        
        navigate('/');
      } else {
        // Cadastro com Supabase
        const { error } = await supabase.auth.signUp({
          email,
          password
        });
        
        if (error) throw error;
        
        toast({
          title: "Cadastro realizado",
          description: "Verifique seu email para confirmar o cadastro.",
        });
      }
    } catch (error: any) {
      toast({
        title: isLogin ? "Erro no login" : "Erro no cadastro",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-laticrete-darkblue">
            Obra Quantitativo
          </h1>
          <p className="text-gray-600 mt-2">
            {isLogin ? "Entre na sua conta" : "Crie sua conta"}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="laticrete-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
                className="laticrete-input"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-laticrete-blue hover:bg-laticrete-darkblue"
              disabled={loading}
            >
              {loading ? 'Processando...' : (isLogin ? "Entrar" : "Cadastrar")}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-laticrete-blue hover:underline"
              disabled={loading}
            >
              {isLogin ? "Não tem uma conta? Cadastre-se" : "Já tem uma conta? Faça login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
