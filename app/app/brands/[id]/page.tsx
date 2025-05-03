"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useBrands } from "@/hooks/useBrands";
import BrandForm from "@/components/brands/BrandForm";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Tables } from "@/lib/supabaseClient";

export default function BrandEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === "new";
  const { getBrand, createBrand, updateBrand, deleteBrand } = useBrands();
  const [loading, setLoading] = useState(false);
  const [brand, setBrand] = useState<Tables["brands"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isNew) {
      setLoading(true);
      getBrand(id)
        .then((data) => {
          if (!data) setError("Brand not found");
          setBrand(data);
        })
        .catch(() => setError("Failed to fetch brand"))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line
  }, [id, isNew]);

  const handleSubmit = async (
    values: Omit<
      Tables["brands"],
      "id" | "user_id" | "created_at" | "updated_at"
    >
  ) => {
    setLoading(true);
    setError(null);
    try {
      if (isNew) {
        const created = await createBrand(values);
        if (created) {
          toast({ title: "Brand created" });
          router.push("/app/brands");
        } else {
          setError("Failed to create brand");
        }
      } else if (brand) {
        const updated = await updateBrand(brand.id, values);
        if (updated) {
          toast({ title: "Brand updated" });
          router.push("/app/brands");
        } else {
          setError("Failed to update brand");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!brand) return;
    if (!window.confirm("Are you sure you want to delete this brand?")) return;
    setDeleting(true);
    const success = await deleteBrand(brand.id);
    if (success) {
      toast({ title: "Brand deleted" });
      router.push("/app/brands");
    } else {
      toast({ title: "Failed to delete brand", variant: "destructive" });
    }
    setDeleting(false);
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-muted-foreground">Loading...</div>
    );
  }
  if (error) {
    return <div className="py-12 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-lg mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {isNew ? "Create Brand" : "Edit Brand"}
        </h1>
        {!isNew && brand && (
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        )}
      </div>
      <BrandForm
        initialValues={brand || undefined}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel={isNew ? "Create Brand" : "Save Changes"}
      />
    </div>
  );
}
