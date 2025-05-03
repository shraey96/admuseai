"use client";

import { Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BrandEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Tag className="h-12 w-12 text-muted-foreground mb-4" />
      <h2 className="text-lg font-semibold mb-2">No brands found</h2>
      <p className="text-muted-foreground mb-4">
        Get started by creating your first brand.
      </p>
      <Button asChild>
        <Link href="/app/brands/new">Create Brand</Link>
      </Button>
    </div>
  );
}
