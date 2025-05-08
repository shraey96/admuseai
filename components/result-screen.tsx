"use client";

import { Button } from "@/components/ui/button";
import {
  Download,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { downloadImage } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { trackAnalytics, ANALYTICS_EVENTS } from "@/lib/analytics";
interface ResultScreenProps {
  images: string[];
  onGenerateAnother: () => void;
}

export default function ResultScreen({
  images,
  onGenerateAnother,
}: ResultScreenProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentImage = images[activeIndex];
  const { toast } = useToast();

  useEffect(() => {
    // Copy all image links to clipboard
    const imageLinks = images.join("\n");
    navigator.clipboard
      .writeText(imageLinks)
      .then(() => {
        toast({
          title: "Links Copied!",
          description: "All image links have been copied to your clipboard",
          variant: "default",
          duration: 3000,
        });
      })
      .catch((err) => {
        console.error("Failed to copy links:", err);
      });
  }, [images, toast]);

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDownload = () => {
    downloadImage(
      currentImage,
      `admuseai-creative-${activeIndex + 1}-${Date.now()}.png`
    );
    trackAnalytics(ANALYTICS_EVENTS.DOWNLOAD_AD_CLICKED, {
      image_url: currentImage,
    });
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-2xl">
      <div className="p-4 sm:p-6">
        <div className="text-center mb-4 sm:mb-6">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <div className="h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center mr-2 sm:mr-3">
              <img
                src="/images/admuse.png"
                alt="AdMuseAI Logo"
                className="h-7 w-7 sm:h-8 sm:w-8"
              />
            </div>
            <span className="text-[#6366f1] font-semibold text-base sm:text-lg">
              AdMuseAI
            </span>
          </div>

          <motion.h3
            className="text-[#6366f1] text-xl sm:text-2xl font-bold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Your Ad Creatives are Ready!
          </motion.h3>
        </div>

        {/* Main image display */}
        <motion.div
          className="relative h-[min(55vh,400px)] sm:h-[min(65vh,480px)] w-full mb-4 sm:mb-6 rounded-xl sm:rounded-2xl overflow-hidden bg-[#F8F9FF]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Image
            src={currentImage || "/placeholder.svg"}
            alt={`Generated ad creative ${activeIndex + 1}`}
            fill
            className="object-contain rounded-xl sm:rounded-2xl"
          />

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm h-7 w-7 sm:h-9 sm:w-9 rounded-full shadow-sm"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm h-7 w-7 sm:h-9 sm:w-9 rounded-full shadow-sm"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </>
          )}
        </motion.div>

        {/* Thumbnail gallery */}
        {images.length > 1 && (
          <motion.div
            className="flex gap-1 sm:gap-1.5 mb-4 sm:mb-6 justify-center flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {images.map((img, index) => (
              <div
                key={index}
                className={`relative h-12 w-12 sm:h-14 sm:w-14 rounded-md overflow-hidden cursor-pointer transition-all duration-200 ${
                  index === activeIndex
                    ? "ring-2 ring-[#6366f1] ring-offset-1"
                    : "opacity-70 hover:opacity-100"
                }`}
                onClick={() => setActiveIndex(index)}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </motion.div>
        )}

        {/* Info message */}
        <div className="mb-4 sm:mb-6 p-2 sm:p-3 bg-[#EEF2FF] rounded-lg sm:rounded-xl border border-[#6366f1]/20">
          <div className="flex items-start space-x-2 sm:space-x-3">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#6366f1] mt-0.5 flex-shrink-0" />
            <div className="text-xs sm:text-sm text-[#4338ca]">
              <p>
                All image links have been copied to your clipboard. Images are
                available for 24 hours only - please download them before
                leaving. You will NOT be emailed the images.
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-2 sm:gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div whileHover={{ scale: 1.02 }} className="flex-1">
            <Button
              onClick={handleDownload}
              className="w-full bg-[#6366f1] hover:bg-[#5558e6] text-white rounded-lg sm:rounded-xl py-2 sm:py-3 h-auto text-sm sm:text-base"
            >
              <Download className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Download
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="flex-1">
            <Button
              variant="outline"
              onClick={onGenerateAnother}
              className="w-full border-[#6366f1] text-[#6366f1] hover:bg-[#6366f1]/5 rounded-lg sm:rounded-xl py-2 sm:py-3 h-auto text-sm sm:text-base"
            >
              <Sparkles className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Generate More
            </Button>
          </motion.div>
        </motion.div>
        {/* Feedback Button */}
        <motion.div
          className="mt-3 sm:mt-4 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="outline"
            className="border-[#6366f1] text-[#6366f1] hover:bg-[#6366f1]/10 rounded-lg sm:rounded-xl py-1.5 sm:py-2 px-4 sm:px-6 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold shadow-sm"
            onClick={() => {
              trackAnalytics(ANALYTICS_EVENTS.GIVE_FEEDBACK_CLICKED);
              window.open("https://tally.so/r/wLVg1J", "_blank");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 sm:w-5 sm:h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 20.25c4.97 0 9-2.686 9-6V7.5c0-3.314-4.03-6-9-6s-9 2.686-9 6v6.75c0 3.314 4.03 6 9 6Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 10.5l3 3 4.5-4.5"
              />
            </svg>
            Give Feedback
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
