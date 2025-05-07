
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products as localProducts } from '@/data/products';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { useQuery } from '@tanstack/react-query';
import { getProductByIdFromSupabase } from '@/services/productService';
import { ArrowLeft } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  // Fetch product details from Supabase
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductByIdFromSupabase(id || ''),
    retry: 1,
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao carregar detalhes do produto",
        description: "Usando dados locais como fallback."
      });
    }
  });

  // Fallback to local data if Supabase fails
  const localProduct = localProducts.find(p => p.id === id);
  const productData = product || localProduct;
  
  // Handle adding to cart
  const handleAddToCart = () => {
    if (productData) {
      // Create a CartItem from the Product
      const cartItem = {
        productId: productData.id,
        productName: productData.name,
        quantity: 1,
        area: 0,
        areaName: 'unidade',
        totalAmount: 0,
        unitPrice: 0, // Default value since price might not exist in Product
      };
      
      addToCart(cartItem);
      toast({
        title: "Produto adicionado",
        description: `${productData.name} foi adicionado ao carrinho`,
      });
    }
  };
  
  // Handle product not found
  if (!isLoading && !productData) {
    return (
      <div className="laticrete-app-container">
        <Header />
        <Navigation />
        <div className="laticrete-content">
          <div className="text-center py-8">
            <h2 className="text-xl font-bold text-gray-800">Produto não encontrado</h2>
            <p className="mt-2 text-gray-600">O produto que você está procurando não existe.</p>
            <Button 
              onClick={() => navigate('/produtos')} 
              className="mt-4"
            >
              Voltar para produtos
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="laticrete-app-container">
      <Header />
      <Navigation />
      
      <div className="laticrete-content">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2 text-gray-600">Carregando detalhes do produto...</p>
          </div>
        ) : productData ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/produtos')}
                className="p-1"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-laticrete-darkblue">{productData.name}</h1>
            </div>
            
            <div className="laticrete-card">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <img 
                    src={productData.imageUrl} 
                    alt={productData.name} 
                    className="w-full object-cover rounded-md"
                  />
                  
                  <div className="mt-4">
                    {/* Simplify price display since it might not exist */}
                    <p className="text-lg font-bold">
                      Consultar preço
                    </p>
                    
                    <Button 
                      onClick={handleAddToCart}
                      className="w-full mt-2 bg-laticrete-blue hover:bg-laticrete-darkblue"
                    >
                      Adicionar ao carrinho
                    </Button>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <h2 className="text-xl font-bold mb-2">Descrição</h2>
                  <p className="text-gray-700 mb-4">{productData.description}</p>
                  
                  <h2 className="text-xl font-bold mb-2">Categoria</h2>
                  <p className="text-gray-700 mb-4">{productData.category}</p>
                  
                  {/* Display specifications if available */}
                  {productData.specifications && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h2 className="text-xl font-bold mb-2">Especificações Técnicas</h2>
                      <div className="grid grid-cols-2 gap-4">
                        {productData.specifications.thickness && (
                          <div>
                            <p className="text-sm text-gray-500">Espessura</p>
                            <p className="font-medium">{productData.specifications.thickness} mm</p>
                          </div>
                        )}
                        {productData.specifications.consumption && (
                          <div>
                            <p className="text-sm text-gray-500">Consumo</p>
                            <p className="font-medium">{productData.specifications.consumption} kg/m²</p>
                          </div>
                        )}
                        {productData.specifications.yield && (
                          <div>
                            <p className="text-sm text-gray-500">Rendimento</p>
                            <p className="font-medium">{productData.specifications.yield} m²/kg</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-red-600">
            Erro ao carregar dados do produto
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
