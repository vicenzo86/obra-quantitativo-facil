
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
    
    // Tentar buscar produtos do Supabase
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error('Erro ao buscar produtos do Supabase:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.warn('Nenhum produto encontrado no Supabase');
      // Retornar os dados locais como fallback
      return [];
    }
    
    // Mapear os dados do Supabase para o formato Product
    return data.map((item: any): Product => ({
      id: item.id.toString(),
      name: item.name,
      description: item.description || '',
      category: item.category || '',
      imageUrl: item.image_url || '/placeholder.svg',
      // Only include properties that are in the Product type
      // We'll add our custom properties later
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
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Erro ao buscar produto do Supabase:', error);
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    return {
      id: data.id.toString(),
      name: data.name,
      description: data.description || '',
      category: data.category || '',
      imageUrl: data.image_url || '/placeholder.svg',
      // Only include properties that are in the Product type from data/products.ts
    };
  } catch (error) {
    console.error('Erro ao buscar produto por ID:', error);
    throw error;
  }
};
