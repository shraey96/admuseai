import React from "react";
import { plans, PricingPlan } from "./pricing-config";
import PricingCard from "./pricing-card";

export default function PricingView() {
  if (!plans || plans.length === 0) {
    return <p>No pricing plans available at the moment.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 xl:gap-12 items-stretch">
      {plans.map((plan: PricingPlan) => (
        <PricingCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}
