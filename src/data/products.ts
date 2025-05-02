
export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  technicalSheet: string;
}

export interface ConsumptionRate {
  productId: string;
  unit: string;
  value: number;
  conditions: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "4237 Aditivo para Argamassa",
    category: "Aditivos",
    description: "Aditivo látex para melhorar a aderência e flexibilidade das argamassas.",
    imageUrl: "/placeholder.svg",
    technicalSheet: "Ficha técnica do 4237 Aditivo para Argamassa"
  },
  {
    id: "2",
    name: "254 Platinum",
    category: "Argamassas",
    description: "Argamassa colante de alto desempenho para porcelanatos e pedras naturais.",
    imageUrl: "/placeholder.svg",
    technicalSheet: "Ficha técnica do 254 Platinum"
  },
  {
    id: "3",
    name: "HYDRO BAN®",
    category: "Impermeabilizantes",
    description: "Membrana impermeabilizante de cura rápida para áreas úmidas.",
    imageUrl: "/placeholder.svg",
    technicalSheet: "Ficha técnica do HYDRO BAN®"
  },
  {
    id: "4",
    name: "SPECTRALOCK® PRO Premium",
    category: "Rejuntes",
    description: "Rejunte epóxi premium resistente a manchas e produtos químicos.",
    imageUrl: "/placeholder.svg",
    technicalSheet: "Ficha técnica do SPECTRALOCK® PRO Premium"
  },
  {
    id: "5",
    name: "PERMACOLOR® Select",
    category: "Rejuntes",
    description: "Rejunte cimentício de alta performance com proteção antimicrobiana.",
    imageUrl: "/placeholder.svg",
    technicalSheet: "Ficha técnica do PERMACOLOR® Select"
  },
  {
    id: "6",
    name: "LATAPOXY® 300",
    category: "Adesivos",
    description: "Adesivo epóxi químicamente resistente para instalação de cerâmicas e pedras.",
    imageUrl: "/placeholder.svg",
    technicalSheet: "Ficha técnica do LATAPOXY® 300"
  },
];

export const consumptionRates: ConsumptionRate[] = [
  {
    productId: "1",
    unit: "kg/m²",
    value: 0.8,
    conditions: "Para argamassas de assentamento de cerâmicas"
  },
  {
    productId: "2",
    unit: "kg/m²",
    value: 5,
    conditions: "Com desempenadeira de 8mm x 8mm"
  },
  {
    productId: "3",
    unit: "kg/m²",
    value: 1.2,
    conditions: "Por demão, mínimo 2 demãos"
  },
  {
    productId: "4",
    unit: "kg/m²",
    value: 0.6,
    conditions: "Para juntas de 3mm (porcelanatos)"
  },
  {
    productId: "5",
    unit: "kg/m²",
    value: 0.5,
    conditions: "Para juntas de 3mm (cerâmicas comuns)"
  },
  {
    productId: "6",
    unit: "kg/m²",
    value: 3.5,
    conditions: "Com desempenadeira de 6mm x 6mm"
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getConsumptionRateByProductId = (productId: string): ConsumptionRate | undefined => {
  return consumptionRates.find(rate => rate.productId === productId);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getCategories = (): string[] => {
  return [...new Set(products.map(product => product.category))];
};
