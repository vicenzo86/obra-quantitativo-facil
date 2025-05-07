
export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  technicalSheet: string;
  components?: ProductComponent[];
  specifications?: {
    thickness?: number;  // espessura_mm
    consumption?: number; // consumo_m2_kg
    yield?: number; // rendimento_m2_kg
  };
}

export interface ProductComponent {
  name: string;
  description: string;
  specificWeight: number; // Peso específico em kg/l
  parts?: ProductPart[];
}

export interface ProductPart {
  name: string; // Ex: Parte A, Parte B
  weight: number; // Peso em kg
  ratio?: number; // Proporção de mistura
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
    technicalSheet: "Ficha técnica do 4237 Aditivo para Argamassa",
    components: [
      {
        name: "4237 Aditivo Líquido",
        description: "Aditivo látex para argamassas",
        specificWeight: 1.05,
      }
    ]
  },
  {
    id: "2",
    name: "254 Platinum",
    category: "Argamassas",
    description: "Argamassa colante de alto desempenho para porcelanatos e pedras naturais.",
    imageUrl: "/placeholder.svg",
    technicalSheet: "Ficha técnica do 254 Platinum",
    components: [
      {
        name: "254 Platinum Pó",
        description: "Argamassa colante em pó",
        specificWeight: 1.3,
      }
    ]
  },
  {
    id: "3",
    name: "HYDRO BAN®",
    category: "Impermeabilizantes",
    description: "Membrana impermeabilizante de cura rápida para áreas úmidas.",
    imageUrl: "/placeholder.svg",
    technicalSheet: "Ficha técnica do HYDRO BAN®",
    components: [
      {
        name: "HYDRO BAN® Membrana",
        description: "Membrana impermeabilizante líquida",
        specificWeight: 1.2,
      }
    ]
  },
  {
    id: "4",
    name: "SPECTRALOCK® PRO Premium",
    category: "Rejuntes",
    description: "Rejunte epóxi premium resistente a manchas e produtos químicos.",
    imageUrl: "/placeholder.svg",
    technicalSheet: "Ficha técnica do SPECTRALOCK® PRO Premium",
    components: [
      {
        name: "SPECTRALOCK® Parte A",
        description: "Resina epóxi - parte A",
        specificWeight: 1.1,
        parts: [
          { name: "Parte A", weight: 0.8 }
        ]
      },
      {
        name: "SPECTRALOCK® Parte B",
        description: "Catalisador - parte B",
        specificWeight: 1.05,
        parts: [
          { name: "Parte B", weight: 0.2 }
        ]
      },
      {
        name: "SPECTRALOCK® Agregado em Pó",
        description: "Mistura de agregados coloridos",
        specificWeight: 1.4,
        parts: [
          { name: "Pó Colorido", weight: 3.0 }
        ]
      }
    ]
  },
  {
    id: "5",
    name: "PERMACOLOR® Select",
    category: "Rejuntes",
    description: "Rejunte cimentício de alta performance com proteção antimicrobiana.",
    imageUrl: "/placeholder.svg",
    technicalSheet: "Ficha técnica do PERMACOLOR® Select",
    components: [
      {
        name: "PERMACOLOR® Base",
        description: "Base cimentícia para rejunte",
        specificWeight: 1.3,
      },
      {
        name: "PERMACOLOR® Pigmento",
        description: "Pigmento colorido para mistura",
        specificWeight: 0.9,
      }
    ]
  },
  {
    id: "6",
    name: "LATAPOXY® 300",
    category: "Adesivos",
    description: "Adesivo epóxi químicamente resistente para instalação de cerâmicas e pedras.",
    imageUrl: "/placeholder.svg",
    technicalSheet: "Ficha técnica do LATAPOXY® 300",
    components: [
      {
        name: "LATAPOXY® Parte A",
        description: "Resina epóxi - parte A",
        specificWeight: 1.15,
        parts: [
          { name: "Parte A", weight: 1.0, ratio: 1 }
        ]
      },
      {
        name: "LATAPOXY® Parte B",
        description: "Catalisador - parte B",
        specificWeight: 1.0,
        parts: [
          { name: "Parte B", weight: 0.2, ratio: 0.2 }
        ]
      },
      {
        name: "LATAPOXY® Parte C",
        description: "Agregado em pó - parte C",
        specificWeight: 1.6,
        parts: [
          { name: "Parte C", weight: 2.8, ratio: 2.8 }
        ]
      }
    ]
  },
  {
    id: "7",
    name: "Especificação Membrana Poliuretano",
    category: "Especificações",
    description: "Sistema completo de impermeabilização com membrana de poliuretano Elastoguard Aqua e primer.",
    imageUrl: "/placeholder.svg",
    technicalSheet: "Ficha técnica do Sistema Membrana de Poliuretano",
    components: [
      {
        name: "Elastoguard Primer",
        description: "Primer para preparo da superfície",
        specificWeight: 1.05,
        parts: [
          { name: "Parte A", weight: 4.0, ratio: 4 },
          { name: "Parte B", weight: 1.0, ratio: 1 }
        ]
      },
      {
        name: "Elastoguard Aqua",
        description: "Membrana de poliuretano impermeabilizante",
        specificWeight: 1.3,
        parts: [
          { name: "Parte A", weight: 20.0 },
          { name: "Parte B", weight: 4.0 }
        ]
      }
    ]
  }
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
  {
    productId: "7",
    unit: "kg/m²",
    value: 1.8,
    conditions: "Aplicação total do sistema (primer + membrana)"
  }
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
