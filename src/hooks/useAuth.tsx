
import React, { useContext } from "react";
import { SupabaseContext } from "@/App";

export const useAuth = () => {
  const { user, loading } = useContext(SupabaseContext);
  return { user, loading };
};
