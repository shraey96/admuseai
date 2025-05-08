"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const faqs = [
  {
    question: "Do Ad Credits expire?",
    answer:
      "Nope! Your Ad Credits never expire. Use them anytime to generate ad creatives with AdMuseAI.",
  },
  {
    question: "What if I don't like the ads?",
    answer:
      "We don't offer refunds, but you can generate unlimited variations by uploading new images or tweaking your prompt. Each generation costs 2 Ad Credits.",
  },
  {
    question: "What is AdMuseAI?",
    answer:
      "AdMuseAI is your AI-powered ad creative assistant. Upload your product image, pick a style or write a custom prompt, and get high-converting ads in seconds.",
  },
  {
    question: "What is an Ad Credit?",
    answer:
      "Ad Credits are used to generate ads. Each generation includes an image + copy and costs 2 credits.",
  },
  {
    question: "Will the price increase in the future?",
    answer:
      "Yes, prices may increase as we launch more features. Buying credits now gets you the best deal.",
  },
  {
    question: "Can it clone existing ads?",
    answer:
      "Yes! You can upload an existing ad and generate AI-powered variations from it.",
  },
  {
    question: "How long does it take to generate an ad?",
    answer:
      "Most ads are generated in under 2 minutes—just upload, prompt, and go!",
  },
  {
    question: "What kind of ads can it generate?",
    answer:
      "AdMuseAI creates scroll-stopping ads designed for platforms like Instagram, Facebook, TikTok, LinkedIn, and more.",
  },
  {
    question: "Does it support eCommerce?",
    answer:
      "Yes! AdMuseAI works well for eCommerce brands—just upload a clean product photo and you're good to go.",
  },
  {
    question: "Does it also generate ad copy?",
    answer:
      "Absolutely. Each ad includes tailored ad copy to complement your image and brand tone.",
  },
  {
    question: "Can I edit the ad after it's generated?",
    answer:
      "You can't edit an image directly, but you can generate new variations by changing the prompt, image, or style.",
  },
  {
    question: "What ad styles/templates can I choose from?",
    answer: `AdMuseAI offers curated templates to guide your ad's look and tone:
    • 🧃 Promo Splash (Prime-style)
    • 📸 Product in Hand
    • 🧼 Studio Flat Lay
    • 🐱 Quirky UGC Copy
    • 🪥 Product in Action
    • 🥭 Flavor Spotlight
    • Or write your own custom prompt to get a fully personalized ad creative.`,
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="scroll-mt-20 relative">
      <div className="relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#4f46e5] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
            Got questions? We've got answers.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mx-auto"
        >
          <Card className="bg-transparent border-0 shadow-none">
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm mb-3 last:mb-0 overflow-hidden"
                  >
                    <AccordionItem value={`item-${index}`} className="border-0">
                      <AccordionTrigger className="text-left font-medium text-zinc-800 hover:text-[#4f46e5] transition-colors py-4 px-5 w-full">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-zinc-600 whitespace-pre-line px-5 pb-4 pt-1 text-sm">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
