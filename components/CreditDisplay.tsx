"use client";

import { useCredits } from "@/context/CreditContext";
import { Button } from "@/components/ui/button";
import { BadgePlus, Coins, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CreditDisplay() {
  const { credits, isLoading } = useCredits();

  if (isLoading) {
    return (
      <div className="flex items-center text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Loading credits...
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center rounded-full border bg-accent/30 px-3 py-1 text-sm font-medium">
              <Coins className="mr-1 h-4 w-4 text-primary" />
              <span>{credits} Credits</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Your available credits</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Button size="sm" variant="outline" className="gap-1">
        <BadgePlus className="h-4 w-4" />
        <span className="hidden sm:inline">Top Up</span>
      </Button>
    </div>
  );
}
