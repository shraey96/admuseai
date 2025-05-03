"use client";

import { Tables } from "@/lib/supabaseClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import BrandEmptyState from "./BrandEmptyState";

interface BrandTableProps {
  brands: Tables["brands"][];
  onDelete: (id: string) => void;
  loading: boolean;
}

export default function BrandTable({
  brands,
  onDelete,
  loading,
}: BrandTableProps) {
  if (loading) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Loading brands...
      </div>
    );
  }
  if (!brands.length) {
    return <BrandEmptyState />;
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-muted">
            <th className="px-4 py-2 text-left">Logo</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Industry</th>
            <th className="px-4 py-2 text-left">Website</th>
            <th className="px-4 py-2 text-left">Created</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand) => (
            <tr key={brand.id} className="border-b">
              <td className="px-4 py-2">
                {brand.logo_url ? (
                  <img
                    src={brand.logo_url}
                    alt={brand.name}
                    className="h-8 w-8 rounded object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                    N/A
                  </div>
                )}
              </td>
              <td className="px-4 py-2 font-medium">{brand.name}</td>
              <td className="px-4 py-2">{brand.industry || "-"}</td>
              <td className="px-4 py-2">
                {brand.website_url ? (
                  <a
                    href={brand.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-primary"
                  >
                    {brand.website_url.replace(/^https?:\/\//, "")}
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td className="px-4 py-2">
                {new Date(brand.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 flex gap-2">
                <Link href={`/app/brands/${brand.id}`}>
                  <Button size="icon" variant="outline" aria-label="Edit Brand">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  size="icon"
                  variant="destructive"
                  aria-label="Delete Brand"
                  onClick={() => onDelete(brand.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
