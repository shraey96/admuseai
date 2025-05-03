"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import type { Tables } from "@/lib/supabaseClient";

type Brand = Tables["brands"];
type BrandInput = Omit<Brand, "id" | "user_id" | "created_at" | "updated_at">;

export function useBrands() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBrands = async (): Promise<Brand[]> => {
    if (!user) return [];

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
        return [];
      }

      return data as Brand[];
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch brands";
      setError(message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getBrand = async (brandId: string): Promise<Brand | null> => {
    if (!user) return null;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("id", brandId)
        .eq("user_id", user.id)
        .single();

      if (error) {
        setError(error.message);
        return null;
      }

      return data as Brand;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch brand";
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createBrand = async (brandData: BrandInput): Promise<Brand | null> => {
    if (!user) return null;

    setIsLoading(true);
    setError(null);

    try {
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from("brands")
        .insert({
          ...brandData,
          user_id: user.id,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (error) {
        setError(error.message);
        return null;
      }

      return data as Brand;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create brand";
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBrand = async (
    brandId: string,
    brandData: Partial<BrandInput>
  ): Promise<Brand | null> => {
    if (!user) return null;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("brands")
        .update({
          ...brandData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", brandId)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        setError(error.message);
        return null;
      }

      return data as Brand;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update brand";
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBrand = async (brandId: string): Promise<boolean> => {
    if (!user) return false;

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("brands")
        .delete()
        .eq("id", brandId)
        .eq("user_id", user.id);

      if (error) {
        setError(error.message);
        return false;
      }

      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete brand";
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getBrands,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand,
    isLoading,
    error,
  };
}
