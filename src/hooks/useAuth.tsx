
import React, { useContext } from "react";
import { SupabaseContext } from "@/App";

// Interface for the user profile based on the Supabase schema
export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco_obra: string;
  tipo_uso: 'uso_consumo' | 'revenda';
  contribuinte_icms: boolean;
  estado: 'RS' | 'SC' | 'PR';
  created_at?: string;
  updated_at?: string;
}

export const useAuth = () => {
  const context = useContext(SupabaseContext);
  
  if (!context) {
    throw new Error("useAuth must be used within a SupabaseProvider");
  }
  
  const { user, loading, supabase } = context;
  
  const login = async (email: string, password: string) => {
    if (!supabase) {
      console.log("Supabase not configured, using mock authentication");
      // Simulate login success with mock user for testing without Supabase
      return {
        user: {
          id: 'mock-user-id',
          email: email,
          user_metadata: { name: 'Mock User' }
        }
      };
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    return data;
  };
  
  const register = async (
    email: string, 
    password: string, 
    profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>
  ) => {
    if (!supabase) {
      console.log("Supabase not configured, using mock registration");
      return {
        user: {
          id: 'mock-user-id',
          email: email,
          user_metadata: { name: profile.nome }
        }
      };
    }
    
    // Register the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (authError) throw authError;
    
    if (authData.user) {
      // Insert user profile data
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          ...profile
        });
      
      if (profileError) {
        console.error('Error creating user profile:', profileError);
        // Since the auth user was created, we should try to delete it
        try {
          // This would require admin rights, so it might fail
          // In a real app, this would be handled by a server function
          console.log('Warning: Auth user created but profile creation failed');
        } catch (e) {
          console.error('Failed to clean up auth user after profile creation error', e);
        }
        
        throw profileError;
      }
    }
    
    return authData;
  };
  
  const getUserProfile = async (): Promise<UserProfile | null> => {
    if (!supabase || !user) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data as UserProfile;
  };
  
  const logout = async () => {
    if (!supabase) {
      console.log("Supabase not configured, clearing mock session");
      // We can just return without error when Supabase is not available
      return;
    }
    
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
  };
  
  return { 
    user, 
    loading,
    supabase,
    login,
    logout,
    register,
    getUserProfile,
    isAuthenticated: !!user
  };
};
