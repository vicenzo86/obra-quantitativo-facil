
import React, { useContext } from "react";
import { SupabaseContext } from "@/App";

export const useAuth = () => {
  const context = useContext(SupabaseContext);
  
  if (!context) {
    throw new Error("useAuth must be used within a SupabaseProvider");
  }
  
  const { user, loading, supabase } = context;
  
  const login = async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabase não configurado");
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    return data;
  };
  
  const logout = async () => {
    if (!supabase) throw new Error("Supabase não configurado");
    
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
  };
  
  return { 
    user, 
    loading,
    supabase,
    login,
    logout,
    isAuthenticated: !!user
  };
};
