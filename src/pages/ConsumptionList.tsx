
import React from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { products, consumptionRates, getProductById } from '@/data/products';

const ConsumptionList = () => {
  return (
    <div className="laticrete-app-container">
      <Header />
      <Navigation />
      
      <div className="laticrete-content">
        <h2 className="text-xl font-bold text-laticrete-darkblue mb-4">Consumos Médios</h2>
        
        <div className="laticrete-card">
          <div className="divide-y">
            {consumptionRates.map(rate => {
              const product = getProductById(rate.productId);
              if (!product) return null;
              
              return (
                <div key={rate.productId} className="py-3">
                  <h3 className="font-bold text-laticrete-blue">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{product.category}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold">{rate.value} {rate.unit}</p>
                    <p className="text-xs text-gray-500 max-w-[60%] text-right">{rate.conditions}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumptionList;
