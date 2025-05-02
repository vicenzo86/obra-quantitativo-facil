
import React, { useState } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { useCart } from '@/hooks/useCart';
import { Trash2, ArrowRight, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const Cart = () => {
  const { items, removeFromCart, clearCart } = useCart();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  
  const handleSubmitOrder = () => {
    if (!name || !email || !phone) {
      toast({
        title: "Erro ao enviar pedido",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    if (items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de enviar o pedido.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate sending order to server
    const orderData = {
      customer: {
        name,
        email,
        phone
      },
      items,
      notes,
      date: new Date().toISOString()
    };
    
    console.log("Enviando pedido:", orderData);
    
    // Success notification
    toast({
      title: "Pedido enviado com sucesso!",
      description: "Um vendedor entrará em contato em breve.",
    });
    
    // Clear form and cart
    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
    clearCart();
  };
  
  // Group items by area
  const itemsByArea = items.reduce((acc, item) => {
    if (!acc[item.areaName]) {
      acc[item.areaName] = [];
    }
    acc[item.areaName].push(item);
    return acc;
  }, {} as Record<string, typeof items>);
  
  return (
    <div className="laticrete-app-container">
      <Header />
      <Navigation />
      
      <div className="laticrete-content pb-10">
        <h2 className="text-xl font-bold text-laticrete-darkblue mb-4">
          Carrinho de Produtos
        </h2>
        
        {items.length > 0 ? (
          <>
            <div className="laticrete-card mb-4">
              {Object.entries(itemsByArea).map(([areaName, areaItems]) => (
                <div key={areaName} className="mb-4">
                  <h3 className="font-bold text-laticrete-blue border-b pb-2 mb-3">
                    Área: {areaName}
                  </h3>
                  
                  <div className="space-y-3">
                    {areaItems.map((item, index) => {
                      const itemIndex = items.findIndex(i => 
                        i.productId === item.productId && 
                        i.areaName === item.areaName &&
                        i.area === item.area
                      );
                      
                      return (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-gray-600">
                              {item.quantity} unidades • {item.area} m²
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(itemIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="laticrete-card">
              <h3 className="font-bold text-laticrete-darkblue mb-4">Dados para contato</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome completo *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="laticrete-input"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="laticrete-input"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="laticrete-input"
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="laticrete-input"
                    placeholder="Informações adicionais sobre sua obra"
                    rows={4}
                  />
                </div>
                
                <Button 
                  onClick={handleSubmitOrder}
                  className="w-full bg-laticrete-blue hover:bg-laticrete-darkblue flex items-center justify-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Pedido
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="laticrete-card text-center py-10">
            <p className="text-gray-500 mb-4">Seu carrinho está vazio</p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-laticrete-blue hover:bg-laticrete-darkblue flex items-center mx-auto"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Ver Produtos
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
