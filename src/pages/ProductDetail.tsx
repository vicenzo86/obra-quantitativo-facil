
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { getProductById, getConsumptionRateByProductId } from '@/data/products';
import { ArrowLeft, FileText, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const product = id ? getProductById(id) : undefined;
  const consumptionRate = id ? getConsumptionRateByProductId(id) : undefined;
  
  if (!product) {
    return <div>Produto não encontrado</div>;
  }
  
  return (
    <div className="laticrete-app-container">
      <Header />
      <Navigation />
      
      <div className="laticrete-content">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-laticrete-blue mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </button>
        
        <div className="laticrete-card">
          <div className="flex justify-center mb-4">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-32 h-32 object-contain"
            />
          </div>
          
          <h1 className="text-xl font-bold text-laticrete-darkblue mb-2">
            {product.name}
          </h1>
          
          <div className="bg-laticrete-gray rounded px-3 py-1 inline-block mb-3">
            {product.category}
          </div>
          
          <p className="mb-4">{product.description}</p>
          
          {consumptionRate && (
            <div className="mb-4">
              <h2 className="font-bold mb-2">Consumo Médio:</h2>
              <div className="bg-laticrete-gray p-3 rounded">
                <p className="font-bold text-laticrete-blue text-lg">
                  {consumptionRate.value} {consumptionRate.unit}
                </p>
                <p className="text-sm text-gray-600">{consumptionRate.conditions}</p>
              </div>
            </div>
          )}
          
          <div className="flex space-x-2 mt-6">
            <Button 
              variant="outline" 
              className="flex-1 flex items-center justify-center"
              onClick={() => navigate(`/ficha/${product.id}`)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Ficha Técnica
            </Button>
            <Button 
              className="flex-1 flex items-center justify-center bg-laticrete-blue hover:bg-laticrete-darkblue"
              onClick={() => navigate(`/calculadora/${product.id}`)}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calcular
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
