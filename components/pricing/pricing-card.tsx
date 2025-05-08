import React from "react";
import { PricingPlan } from "./pricing-config";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, HelpCircle, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  plan: PricingPlan;
}

const getStandaloneBadgeStyling = (badgeColor: string | null) => {
  if (badgeColor === "purple") {
    return { FgClasses: "text-indigo-700", BgClasses: "bg-indigo-100" };
  }
  return { FgClasses: "text-gray-700", BgClasses: "bg-gray-100" };
};

export default function PricingCard({ plan }: PricingCardProps) {
  const isPopular = plan.isPopular;
  const standaloneBadgeStyle = getStandaloneBadgeStyling(plan.badgeColor);
  type FeatureType = { label: string; tooltip: string };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex flex-col h-full relative transition-transform duration-200",
          isPopular ? "md:scale-[1.2] z-10" : "z-0"
        )}
      >
        {isPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-auto z-20">
            <span className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-semibold uppercase tracking-wider py-1 px-3 rounded-full shadow-md">
              <ThumbsUp size={12} /> Most Popular
            </span>
          </div>
        )}
        {!isPopular && plan.badgeLabel && (
          <div className="absolute top-3 right-3 z-10">
            <span
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-full",
                standaloneBadgeStyle.BgClasses,
                standaloneBadgeStyle.FgClasses
              )}
            >
              {plan.badgeLabel}
            </span>
          </div>
        )}

        <div
          className={cn(
            "bg-white shadow-xl flex flex-col flex-grow overflow-hidden",
            isPopular
              ? "rounded-2xl border-2 border-indigo-500"
              : "rounded-xl border border-gray-300"
          )}
        >
          <div className={cn("p-8 flex-grow flex flex-col")}>
            <div className={cn("mb-6 text-left mt-0")}>
              <h3 className="text-xl font-semibold text-gray-800">
                {plan.name}
              </h3>
              <div className="my-3">
                <span className="text-4xl font-bold text-gray-900">
                  ${plan.price}
                </span>
                {plan.originalPrice && (
                  <span className="ml-1.5 text-lg text-gray-400 line-through">
                    ${plan.originalPrice}
                  </span>
                )}
                <span className="text-xs text-gray-500 align-baseline ml-0.5">
                  /USD
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Create up to {plan.ads} ads
              </p>
            </div>

            <ul className="space-y-2.5 mb-8 text-left flex-grow">
              {plan.features.map((feature: FeatureType, index: number) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700 flex items-center">
                    {feature.label}
                    {feature.tooltip && (
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <button className="ml-1.5 text-gray-400 hover:text-gray-600">
                            <HelpCircle size={14} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-black text-white z-50">
                          <p className="max-w-[200px] text-sm">
                            {feature.tooltip}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href={`https://app.admuseai.com/login?redirectTo=pricing`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "block w-full py-3 px-4 rounded-lg text-center text-base font-semibold transition-colors shadow-md mt-auto",
                isPopular
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-slate-800 hover:bg-slate-900 text-white"
              )}
            >
              {plan.ctaText}
            </a>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
