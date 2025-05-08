"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GenerateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function GenerateButton({
  onClick,
  disabled = false,
  loading = false,
}: GenerateButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full">
      {/* Hidden element to reserve space for consistent width */}
      <div className="opacity-0 invisible absolute pointer-events-none w-full">
        <Button className="w-full py-4 rounded-xl text-base font-medium h-auto">
          <span className="flex items-center justify-center">
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Generate My Ad - Free</span>
          </span>
        </Button>
      </div>

      <Button
        onClick={onClick}
        disabled={disabled || loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl text-base font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed h-auto shadow-md relative"
        style={{
          background: "linear-gradient(to right, #6366f1, #8b5cf6)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="flex items-center justify-center relative">
          {loading ? (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          <span>Generate My Ad</span>

          <AnimatePresence>
            {(isHovered || loading) && (
              <motion.span
                initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                animate={{ opacity: 1, width: "auto", marginLeft: 4 }}
                exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                transition={{
                  duration: 0.3,
                  ease: [0.25, 0.1, 0.25, 1],
                  opacity: { duration: 0.2 },
                }}
                className="overflow-hidden block"
              >
                - Free
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </Button>
    </div>
  );
}
