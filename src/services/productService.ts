
import { createClient } from "@supabase/supabase-js";
import { Product } from "@/data/products";

// Obter as credenciais do Supabase do ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Inicializar o cliente do Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getProductsFromSupabase = async (): Promise<Product[]> => {
  try {
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
      price: item.price || 0,
      category: item.category || '',
      imageUrl: item.image_url || '/placeholder.svg',
      features: item.features || [],
      technicalDetails: item.technical_details || {},
      applicationMethods: item.application_methods || [],
      consumption: item.consumption || {}
    }));
  } catch (error) {
    console.error('Erro no serviço de produtos:', error);
    throw error;
  }
};

export const getProductByIdFromSupabase = async (id: string): Promise<Product | null> => {
  try {
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
      price: data.price || 0,
      category: data.category || '',
      imageUrl: data.image_url || '/placeholder.svg',
      features: data.features || [],
      technicalDetails: data.technical_details || {},
      applicationMethods: data.application_methods || [],
      consumption: data.consumption || {}
    };
  } catch (error) {
    console.error('Erro ao buscar produto por ID:', error);
    throw error;
  }
};
