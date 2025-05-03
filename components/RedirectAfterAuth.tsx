"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function RedirectAfterAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Handle Supabase auth return with code in URL
    const handleAuthReturn = async () => {
      // Check if we have a code in the URL
      const code = searchParams.get("code");

      if (code) {
        try {
          // Exchange code for session
          await supabase.auth.exchangeCodeForSession(code);

          // Get redirectTo from URL or default to /app
          const redirectTo = searchParams.get("redirectTo") || "/app";
          router.push(redirectTo);
        } catch (error) {
          console.error("Error exchanging code for session:", error);
          router.push("/login?error=auth");
        }
      }
    };

    handleAuthReturn();
  }, [router, searchParams]);

  return null;
}
