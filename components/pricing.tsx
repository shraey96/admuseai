"use client";

import { motion } from "framer-motion";
import PricingView from "./pricing/pricing-view";
import { Button } from "@/components/ui/button";
import { scrollToElement } from "@/lib/utils";

export default function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 relative py-16 md:py-24">
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#4f46e5] mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto">
            No subscriptions, no hidden fees. Just pay for what you need.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-5xl mx-auto"
        >
          <PricingView />
        </motion.div>

        <div className="mt-32 text-center text-sm text-zinc-600">
          <div className="font-medium text-zinc-800 mb-1">
            ✨ Try AdMuseAI for Free
          </div>
          <div className="mb-1">
            →
            <a
              href="https://app.admuseai.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline font-medium mx-1"
            >
              Log in
            </a>
            to get 6 Free Credits
          </div>
          <div className="mb-1">
            → Or
            <button
              onClick={() => scrollToElement("ad-generator")}
              className="text-indigo-600 hover:underline font-medium mx-1 bg-transparent border-none p-0 cursor-pointer"
            >
              Generate your first ad free
            </button>
            – no signup needed!
          </div>
        </div>
      </div>
    </section>
  );
}
