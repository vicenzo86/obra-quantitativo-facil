
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { products, getProductById, getConsumptionRateByProductId } from '@/data/products';
import { ArrowLeft, Calculator as CalcIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface CalculationResult {
  productName: string;
  area: number;
  consumptionRate: number;
  consumptionUnit: string;
  requiredAmount: number;
  packaging: string;
  packagingAmount: number;
}

const Calculator = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [selectedProductId, setSelectedProductId] = useState<string>(id || '');
  const [area, setArea] = useState<string>('');
  const [thickness, setThickness] = useState<string>('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  
  const selectedProduct = selectedProductId ? getProductById(selectedProductId) : undefined;
  const consumptionRate = selectedProductId ? getConsumptionRateByProductId(selectedProductId) : undefined;
  
  const handleCalculate = () => {
    if (!selectedProduct || !consumptionRate || !area) {
      toast({
        title: "Erro no cálculo",
        description: "Por favor, preencha todos os campos obrigatórios.",
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
    
    const calculationResult: CalculationResult = {
      productName: selectedProduct.name,
      area: areaValue,
      consumptionRate: consumptionRate.value,
      consumptionUnit: consumptionRate.unit,
      requiredAmount,
      packaging,
      packagingAmount
    };
    
    setResult(calculationResult);
  };
  
  return (
    <div className="laticrete-app-container">
      <Header />
      <Navigation />
      
      <div className="laticrete-content pb-10">
        {!id && (
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-laticrete-blue mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </button>
        )}
        
        <h2 className="text-xl font-bold text-laticrete-darkblue mb-4 flex items-center">
          <CalcIcon className="h-5 w-5 mr-2" />
          Calculadora de Materiais
        </h2>
        
        <div className="laticrete-card">
          <div className="space-y-4">
            <div>
              <Label htmlFor="product">Produto</Label>
              <Select 
                value={selectedProductId} 
                onValueChange={setSelectedProductId}
              >
                <SelectTrigger className="laticrete-input">
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="area">Área (m²)</Label>
              <Input 
                id="area" 
                type="number" 
                className="laticrete-input" 
                placeholder="Ex: 10"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="thickness">Espessura (mm) (opcional)</Label>
              <Input 
                id="thickness" 
                type="number" 
                className="laticrete-input" 
                placeholder="Ex: 5"
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
              />
            </div>
            
            {selectedProduct && consumptionRate && (
              <div className="bg-laticrete-gray p-3 rounded-md">
                <p className="text-sm">Consumo médio de <strong>{selectedProduct.name}</strong>:</p>
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
          </div>
        </div>
        
        {result && (
          <div className="laticrete-card mt-4 bg-laticrete-blue text-white">
            <h3 className="text-lg font-bold mb-3">Resultado do Cálculo</h3>
            
            <div className="bg-white text-gray-800 rounded-md p-4">
              <p className="font-bold text-laticrete-darkblue mb-2">
                {result.productName}
              </p>
              
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div>
                  <p className="text-gray-500">Área</p>
                  <p className="font-bold">{result.area} m²</p>
                </div>
                <div>
                  <p className="text-gray-500">Consumo</p>
                  <p className="font-bold">{result.consumptionRate} {result.consumptionUnit}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <p>Quantidade necessária:</p>
                  <p className="font-bold text-laticrete-blue text-lg">
                    {result.requiredAmount.toFixed(2)} kg
                  </p>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <p>Embalagens ({result.packaging}):</p>
                  <p className="font-bold text-laticrete-blue text-lg">
                    {result.packagingAmount} {result.packagingAmount === 1 ? 'unidade' : 'unidades'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculator;
