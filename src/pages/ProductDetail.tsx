
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { getProductById, getConsumptionRateByProductId } from '@/data/products';
import { ArrowLeft, FileText, Calculator, ShoppingCart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/hooks/useCart';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  
  const [area, setArea] = useState<string>('');
  const [thickness, setThickness] = useState<string>('');
  const [areaName, setAreaName] = useState<string>('');
  const [calculationResult, setCalculationResult] = useState<any>(null);
  
  const product = id ? getProductById(id) : undefined;
  const consumptionRate = id ? getConsumptionRateByProductId(id) : undefined;
  
  if (!product) {
    return <div>Produto não encontrado</div>;
  }
  
  const handleCalculate = () => {
    if (!area || !product || !consumptionRate) {
      toast({
        title: "Erro no cálculo",
        description: "Por favor, preencha a área.",
        variant: "destructive"
      });
      return;
    }
    
    const areaValue = parseFloat(area);
    let requiredAmount = areaValue * consumptionRate.value;
    
    // If thickness is provided, adjust the calculation
    if (thickness) {
      const thicknessValue = parseFloat(thickness);
      if (!isNaN(thicknessValue)) {
        requiredAmount = (areaValue * consumptionRate.value * thicknessValue) / 10; // convert mm to cm
      }
    }
    
    // Packaging estimation (example)
    const packaging = "Saco 20kg";
    const packagingAmount = Math.ceil(requiredAmount / 20);
    
    const result = {
      productName: product.name,
      area: areaValue,
      consumptionRate: consumptionRate.value,
      consumptionUnit: consumptionRate.unit,
      requiredAmount,
      packaging,
      packagingAmount
    };
    
    setCalculationResult(result);
  };
  
  const handleAddToCart = () => {
    if (!calculationResult) {
      toast({
        title: "Erro ao adicionar ao carrinho",
        description: "Por favor, calcule o quantitativo primeiro.",
        variant: "destructive"
      });
      return;
    }
    
    if (!areaName) {
      toast({
        title: "Erro ao adicionar ao carrinho",
        description: "Por favor, informe o nome da área da obra.",
        variant: "destructive"
      });
      return;
    }
    
    addToCart({
      productId: product.id,
      productName: product.name,
      quantity: calculationResult.packagingAmount,
      area: calculationResult.area,
      areaName: areaName,
      totalAmount: calculationResult.requiredAmount,
      unitPrice: 0, // Preço seria definido em um sistema real
    });
    
    toast({
      title: "Produto adicionado ao carrinho",
      description: `${calculationResult.packagingAmount} ${calculationResult.packaging} de ${product.name} para a área ${areaName}`,
    });
  };
  
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
        
        <div className="laticrete-card mb-4">
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
        </div>
        
        <Tabs defaultValue="technical" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="technical" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Ficha Técnica
            </TabsTrigger>
            <TabsTrigger value="consumption" className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Consumo
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center">
              <Calculator className="h-4 w-4 mr-2" />
              Calculadora
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="technical" className="laticrete-card">
            <h3 className="font-bold mb-2">Descrição:</h3>
            <p className="mb-4">{product.description}</p>
            
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
            
            <Button className="w-full flex items-center justify-center">
              <FileText className="h-4 w-4 mr-2" />
              Baixar Ficha Técnica Completa
            </Button>
          </TabsContent>
          
          <TabsContent value="consumption" className="laticrete-card">
            {consumptionRate ? (
              <div>
                <h3 className="font-bold mb-3">Consumo Médio:</h3>
                <div className="bg-laticrete-gray p-4 rounded-lg mb-4">
                  <p className="font-bold text-laticrete-blue text-lg">
                    {consumptionRate.value} {consumptionRate.unit}
                  </p>
                  <p className="text-sm text-gray-600">{consumptionRate.conditions}</p>
                </div>
              </div>
            ) : (
              <p>Não há informações de consumo para este produto.</p>
            )}
          </TabsContent>
          
          <TabsContent value="calculator" className="laticrete-card">
            <h3 className="font-bold mb-3">Calculadora de Materiais</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="areaName">Nome da Área</Label>
                <Input 
                  id="areaName" 
                  placeholder="Ex: Garagem, Cozinha, Banheiro" 
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  className="laticrete-input"
                />
              </div>
              
              <div>
                <Label htmlFor="area">Área (m²)</Label>
                <Input 
                  id="area" 
                  type="number" 
                  placeholder="Ex: 10" 
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="laticrete-input"
                />
              </div>
              
              <div>
                <Label htmlFor="thickness">Espessura (mm) (opcional)</Label>
                <Input 
                  id="thickness" 
                  type="number" 
                  placeholder="Ex: 5" 
                  value={thickness}
                  onChange={(e) => setThickness(e.target.value)}
                  className="laticrete-input"
                />
              </div>
              
              {consumptionRate && (
                <div className="bg-laticrete-gray p-3 rounded-md">
                  <p className="text-sm">Consumo médio de <strong>{product.name}</strong>:</p>
                  <p className="font-bold text-laticrete-blue">
                    {consumptionRate.value} {consumptionRate.unit}
                  </p>
                  <p className="text-xs text-gray-600">{consumptionRate.conditions}</p>
                </div>
              )}
              
              <Button 
                className="w-full bg-laticrete-blue hover:bg-laticrete-darkblue"
                onClick={handleCalculate}
              >
                Calcular Quantitativo
              </Button>
              
              {calculationResult && (
                <div className="bg-white border border-gray-200 rounded-md p-4 mt-4">
                  <p className="font-bold text-laticrete-darkblue mb-2">
                    {calculationResult.productName}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div>
                      <p className="text-gray-500">Área</p>
                      <p className="font-bold">{calculationResult.area} m²</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Consumo</p>
                      <p className="font-bold">
                        {calculationResult.consumptionRate} {calculationResult.consumptionUnit}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <p>Quantidade necessária:</p>
                      <p className="font-bold text-laticrete-blue text-lg">
                        {calculationResult.requiredAmount.toFixed(2)} kg
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <p>Embalagens ({calculationResult.packaging}):</p>
                      <p className="font-bold text-laticrete-blue text-lg">
                        {calculationResult.packagingAmount} {calculationResult.packagingAmount === 1 ? 'unidade' : 'unidades'}
                      </p>
                    </div>
                    
                    <Button 
                      className="w-full flex items-center justify-center mt-4"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Adicionar ao Carrinho
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetail;
