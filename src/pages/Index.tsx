
import React, { useState } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import ProductCard from '@/components/ProductCard';
import { products as localProducts, getCategories } from '@/data/products';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProductsFromSupabase, getCategoriesFromSupabase } from '@/services/productService';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { toast } = useToast();
  
  // Fetch products from Supabase
  const { data: supabaseProducts, isLoading: isLoadingProducts, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: getProductsFromSupabase,
    retry: 1,
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao carregar produtos",
        description: "Usando dados locais como fallback."
      });
    }
  });
  
  // Fetch categories from Supabase
  const { data: supabaseCategories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesFromSupabase,
    retry: 1
  });
  
  // Use products from Supabase or fallback to local data
  const products = supabaseProducts || localProducts;
  // Use categories from Supabase or fallback to local data
  const categories = supabaseCategories || getCategories();
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const isLoading = isLoadingProducts || isLoadingCategories;
  
  return (
    <div className="laticrete-app-container">
      <Header />
      <Navigation />
      
      <div className="laticrete-content">
        <h2 className="text-xl font-bold text-laticrete-darkblue mb-4">Produtos</h2>
        
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
          {categories && categories.map(category => (
            <button 
              key={category}
              className={`px-3 py-1 text-sm rounded-full ${selectedCategory === category ? 'bg-laticrete-blue text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2 text-gray-600">Carregando produtos...</p>
          </div>
        )}
        
        {productsError && (
          <div className="bg-red-50 p-4 rounded-md mb-4 border border-red-200">
            <p className="text-red-700">Erro ao carregar produtos. Usando dados locais.</p>
          </div>
        )}
        
        <div>
          {!isLoading && filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            !isLoading && (
              <div className="text-center py-8 text-gray-500">
                Nenhum produto encontrado
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
