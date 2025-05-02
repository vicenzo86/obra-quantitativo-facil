
import React from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { products } from '@/data/products';
import { useNavigate } from 'react-router-dom';
import { FileText, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const SheetsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="laticrete-app-container">
      <Header />
      <Navigation />
      
      <div className="laticrete-content">
        <h2 className="text-xl font-bold text-laticrete-darkblue mb-4">Fichas Técnicas</h2>
        
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            type="text" 
            placeholder="Buscar fichas técnicas..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="laticrete-input pl-10"
          />
        </div>
        
        <div className="laticrete-card">
          <div className="divide-y">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="py-3 flex items-center cursor-pointer"
                onClick={() => navigate(`/ficha/${product.id}`)}
              >
                <div className="bg-laticrete-gray p-2 rounded-full mr-3">
                  <FileText className="h-5 w-5 text-laticrete-blue" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-laticrete-blue">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
              </div>
            ))}
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhuma ficha técnica encontrada
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SheetsList;
