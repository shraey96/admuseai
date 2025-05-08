"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import GenerationScreen from "./generation-screen";
import ResultModal from "./result-modal";
import GenerateButton from "./ui/generate-button";
import { generateAdCreative } from "@/lib/api";
import AnimatedBorder from "@/components/animated-border";
import { trackAnalytics, ANALYTICS_EVENTS } from "@/lib/analytics";
import ConfettiPortal from "./ui/confetti-portal";
import { useToast } from "@/hooks/use-toast";

import PromptWizard from "./prompt-wizard";
import ImageUploader from "./image-uploader";
import { scrollToElement } from "@/lib/utils";
import { Play, AlertCircle } from "lucide-react";

type Stage = "upload" | "generating" | "result";

export default function AdGenerator() {
  const [stage, setStage] = useState<Stage>("upload");
  const [images, setImages] = useState<string[]>([]);
  const [wizardPayload, setWizardPayload] = useState<{
    prompt: string;
    size: string;
    templateName: string;
    selectedIntent: string | null;
  } | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const confettiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (images.length === 0 || !wizardPayload) return;

    trackAnalytics(ANALYTICS_EVENTS.GENERATE_AD_CLICKED, {
      ...wizardPayload,
    });

    try {
      // Initialize payment
      const uid = "user-" + Date.now();
      let transactionId = `t_${uid}`;
      let email = `${uid}@admuseai.com`;

      // Show generation screen
      setStage("generating");

      // Call API to generate ad
      const result = await generateAdCreative(
        images,
        wizardPayload.prompt,
        transactionId,
        email,
        {
          size: wizardPayload.size,
          templateName: wizardPayload.templateName,
          selectedIntent: wizardPayload.selectedIntent,
        }
      );

      if (result.success && result.imageUrls) {
        setGeneratedImages(result.imageUrls);
        setStage("upload"); // Return to upload stage, but show modal
        setShowResultModal(true);
        // Start confetti celebration
        setShowConfetti(true);
        if (confettiTimeoutRef.current) {
          clearTimeout(confettiTimeoutRef.current);
        }
        confettiTimeoutRef.current = setTimeout(() => removeConfetti(), 3000); // Stop after 5 seconds
      } else {
        throw new Error(result.error || "Failed to generate ad");
      }
    } catch (err) {
      console.error("Process failed:", err);

      // Don't show error for cancelled payments
      if (err instanceof Error && err.message === "Payment cancelled") {
        setIsLoading(false);
        return;
      }

      // Check for rate limit error
      if (err instanceof Error && err.message.includes("rate_limit_exceeded")) {
        // Set error type only, no explicit error message
        setError(null);
        setErrorType("rate_limit_exceeded");

        toast({
          title: "Free Limit Reached",
          description: (
            <>
              You've reached your free image generation limit.{" "}
              <a
                href="#pricing"
                className="font-semibold underline text-indigo-600 hover:text-indigo-500"
                onClick={() => {
                  trackAnalytics("rate_limit_pricing_clicked", {
                    source: "rate_limit_toast",
                  });
                  scrollToElement("pricing");
                }}
              >
                Sign up for free credits
              </a>
            </>
          ),
          variant: "default",
        });
      } else {
        // Existing generic error handling
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        setErrorType(null);
        toast({
          title: "Generation Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
      setStage("upload");
    }
  };

  const handleGenerateAnother = () => {
    setImages([]);
    setWizardPayload(null);
    setGeneratedImages(null);
    setError(null);
    setErrorType(null);
    setShowResultModal(false);
    removeConfetti();
  };

  const removeConfetti = () => {
    if (confettiTimeoutRef.current) {
      clearTimeout(confettiTimeoutRef.current);
      confettiTimeoutRef.current = null;
    }
    setShowConfetti(false);
  };

  const handlePromptGenerated = (payload: {
    prompt: string;
    size: string;
    templateName: string;
    selectedIntent: string | null;
  }) => {
    setWizardPayload(payload);
  };

  if (stage === "generating") {
    return <GenerationScreen />;
  }

  return (
    <>
      <div className="relative">
        <AnimatedBorder>
          <Card className="bg-white shadow-xl border border-gray-100 rounded-2xl overflow-hidden">
            <CardContent className="p-4 sm:p-7">
              <div className="mb-4 sm:mb-5">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Try it out!
                </h2>
                {errorType === "rate_limit_exceeded" ? (
                  <div className="mt-3 mb-1 py-1.5 text-left text-sm animate-pulse">
                    <a
                      href="#pricing"
                      className="flex items-center gap-1.5 text-rose-600 font-semibold hover:text-rose-800 hover:underline transition-colors group"
                      onClick={() => {
                        trackAnalytics("rate_limit_pricing_clicked", {
                          source: "rate_limit_subtle_link",
                        });
                        scrollToElement("pricing");
                      }}
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span className="group-hover:underline">
                        Free limit reached. Sign up for free credits →
                      </span>
                    </a>
                  </div>
                ) : (
                  error && <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
              </div>

              <div className="space-y-4 sm:space-y-6">
                <ImageUploader images={images} onImagesChange={setImages} />

                <div>
                  <Label className="text-sm font-medium text-zinc-700 mb-2 sm:mb-3 block">
                    <span className="flex items-center">
                      <span className="inline-flex h-6 w-6 rounded-full bg-indigo-500 items-center justify-center text-white text-xs font-medium mr-2">
                        2
                      </span>
                      Add Prompt
                    </span>
                  </Label>
                  <div className="space-y-4">
                    <div className="relative">
                      <Textarea
                        id="prompt"
                        placeholder="Describe your ad creative: guidelines, setting, lighting, mood, etc. E.g. 'Product shot of serum bottle on marble counter, modern bathroom, soft morning light'"
                        value={wizardPayload?.prompt || ""}
                        onChange={(e) => {
                          setWizardPayload((prev) => {
                            return {
                              ...prev,
                              prompt: e.target.value,
                            };
                          });
                        }}
                        className="min-h-[120px] resize-none"
                      />
                      <div className="mt-1.5 flex justify-between items-center">
                        {/* <CopyrightNotice isTooltip /> */}
                        <a
                          href="/prompt-writing-guidelines"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-600 hover:text-indigo-700 hover:underline"
                          onClick={() => {
                            trackAnalytics(
                              ANALYTICS_EVENTS.PROMPT_WRITING_GUIDELINES_CLICKED,
                              {
                                source: "ad_generator",
                              }
                            );
                          }}
                        >
                          Prompt Writing Guidelines
                        </a>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => {
                        trackAnalytics(ANALYTICS_EVENTS.PROMPT_WIZARD_OPENED);
                        setIsWizardOpen(true);
                      }}
                      className="w-full flex items-center gap-2 py-6"
                    >
                      <span>💡</span>
                      Help me write a prompt
                    </Button>
                  </div>
                </div>

                <GenerateButton
                  onClick={handleGenerate}
                  disabled={images.length === 0 || !wizardPayload || isLoading}
                  loading={isLoading}
                />
              </div>
            </CardContent>
          </Card>
        </AnimatedBorder>
        <div className="absolute bottom-0 right-0 translate-y-[calc(100%+0.75rem)] pr-1">
          <button
            onClick={() => scrollToElement("info-video")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <Play className="w-4 h-4" />
            Watch Demo
          </button>
        </div>
      </div>

      {showResultModal && generatedImages && (
        <ResultModal
          isOpen={showResultModal}
          images={generatedImages}
          onClose={() => {
            setShowResultModal(false);
            removeConfetti();
          }}
          onGenerateAnother={handleGenerateAnother}
        />
      )}

      <PromptWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onPromptGenerated={handlePromptGenerated}
      />

      <ConfettiPortal show={showConfetti} />
    </>
  );
}
