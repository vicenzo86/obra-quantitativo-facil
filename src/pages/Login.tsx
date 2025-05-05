
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { SupabaseContext } from '@/App';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Facebook, Linkedin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  company: z.string().min(2, 'Nome da empresa deve ter pelo menos 2 caracteres'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const Login = () => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { supabase, user } = useContext(SupabaseContext);
  
  // Se já estiver autenticado, redireciona para a página inicial
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Verifica se as credenciais do Supabase estão configuradas
  const isSupabaseConfigured = !!supabase;

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      company: '',
      phone: '',
      email: '',
      password: '',
    },
  });

  const handleLogin = async (data: LoginFormValues) => {
    if (!isSupabaseConfigured) {
      toast({
        title: "Configuração incompleta",
        description: "As credenciais do Supabase não foram configuradas. Por favor, configure o Supabase para ativar a autenticação.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo de volta!",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: RegisterFormValues) => {
    if (!isSupabaseConfigured) {
      toast({
        title: "Configuração incompleta",
        description: "As credenciais do Supabase não foram configuradas. Por favor, configure o Supabase para ativar a autenticação.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Signup with Supabase
      const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            company: data.company,
            phone: data.phone,
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      // If user was created successfully
      if (signUpData?.user) {
        // Store additional user metadata in a custom table
        try {
          await supabase.from('profiles').insert({
            id: signUpData.user.id,
            name: data.name,
            company: data.company,
            phone: data.phone,
            email: data.email,
          });
        } catch (metaError) {
          console.error("Erro ao salvar dados do perfil:", metaError);
        }
        
        toast({
          title: "Cadastro realizado",
          description: "Sua conta foi criada com sucesso. Verifique seu email para confirmar o cadastro.",
        });
        
        setActiveTab("login");
      }
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'facebook' | 'linkedin') => {
    if (!isSupabaseConfigured) {
      toast({
        title: "Configuração incompleta",
        description: "As credenciais do Supabase não foram configuradas. Por favor, configure o Supabase para ativar a autenticação.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Nota: é necessário configurar os provedores OAuth no dashboard do Supabase
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        }
      });
    } catch (error: any) {
      toast({
        title: "Erro no login social",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-laticrete-darkblue">
            Obra Quantitativo
          </h1>
          <p className="text-gray-600 mt-2">
            Sistema de cálculo de materiais para construtores
          </p>
          
          {!isSupabaseConfigured && (
            <div className="mt-4 p-3 bg-amber-100 border border-amber-300 rounded-md text-amber-800">
              <p className="text-sm">
                <strong>Aviso:</strong> As credenciais do Supabase não estão configuradas.
                Para ativar a autenticação, configure o Supabase no projeto.
              </p>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...loginForm.register("email")}
                    placeholder="seu@email.com"
                    className="laticrete-input"
                    disabled={loading}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    {...loginForm.register("password")}
                    placeholder="********"
                    className="laticrete-input"
                    disabled={loading}
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-laticrete-blue hover:bg-laticrete-darkblue"
                  disabled={loading || !isSupabaseConfigured}
                >
                  {loading ? 'Entrando...' : "Entrar"}
                </Button>
              </form>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Ou continue com</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={loading || !isSupabaseConfigured}
                >
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleSocialLogin('linkedin')}
                  disabled={loading || !isSupabaseConfigured}
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    {...registerForm.register("name")}
                    placeholder="Seu nome completo"
                    className="laticrete-input"
                    disabled={loading}
                  />
                  {registerForm.formState.errors.name && (
                    <p className="text-sm text-red-500">{registerForm.formState.errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa/Organização</Label>
                  <Input
                    id="company"
                    {...registerForm.register("company")}
                    placeholder="Nome da empresa"
                    className="laticrete-input"
                    disabled={loading}
                  />
                  {registerForm.formState.errors.company && (
                    <p className="text-sm text-red-500">{registerForm.formState.errors.company.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone/WhatsApp</Label>
                  <Input
                    id="phone"
                    {...registerForm.register("phone")}
                    placeholder="(99) 99999-9999"
                    className="laticrete-input"
                    disabled={loading}
                  />
                  {registerForm.formState.errors.phone && (
                    <p className="text-sm text-red-500">{registerForm.formState.errors.phone.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    {...registerForm.register("email")}
                    placeholder="seu@email.com"
                    className="laticrete-input"
                    disabled={loading}
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-sm text-red-500">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <Input
                    id="register-password"
                    type="password"
                    {...registerForm.register("password")}
                    placeholder="********"
                    className="laticrete-input"
                    disabled={loading}
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-sm text-red-500">{registerForm.formState.errors.password.message}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-laticrete-blue hover:bg-laticrete-darkblue"
                  disabled={loading || !isSupabaseConfigured}
                >
                  {loading ? 'Cadastrando...' : "Cadastrar"}
                </Button>
              </form>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Ou cadastre com</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={loading || !isSupabaseConfigured}
                >
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleSocialLogin('linkedin')}
                  disabled={loading || !isSupabaseConfigured}
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          {!isSupabaseConfigured && (
            <div className="mt-4 text-center">
              <Button 
                onClick={() => navigate('/')} 
                className="text-sm"
                variant="outline"
              >
                Continuar sem login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
