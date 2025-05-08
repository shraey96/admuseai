"use client";

import { motion } from "framer-motion";
import { Sparkles, Play } from "lucide-react";
import MediaScroller from "./media-scroller";
import {
  HERO_SAMPLES_LEFT,
  HERO_SAMPLES_RIGHT,
} from "@/constants/hero-samples";
import { scrollToElement } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function Hero() {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen pt-20 md:pt-28 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-8 relative z-10">
        <div className="grid grid-cols-12 gap-8">
          {/* Left side - Text & Features */}
          <div className="col-span-12 lg:col-span-6 space-y-6 md:space-y-8 pt-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6">
                <span className="block mb-2">Never Create Ads Again.</span>
                <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 text-transparent bg-clip-text">
                  AdMuse Does It Better.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-zinc-600 max-w-xl mt-4">
                Upload your product, add a prompt, and get professional-quality
                ad creatives instantly. No login required.
              </p>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                </div>
                <span className="text-zinc-700">Zero design skills needed</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                </div>
                <span className="text-zinc-700">
                  Professional results in seconds
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                </div>
                <span className="text-zinc-700">
                  <span className="font-medium">
                    🎁 6 Free Credits · No Card Needed
                  </span>{" "}
                  <span className="text-zinc-400 font-medium">–</span>{" "}
                  <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-transparent bg-clip-text font-semibold animate-pulse">
                    Only pay if you love it.
                  </span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4">
              <motion.button
                onClick={() => scrollToElement("ad-generator")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 sm:py-3 rounded-xl sm:rounded-lg text-lg font-semibold transition-colors flex-1 sm:flex-initial flex items-center justify-center"
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Try for Free!
              </motion.button>
              <button
                onClick={() => scrollToElement("info-video")}
                className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 px-6 py-4 sm:py-3 rounded-xl sm:rounded-lg text-lg font-semibold border-2 border-gray-200 transition-colors flex-1 sm:flex-initial"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right side - Vertical Media Scroller */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="col-span-12 lg:col-span-6 lg:col-start-7 relative w-[500px] h-[600px] ml-auto"
          >
            <div
              className={cn(
                "h-full",
                isMobile ? "flex flex-col gap-8" : "grid grid-cols-2 gap-8"
              )}
            >
              <div className={cn("h-full", isMobile ? "h-[300px]" : "")}>
                <MediaScroller
                  media={HERO_SAMPLES_LEFT}
                  direction={isMobile ? "left-to-right" : "bottom-to-top"}
                  speed={1}
                  gap={16}
                  syncDirection={true}
                  className="h-full"
                />
              </div>
              <div className={cn("h-full", isMobile ? "h-[300px]" : "")}>
                <MediaScroller
                  media={HERO_SAMPLES_RIGHT}
                  direction={isMobile ? "right-to-left" : "top-to-bottom"}
                  speed={1}
                  gap={16}
                  syncDirection={true}
                  isSecondary={true}
                  className="h-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
