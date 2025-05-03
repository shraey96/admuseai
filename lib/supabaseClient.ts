import { createClient } from "@supabase/supabase-js";

// Use environment variables with fallbacks
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

// Create the Supabase client with persistent storage for auth
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    autoRefreshToken: true,
  },
});

// Database types for TypeScript
export type Tables = {
  // Credits table
  credits: {
    id: string;
    user_id: string;
    amount: number;
    created_at: string;
    updated_at: string;
  };

  // Credit transactions table for audit trail
  credit_transactions: {
    id: string;
    user_id: string;
    amount: number; // Positive for additions, negative for deductions
    operation: string; // e.g., "generate_ad", "refund", etc.
    operation_id: string | null; // Reference to the entity that used credits
    status: "pending" | "completed" | "refunded" | "failed";
    metadata: Record<string, any>; // JSON object with additional details
    created_at: string;
    updated_at: string;
  };

  // Credit configuration table
  credit_configs: {
    id: string;
    operation: string; // e.g., "generate_ad"
    base_cost: number;
    additional_params: Record<string, number>; // JSON object with cost modifiers
    description: string;
    created_at: string;
    updated_at: string;
  };

  // Brands table
  brands: {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    logo_url: string | null;
    color_palette: string[] | null;
    industry: string | null;
    website_url: string | null;
    created_at: string;
    updated_at: string;
  };

  // Ads table
  ads: {
    id: string;
    brand_id: string | null; // Optional brand association
    user_id: string;
    prompt: string;
    visual_style: string | null;
    result_urls: string[];
    original_image_urls: string[];
    status: "pending" | "completed" | "failed";
    error_message: string | null;
    ad_type: string;
    dimensions: string | null;
    metadata: Record<string, any>; // JSON object with parameters that affected credits
    credits_used: number;
    created_at: string;
    completed_at: string | null;
    updated_at: string;
  };
};
