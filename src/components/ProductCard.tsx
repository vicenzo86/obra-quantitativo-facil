
import React from 'react';
import { Product } from '@/data/products';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="laticrete-card cursor-pointer"
      onClick={() => navigate(`/produto/${product.id}`)}
    >
      <div className="flex items-center mb-2">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-16 h-16 mr-4 object-contain"
        />
        <div>
          <h3 className="font-bold text-laticrete-darkblue">{product.name}</h3>
          <p className="text-sm text-gray-600">{product.category}</p>
        </div>
      </div>
      <p className="text-sm">{product.description}</p>
    </div>
  );
};

export default ProductCard;
