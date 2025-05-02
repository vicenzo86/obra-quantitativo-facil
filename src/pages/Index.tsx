
import React, { useState } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import ProductCard from '@/components/ProductCard';
import { products, getCategories } from '@/data/products';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const categories = getCategories();
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="laticrete-app-container">
      <Header />
      <Navigation />
      
      <div className="laticrete-content">
        <h2 className="text-xl font-bold text-laticrete-darkblue mb-4">Catálogo de Produtos</h2>
        
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            type="text" 
            placeholder="Buscar produtos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="laticrete-input pl-10"
          />
        </div>
        
        <div className="mb-4 flex flex-wrap gap-2">
          <button 
            className={`px-3 py-1 text-sm rounded-full ${selectedCategory === '' ? 'bg-laticrete-blue text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedCategory('')}
          >
            Todos
          </button>
          {categories.map(category => (
            <button 
              key={category}
              className={`px-3 py-1 text-sm rounded-full ${selectedCategory === category ? 'bg-laticrete-blue text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div>
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhum produto encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
