
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
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { supabase } = useContext(SupabaseContext);
  
  const [area, setArea] = useState<string>('');
  const [thickness, setThickness] = useState<string>('');
  const [areaName, setAreaName] = useState<string>('');
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [isLinearCalculation, setIsLinearCalculation] = useState<boolean>(false);
  const [useDefaultThickness, setUseDefaultThickness] = useState<boolean>(true);
  
  const product = id ? getProductById(id) : undefined;
  const consumptionRate = id ? getConsumptionRateByProductId(id) : undefined;
  
  // Valores padrão para espessura (mm) por produto
  const defaultThicknesses: {[key: string]: number} = {
    "1": 3, // 4237 Aditivo - 3mm padrão
    "2": 5, // 254 Platinum - 5mm padrão
    "3": 2, // HYDRO BAN - 2mm padrão
    "4": 3, // SPECTRALOCK - 3mm padrão
    "5": 3, // PERMACOLOR - 3mm padrão
    "6": 5, // LATAPOXY - 5mm padrão
  };
  
  const defaultThickness = id ? defaultThicknesses[id] || 3 : 3;
  const minThickness = Math.max(1, defaultThickness / 2);
  const maxThickness = defaultThickness * 2;
  
  // Cores relacionado à espessura para visualização
  const getThicknessColor = (currentThickness: number) => {
    if (currentThickness < defaultThickness) {
      return 'bg-blue-100';
    } else if (currentThickness === defaultThickness) {
      return 'bg-blue-200';
    } else if (currentThickness <= defaultThickness * 1.5) {
      return 'bg-blue-300';
    } else {
      return 'bg-blue-400';
    }
  };

  // Função para formatar número com separador de milhares
  const formatNumber = (num: number): string => {
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
    let requiredAmount = 0;
    
    // Cálculo baseado em escolha: m² ou linear
    if (isLinearCalculation) {
      // Cálculo para metro linear
      // Assumimos uma largura padrão de 10cm para aplicação linear
      const linearWidth = 0.1; // 10cm em metros
      requiredAmount = areaValue * linearWidth * consumptionRate.value;
    } else {
      // Cálculo para m²
      requiredAmount = areaValue * consumptionRate.value;
    }
    
    // Ajusta pelo fator de espessura - SEMPRE APLICADO DIRETAMENTE PROPORCIONAL
    const thicknessValue = useDefaultThickness ? defaultThickness : parseFloat(thickness || "0");
    if (!isNaN(thicknessValue)) {
      // Ajuste diretamente proporcional à espessura
      const thicknessRatio = thicknessValue / defaultThickness;
      requiredAmount = requiredAmount * thicknessRatio;
    }
    
    // Packaging estimation (example)
    const packaging = "Saco 20kg";
    const packagingAmount = Math.ceil(requiredAmount / 20);
    
    const result = {
      productName: product.name,
      area: areaValue,
      isLinear: isLinearCalculation,
      thickness: thicknessValue,
      consumptionRate: consumptionRate.value,
      consumptionUnit: consumptionRate.unit,
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
          espessura: result.thickness,
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
          espessura: calculationResult.thickness,
          quantidade_total: calculationResult.requiredAmount,
          created_at: new Date()
        }]);
      } catch (error) {
        console.error("Erro ao adicionar ao carrinho:", error);
      }
    }
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
                <h3 className="font-bold mb-3">Consumo Médio:</h3>
                <div className="bg-laticrete-gray p-4 rounded-lg mb-4">
                  <p className="font-bold text-laticrete-blue text-lg">
                    {consumptionRate.value} {consumptionRate.unit}
                  </p>
                  <p className="text-sm text-gray-600">{consumptionRate.conditions}</p>
                  <p className="text-sm font-medium mt-2">Espessura padrão recomendada: {defaultThickness}mm</p>
                </div>

                <div className="mt-6 border-t pt-4">
                  <h3 className="font-bold mb-3">Variação do Consumo por Espessura:</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    O consumo é diretamente proporcional à espessura aplicada. Quanto maior a espessura, maior será o consumo do material.
                  </p>
                  
                  <div className="space-y-6">
                    {[0.5, 1, 1.5, 2].map(ratio => {
                      const currentThickness = defaultThickness * ratio;
                      const currentConsumption = consumptionRate.value * ratio;
                      const thicknessColor = getThicknessColor(currentThickness);
                      
                      return (
                        <div key={ratio} className={`p-3 rounded-lg ${thicknessColor} flex justify-between items-center`}>
                          <div>
                            <p className="font-medium">Espessura: {currentThickness}mm</p>
                            <p className="text-xs text-gray-700">
                              {ratio < 1 ? "Menor" : ratio > 1 ? "Maior" : "Igual"} que o padrão
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{currentConsumption} {consumptionRate.unit}</p>
                            <p className="text-xs text-gray-700">
                              {ratio < 1 ? "↓" : ratio > 1 ? "↑" : "="} {(ratio * 100).toFixed(0)}% do consumo padrão
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
                <h4 className="font-medium mb-3">Espessura de Aplicação</h4>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">A espessura afeta diretamente o consumo</span>
                  <div>
                    <Switch
                      checked={!useDefaultThickness}
                      onCheckedChange={(checked) => setUseDefaultThickness(!checked)}
                    />
                    <span className="ml-2 text-sm">{useDefaultThickness ? "Padrão" : "Personalizada"}</span>
                  </div>
                </div>
                
                {useDefaultThickness ? (
                  <div className="bg-blue-50 p-3 rounded border border-blue-100">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Espessura padrão</p>
                      <p className="font-bold text-blue-800">{defaultThickness} mm</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between">
                        <span className="text-sm">{minThickness} mm</span>
                        <span className="text-sm font-medium">
                          {thickness || defaultThickness} mm
                        </span>
                        <span className="text-sm">{maxThickness} mm</span>
                      </div>
                      <Slider
                        defaultValue={[defaultThickness]}
                        min={minThickness}
                        max={maxThickness}
                        step={0.5}
                        value={[parseFloat(thickness || defaultThickness.toString())]}
                        onValueChange={(value) => setThickness(value[0].toString())}
                        className="mt-2"
                      />
                    </div>
                    
                    <div className="bg-blue-50 p-2 rounded text-xs text-center">
                      {parseFloat(thickness || defaultThickness.toString()) < defaultThickness ? (
                        <p>Espessura menor que o padrão recomendado ({defaultThickness}mm)</p>
                      ) : parseFloat(thickness || defaultThickness.toString()) > defaultThickness ? (
                        <p>Espessura maior que o padrão recomendado ({defaultThickness}mm)</p>
                      ) : (
                        <p>Espessura igual ao padrão recomendado ({defaultThickness}mm)</p>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="mt-4">
                  <div className={`p-3 rounded-lg ${getThicknessColor(parseFloat(thickness || defaultThickness.toString()))}`}>
                    <p className="text-sm text-center">
                      <strong>Atenção:</strong> O consumo aumenta proporcionalmente à espessura.
                    </p>
                  </div>
                </div>
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
                      <p className="text-gray-500">
                        {calculationResult.isLinear ? "Comprimento" : "Área"}
                      </p>
                      <p className="font-bold">{calculationResult.area} {calculationResult.isLinear ? "m" : "m²"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Consumo (padrão)</p>
                      <p className="font-bold">
                        {calculationResult.consumptionRate} {calculationResult.consumptionUnit}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Espessura</p>
                      <p className="font-bold">
                        {calculationResult.thickness} mm 
                        {calculationResult.thickness !== defaultThickness && (
                          <span className="text-xs ml-1 text-blue-600">
                            ({calculationResult.thickness > defaultThickness ? "+" : ""}
                            {(((calculationResult.thickness / defaultThickness) - 1) * 100).toFixed(0)}%)
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Fator de ajuste</p>
                      <p className="font-bold">
                        {(calculationResult.thickness / defaultThickness).toFixed(2)}x
                      </p>
                    </div>
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
