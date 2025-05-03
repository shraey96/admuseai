"use client";

import { useEffect, useState } from "react";
import { useBrands } from "@/hooks/useBrands";
import BrandTable from "@/components/brands/BrandTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { Tables } from "@/lib/supabaseClient";

export default function BrandsPage() {
  const { getBrands, deleteBrand } = useBrands();
  const [brands, setBrands] = useState<Tables["brands"][]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchBrands = async () => {
    setLoading(true);
    const data = await getBrands();
    setBrands(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBrands();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;
    setDeleting(id);
    const success = await deleteBrand(id);
    if (success) {
      toast({ title: "Brand deleted" });
      setBrands((prev) => prev.filter((b) => b.id !== id));
    } else {
      toast({ title: "Failed to delete brand", variant: "destructive" });
    }
    setDeleting(null);
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Brands</h1>
        <Button asChild>
          <Link href="/app/brands/new">Create Brand</Link>
        </Button>
      </div>
      <BrandTable
        brands={brands}
        onDelete={handleDelete}
        loading={loading || !!deleting}
      />
    </div>
  );
}
