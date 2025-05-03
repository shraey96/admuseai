"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import RedirectAfterAuth from "@/components/RedirectAfterAuth";

export default function AuthCallbackPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Completing sign in...
      </p>
      <RedirectAfterAuth />
    </div>
  );
}
