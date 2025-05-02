
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { getProductById } from '@/data/products';
import { ArrowLeft, Download } from 'lucide-react';

const TechnicalSheet = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const product = id ? getProductById(id) : undefined;
  
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
        
        <h2 className="text-xl font-bold text-laticrete-darkblue mb-4">Ficha Técnica</h2>
        
        <div className="laticrete-card">
          <div className="flex items-center mb-4">
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
          
          <div className="bg-laticrete-gray p-4 rounded-lg mb-4">
            <h4 className="font-bold mb-2">Descrição:</h4>
            <p>{product.description}</p>
          </div>
          
          <div className="bg-laticrete-gray p-4 rounded-lg mb-4">
            <h4 className="font-bold mb-2">Aplicações:</h4>
            <ul className="list-disc list-inside">
              <li>Áreas internas e externas</li>
              <li>Pisos e paredes</li>
              <li>Residencial e comercial</li>
              <li>Áreas úmidas</li>
            </ul>
          </div>
          
          <div className="bg-laticrete-gray p-4 rounded-lg mb-4">
            <h4 className="font-bold mb-2">Propriedades:</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-600">Resistência à compressão</p>
                <p>Alta</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tempo de secagem</p>
                <p>24 horas</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Validade</p>
                <p>12 meses</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Certificações</p>
                <p>ISO 9001</p>
              </div>
            </div>
          </div>
          
          <button className="laticrete-button w-full flex items-center justify-center">
            <Download className="h-4 w-4 mr-2" />
            Baixar Ficha Técnica Completa
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicalSheet;
