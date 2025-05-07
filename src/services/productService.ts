
import { createClient } from "@supabase/supabase-js";
import { Product } from "@/data/products";

// Create a function to get the Supabase client, with error handling
const getSupabaseClient = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  // Check if Supabase credentials are available
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase credentials not found in environment variables");
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const getProductsFromSupabase = async (): Promise<Product[]> => {
  try {
    // Get Supabase client
    const supabase = getSupabaseClient();
    
    // Join produtos with categorias_produtos to get category name
    const { data, error } = await supabase
      .from('produtos')
      .select(`
        id,
        nome,
        descricao,
        categorias_produtos:categoria_id (
          id,
          nome,
          tipo
        )
      `);
    
    if (error) {
      console.error('Erro ao buscar produtos do Supabase:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.warn('Nenhum produto encontrado no Supabase');
      // Return empty array when no data found
      return [];
    }
    
    // Map Supabase data to Product format
    return data.map((item: any): Product => ({
      id: item.id,
      name: item.nome,
      description: item.descricao || '',
      category: item.categorias_produtos?.nome || 'Sem categoria',
      imageUrl: '/placeholder.svg', // Default image since no image in schema
      technicalSheet: `Ficha técnica de ${item.nome}` // Default technical sheet
    }));
  } catch (error) {
    console.error('Erro no serviço de produtos:', error);
    throw error;
  }
};

export const getProductByIdFromSupabase = async (id: string): Promise<Product | null> => {
  try {
    // Get Supabase client
    const supabase = getSupabaseClient();
    
    // Get product with category info
    const { data, error } = await supabase
      .from('produtos')
      .select(`
        id,
        nome,
        descricao,
        categorias_produtos:categoria_id (
          id,
          nome,
          tipo
        ),
        especificacoes:especificacoes_aplicacao(
          espessura_mm,
          consumo_m2_kg,
          rendimento_m2_kg
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Erro ao buscar produto do Supabase:', error);
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    // Map to Product type with proper handling of specifications
    return {
      id: data.id,
      name: data.nome,
      description: data.descricao || '',
      category: data.categorias_produtos?.nome || 'Sem categoria',
      imageUrl: '/placeholder.svg', // Default image since no image in schema
      technicalSheet: `Ficha técnica de ${data.nome}`,
      specifications: data.especificacoes && data.especificacoes.length > 0 ? {
        thickness: data.especificacoes[0].espessura_mm,
        consumption: data.especificacoes[0].consumo_m2_kg,
        yield: data.especificacoes[0].rendimento_m2_kg
      } : undefined
    };
  } catch (error) {
    console.error('Erro ao buscar produto por ID:', error);
    throw error;
  }
};

// Function to get product categories from Supabase
export const getCategoriesFromSupabase = async (): Promise<string[]> => {
  try {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('categorias_produtos')
      .select('nome');
    
    if (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Extract category names
    return data.map((category: any) => category.nome);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    throw error;
  }
};
