
import React, { useContext } from "react";
import { SupabaseContext } from "@/App";

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
    isAuthenticated: !!user
  };
};
