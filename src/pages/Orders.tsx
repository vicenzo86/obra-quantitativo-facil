
import React from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { FileText } from 'lucide-react';

const Orders = () => {
  return (
    <div className="laticrete-app-container">
      <Header />
      <Navigation />
      
      <div className="laticrete-content">
        <h2 className="text-xl font-bold text-laticrete-darkblue mb-4">
          Meus Pedidos
        </h2>
        
        <div className="laticrete-card text-center py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-laticrete-gray p-4 rounded-full mb-4">
              <FileText className="h-8 w-8 text-laticrete-blue" />
            </div>
            <h3 className="text-lg font-bold mb-2">Nenhum pedido encontrado</h3>
            <p className="text-gray-500">
              Quando você fizer um pedido, ele aparecerá aqui para acompanhamento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
