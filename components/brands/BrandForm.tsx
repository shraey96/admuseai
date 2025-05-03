"use client";

import { useState } from "react";
import { Tables } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface BrandFormProps {
  initialValues?: Partial<Tables["brands"]>;
  onSubmit: (
    values: Omit<
      Tables["brands"],
      "id" | "user_id" | "created_at" | "updated_at"
    >
  ) => Promise<void>;
  loading: boolean;
  submitLabel?: string;
}

export default function BrandForm({
  initialValues = {},
  onSubmit,
  loading,
  submitLabel = "Save Brand",
}: BrandFormProps) {
  const [form, setForm] = useState({
    name: initialValues.name || "",
    description: initialValues.description || "",
    logo_url: initialValues.logo_url || "",
    color_palette: (initialValues.color_palette || []).join(", "),
    industry: initialValues.industry || "",
    website_url: initialValues.website_url || "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) {
      setError("Brand name is required");
      return;
    }
    const values = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      logo_url: form.logo_url.trim() || null,
      color_palette: form.color_palette
        ? form.color_palette
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : null,
      industry: form.industry.trim() || null,
      website_url: form.website_url.trim() || null,
    };
    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
      <div className="space-y-2">
        <label htmlFor="name" className="font-medium">
          Brand Name *
        </label>
        <Input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          maxLength={64}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="description" className="font-medium">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="logo_url" className="font-medium">
          Logo URL
        </label>
        <Input
          id="logo_url"
          name="logo_url"
          value={form.logo_url}
          onChange={handleChange}
          placeholder="https://..."
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="color_palette" className="font-medium">
          Color Palette (comma separated)
        </label>
        <Input
          id="color_palette"
          name="color_palette"
          value={form.color_palette}
          onChange={handleChange}
          placeholder="#FF5733, #33FF57"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="industry" className="font-medium">
          Industry
        </label>
        <Input
          id="industry"
          name="industry"
          value={form.industry}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="website_url" className="font-medium">
          Website URL
        </label>
        <Input
          id="website_url"
          name="website_url"
          value={form.website_url}
          onChange={handleChange}
          placeholder="https://example.com"
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
