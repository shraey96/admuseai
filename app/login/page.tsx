"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import RedirectAfterAuth from "@/components/RedirectAfterAuth";

export default function LoginPage() {
  const { user, signInWithGoogle, signInWithMagicLink, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/app";
  const error = searchParams.get("error");

  useEffect(() => {
    // If already logged in, redirect to app
    if (user) {
      router.push(redirectTo);
    }

    // Check for error param
    if (error === "auth") {
      setErrorMessage("Authentication failed. Please try again.");
    }
  }, [user, router, redirectTo, error]);

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setIsSendingMagicLink(true);
    setErrorMessage(null);

    try {
      const result = await signInWithMagicLink(email);

      if (result.success) {
        setMagicLinkSent(true);
      } else {
        setErrorMessage(result.error || "Failed to send magic link");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSendingMagicLink(false);
    }
  };

  // Show loader when checking auth state
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Include RedirectAfterAuth component to handle code exchange on return
  return (
    <>
      <RedirectAfterAuth />
      <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
            <CardDescription>
              Choose your preferred sign in method
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {magicLinkSent ? (
              <div className="text-center py-4">
                <Mail className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-medium">Check your email</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  We've sent a magic link to <strong>{email}</strong>.
                  <br />
                  Click the link in your email to sign in.
                </p>
              </div>
            ) : (
              <>
                <Button
                  onClick={signInWithGoogle}
                  variant="outline"
                  className="w-full"
                >
                  Continue with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <form onSubmit={handleMagicLinkSignIn}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        id="email"
                        placeholder="name@example.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSendingMagicLink}
                    >
                      {isSendingMagicLink ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Sign in with Email"
                      )}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
