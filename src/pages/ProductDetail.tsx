
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
import { SupabaseContext } from '@/App';
import { useContext } from 'react';
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { supabase } = useContext(SupabaseContext);
  
  const [area, setArea] = useState<string>('');
  const [customConsumption, setCustomConsumption] = useState<string>('');
  const [areaName, setAreaName] = useState<string>('');
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [isLinearCalculation, setIsLinearCalculation] = useState<boolean>(false);
  const [useDefaultConsumption, setUseDefaultConsumption] = useState<boolean>(true);
  
  const product = id ? getProductById(id) : undefined;
  const consumptionRate = id ? getConsumptionRateByProductId(id) : undefined;
  
  // Formatador de números para exibição
  const formatNumber = (num: number): string => {
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  
  // Função para calcular com base no consumo ou rendimento
  const calculateConsumption = (area: number, consumption: number, isLinear: boolean): number => {
    if (isLinear) {
      // Para cálculo linear, assumimos uma largura padrão de 10cm
      const linearWidth = 0.1; // 10cm em metros
      return area * linearWidth * consumption;
    }
    return area * consumption;
  };
  
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
    
    // Definir o consumo a ser usado: padrão ou personalizado
    const consumptionValue = useDefaultConsumption
      ? consumptionRate.value
      : parseFloat(customConsumption || consumptionRate.value.toString());
    
    // Calcular quantidade necessária
    const requiredAmount = calculateConsumption(areaValue, consumptionValue, isLinearCalculation);
    
    // Estimar embalagem (exemplo)
    const packaging = "Saco 20kg";
    const packagingAmount = Math.ceil(requiredAmount / 20);
    
    const result = {
      productName: product.name,
      area: areaValue,
      isLinear: isLinearCalculation,
      consumptionRate: consumptionValue,
      consumptionUnit: consumptionRate.unit,
      defaultConsumption: consumptionRate.value,
      requiredAmount,
      packaging,
      packagingAmount
    };
    
    setCalculationResult(result);
    
    // Sincronizar com Supabase se disponível
    if (supabase) {
      try {
        supabase.from('calculos').insert([{
          produto_id: product.id,
          produto_nome: product.name,
          area: areaValue,
          consumo: consumptionValue,
          is_linear: isLinearCalculation,
          quantidade_necessaria: requiredAmount,
          created_at: new Date()
        }]);
      } catch (error) {
        console.error("Erro ao salvar cálculo:", error);
      }
    }
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
    
    // Sincronizar com Supabase se disponível
    if (supabase) {
      try {
        supabase.from('carrinho').insert([{
          produto_id: product.id,
          produto_nome: product.name,
          quantidade: calculationResult.packagingAmount,
          area_nome: areaName,
          area_valor: calculationResult.area,
          is_linear: calculationResult.isLinear,
          consumo: calculationResult.consumptionRate,
          quantidade_total: calculationResult.requiredAmount,
          created_at: new Date()
        }]);
      } catch (error) {
        console.error("Erro ao adicionar ao carrinho:", error);
      }
    }
  };
  
  // Funções para formatação e apresentação
  const getConsumptionModeText = () => {
    return consumptionRate?.unit.includes('kg/') ? 'Consumo' : 'Rendimento';
  };
  
  const getConsumptionVariationColor = (value: number) => {
    const defaultValue = consumptionRate?.value || 0;
    if (value < defaultValue * 0.9) return 'bg-green-100';
    if (value > defaultValue * 1.1) return 'bg-red-100';
    return 'bg-blue-100';
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
        
        <Tabs defaultValue="calculator" className="w-full">
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
                <h3 className="font-bold mb-3">{getConsumptionModeText()} Médio:</h3>
                <div className="bg-laticrete-gray p-4 rounded-lg mb-4">
                  <p className="font-bold text-laticrete-blue text-lg">
                    {consumptionRate.value} {consumptionRate.unit}
                  </p>
                  <p className="text-sm text-gray-600">{consumptionRate.conditions}</p>
                </div>

                <div className="mt-6 border-t pt-4">
                  <h3 className="font-bold mb-3">Variação do {getConsumptionModeText()}:</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    O {getConsumptionModeText().toLowerCase()} pode variar de acordo com o tipo de substrato, condições de aplicação e ferramentas utilizadas.
                  </p>
                  
                  <div className="space-y-6">
                    {[0.8, 1, 1.2, 1.4].map(ratio => {
                      const currentConsumption = consumptionRate.value * ratio;
                      const consumptionColor = getConsumptionVariationColor(currentConsumption);
                      
                      return (
                        <div key={ratio} className={`p-3 rounded-lg ${consumptionColor} flex justify-between items-center`}>
                          <div>
                            <p className="font-medium">{getConsumptionModeText()} Ajustado:</p>
                            <p className="text-xs text-gray-700">
                              {ratio < 1 ? "Menor" : ratio > 1 ? "Maior" : "Igual"} que o padrão
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{currentConsumption} {consumptionRate.unit}</p>
                            <p className="text-xs text-gray-700">
                              {ratio < 1 ? "↓" : ratio > 1 ? "↑" : "="} {(ratio * 100).toFixed(0)}% do padrão
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
              
              <div className="flex items-center justify-between space-x-2 p-3 bg-laticrete-gray rounded-md">
                <div className="text-sm font-medium">Tipo de cálculo:</div>
                <div className="flex items-center space-x-2">
                  <span className={!isLinearCalculation ? "font-bold" : ""}>Área (m²)</span>
                  <Switch
                    checked={isLinearCalculation}
                    onCheckedChange={setIsLinearCalculation}
                  />
                  <span className={isLinearCalculation ? "font-bold" : ""}>Metro linear</span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="area">
                  {isLinearCalculation ? "Comprimento (m)" : "Área (m²)"}
                </Label>
                <Input 
                  id="area" 
                  type="number" 
                  placeholder={isLinearCalculation ? "Ex: 5" : "Ex: 10"} 
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="laticrete-input"
                />
              </div>
              
              <div className="border p-4 rounded-md">
                <h4 className="font-medium mb-3">{getConsumptionModeText()} do Produto</h4>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">O {getConsumptionModeText().toLowerCase()} afeta diretamente o resultado</span>
                  <div>
                    <Switch
                      checked={!useDefaultConsumption}
                      onCheckedChange={(checked) => setUseDefaultConsumption(!checked)}
                    />
                    <span className="ml-2 text-sm">{useDefaultConsumption ? "Padrão" : "Personalizado"}</span>
                  </div>
                </div>
                
                {useDefaultConsumption ? (
                  <div className="bg-blue-50 p-3 rounded border border-blue-100">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">{getConsumptionModeText()} padrão</p>
                      <p className="font-bold text-blue-800">
                        {consumptionRate?.value} {consumptionRate?.unit}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{consumptionRate?.conditions}</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Label htmlFor="customConsumption">{getConsumptionModeText()} personalizado:</Label>
                      <Input
                        id="customConsumption"
                        type="number"
                        step="0.1"
                        placeholder={consumptionRate?.value.toString()}
                        value={customConsumption}
                        onChange={(e) => setCustomConsumption(e.target.value)}
                        className="w-24"
                      />
                      <span>{consumptionRate?.unit}</span>
                    </div>
                    
                    <div className="bg-blue-50 p-2 rounded text-xs">
                      {parseFloat(customConsumption || '0') === 0 ? (
                        <p className="text-red-500">Por favor, informe um valor válido</p>
                      ) : parseFloat(customConsumption || '0') < consumptionRate?.value ? (
                        <p>Consumo menor que o padrão ({consumptionRate?.value} {consumptionRate?.unit})</p>
                      ) : parseFloat(customConsumption || '0') > consumptionRate?.value ? (
                        <p>Consumo maior que o padrão ({consumptionRate?.value} {consumptionRate?.unit})</p>
                      ) : (
                        <p>Consumo igual ao padrão</p>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="mt-4">
                  <div className={`p-3 rounded-lg ${getConsumptionVariationColor(parseFloat(customConsumption || (consumptionRate?.value || 0).toString()))}`}>
                    <p className="text-sm text-center">
                      <strong>Atenção:</strong> O consumo varia conforme condições do substrato e aplicação.
                    </p>
                  </div>
                </div>
              </div>
              
              {consumptionRate && (
                <div className="bg-laticrete-gray p-3 rounded-md">
                  <p className="text-sm">{getConsumptionModeText()} médio de <strong>{product.name}</strong>:</p>
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
                      <p className="text-gray-500">
                        {calculationResult.isLinear ? "Comprimento" : "Área"}
                      </p>
                      <p className="font-bold">{calculationResult.area} {calculationResult.isLinear ? "m" : "m²"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">{getConsumptionModeText()} utilizado</p>
                      <p className="font-bold">
                        {calculationResult.consumptionRate} {calculationResult.consumptionUnit}
                      </p>
                    </div>
                    {calculationResult.consumptionRate !== calculationResult.defaultConsumption && (
                      <div className="col-span-2">
                        <p className="text-gray-500">Ajuste de consumo</p>
                        <p className="font-bold">
                          {(calculationResult.consumptionRate / calculationResult.defaultConsumption).toFixed(2)}x 
                          <span className="text-xs ml-1 text-blue-600">
                            ({calculationResult.consumptionRate > calculationResult.defaultConsumption ? "+" : ""}
                            {(((calculationResult.consumptionRate / calculationResult.defaultConsumption) - 1) * 100).toFixed(0)}%)
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <p>Quantidade necessária:</p>
                      <p className="font-bold text-laticrete-blue text-lg">
                        {formatNumber(calculationResult.requiredAmount)} kg
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
