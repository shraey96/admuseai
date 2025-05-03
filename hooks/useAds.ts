"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCredits } from "@/context/CreditContext";
import { supabase } from "@/lib/supabaseClient";
import type { Tables } from "@/lib/supabaseClient";

type Ad = Tables["ads"];
type AdInput = Omit<
  Ad,
  "id" | "user_id" | "status" | "created_at" | "updated_at" | "completed_at"
>;

export function useAds() {
  const { user } = useAuth();
  const { recordCreditTransaction } = useCredits();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAds = async (brandId?: string): Promise<Ad[]> => {
    if (!user) return [];

    setIsLoading(true);
    setError(null);

    try {
      let query = supabase.from("ads").select("*").eq("user_id", user.id);

      if (brandId) {
        query = query.eq("brand_id", brandId);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        setError(error.message);
        return [];
      }

      return data as Ad[];
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch ads";
      setError(message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getAd = async (adId: string): Promise<Ad | null> => {
    if (!user) return null;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .eq("id", adId)
        .eq("user_id", user.id)
        .single();

      if (error) {
        setError(error.message);
        return null;
      }

      return data as Ad;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch ad";
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createAd = async (adData: AdInput): Promise<Ad | null> => {
    if (!user) return null;

    setIsLoading(true);
    setError(null);

    try {
      const now = new Date().toISOString();

      // Create the ad record
      const { data, error } = await supabase
        .from("ads")
        .insert({
          ...adData,
          user_id: user.id,
          status: "pending",
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (error) {
        setError(error.message);
        return null;
      }

      const newAd = data as Ad;

      // Record the credit transaction
      await recordCreditTransaction(
        -newAd.credits_used,
        "generate_ad",
        newAd.id,
        { prompt: newAd.prompt, brand_id: newAd.brand_id }
      );

      return newAd;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create ad";
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAdStatus = async (
    adId: string,
    status: "completed" | "failed",
    data?: { result_urls?: string[]; error_message?: string }
  ): Promise<Ad | null> => {
    if (!user) return null;

    setIsLoading(true);
    setError(null);

    try {
      const now = new Date().toISOString();
      const updateData: Record<string, any> = {
        status,
        updated_at: now,
      };

      if (status === "completed") {
        updateData.completed_at = now;
        if (data?.result_urls) {
          updateData.result_urls = data.result_urls;
        }
      }

      if (status === "failed" && data?.error_message) {
        updateData.error_message = data.error_message;
      }

      const { data: updatedAd, error } = await supabase
        .from("ads")
        .update(updateData)
        .eq("id", adId)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        setError(error.message);
        return null;
      }

      return updatedAd as Ad;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update ad status";
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAd = async (adId: string): Promise<boolean> => {
    if (!user) return false;

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("ads")
        .delete()
        .eq("id", adId)
        .eq("user_id", user.id);

      if (error) {
        setError(error.message);
        return false;
      }

      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete ad";
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getAds,
    getAd,
    createAd,
    updateAdStatus,
    deleteAd,
    isLoading,
    error,
  };
}
