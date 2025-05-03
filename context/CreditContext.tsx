"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabaseClient";

type CreditContextType = {
  credits: number;
  isLoading: boolean;
  getUserCredits: () => Promise<number>;
  hasEnoughCredits: (requiredCredits?: number) => boolean;
  recordCreditTransaction: (
    amount: number,
    operation: string,
    operationId: string | null,
    metadata?: Record<string, any>
  ) => Promise<boolean>;
  refreshCredits: () => Promise<void>;
};

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export function CreditProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user credits when user changes
  useEffect(() => {
    if (user) {
      refreshCredits();
    } else {
      setCredits(0);
      setIsLoading(false);
    }
  }, [user]);

  const refreshCredits = async () => {
    setIsLoading(true);
    try {
      if (!user) {
        setCredits(0);
        return;
      }

      const { data, error } = await supabase
        .from("credits")
        .select("amount")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user credits:", error);
        throw error;
      }

      setCredits(data?.amount || 0);
    } catch (err) {
      console.error("Failed to fetch credits:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserCredits = async (): Promise<number> => {
    if (!user) return 0;
    await refreshCredits();
    return credits;
  };

  const hasEnoughCredits = (requiredCredits: number = 2): boolean => {
    return credits >= requiredCredits;
  };

  const recordCreditTransaction = async (
    amount: number,
    operation: string,
    operationId: string | null,
    metadata: Record<string, any> = {}
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      // First, create the transaction record
      const { error: transactionError } = await supabase
        .from("credit_transactions")
        .insert({
          user_id: user.id,
          amount,
          operation,
          operation_id: operationId,
          status: "completed",
          metadata,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (transactionError) {
        console.error("Error recording credit transaction:", transactionError);
        return false;
      }

      // Then update the user's credit balance
      const { error: creditError } = await supabase.rpc("update_user_credits", {
        user_id_param: user.id,
        amount_param: amount,
      });

      if (creditError) {
        console.error("Error updating user credits:", creditError);
        return false;
      }

      // Update local state
      setCredits((prevCredits) => Math.max(0, prevCredits + amount));
      return true;
    } catch (err) {
      console.error("Failed to process credit transaction:", err);
      return false;
    }
  };

  const value = {
    credits,
    isLoading,
    getUserCredits,
    hasEnoughCredits,
    recordCreditTransaction,
    refreshCredits,
  };

  return (
    <CreditContext.Provider value={value}>{children}</CreditContext.Provider>
  );
}

export const useCredits = () => {
  const context = useContext(CreditContext);
  if (context === undefined) {
    throw new Error("useCredits must be used within a CreditProvider");
  }
  return context;
};
