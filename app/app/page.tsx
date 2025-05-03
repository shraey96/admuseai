"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCredits } from "@/context/CreditContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ImagePlus,
  TagIcon,
  History,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface DashboardStats {
  totalAds: number;
  totalBrands: number;
  recentActivity: any[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { credits } = useCredits();
  const [stats, setStats] = useState<DashboardStats>({
    totalAds: 0,
    totalBrands: 0,
    recentActivity: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // Get total ads count
        const { count: adsCount, error: adsError } = await supabase
          .from("ads")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        // Get total brands count
        const { count: brandsCount, error: brandsError } = await supabase
          .from("brands")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        // Get recent activity (most recent ads)
        const { data: recentAds, error: recentError } = await supabase
          .from("ads")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (adsError || brandsError || recentError) {
          console.error("Error fetching stats:", {
            adsError,
            brandsError,
            recentError,
          });
        }

        setStats({
          totalAds: adsCount || 0,
          totalBrands: brandsCount || 0,
          recentActivity: recentAds || [],
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="flex gap-2">
          <Button asChild>
            <Link href="/app/ads/new">
              <ImagePlus className="h-4 w-4 mr-2" />
              Create Ad
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Ads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats.totalAds}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Brands
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats.totalBrands}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{credits}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your most recent ads</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground">
                Loading recent activity...
              </div>
            ) : stats.recentActivity.length === 0 ? (
              <div className="py-8 text-center">
                <History className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <p className="mt-2 text-muted-foreground">No ads created yet</p>
                <Button className="mt-4" asChild>
                  <Link href="/app/ads/new">Create Your First Ad</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentActivity.map((ad) => (
                  <div
                    key={ad.id}
                    className="flex items-center gap-4 border p-3 rounded-lg"
                  >
                    {ad.result_urls && ad.result_urls[0] ? (
                      <img
                        src={ad.result_urls[0]}
                        alt={ad.prompt}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                        <ImagePlus className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">
                        {ad.prompt.length > 60
                          ? `${ad.prompt.substring(0, 60)}...`
                          : ad.prompt}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(ad.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${
                          ad.status === "completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : ad.status === "failed"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {ad.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Get started with these common tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/app/brands/new" className="block">
              <Button
                variant="outline"
                className="w-full justify-start"
                size="lg"
              >
                <TagIcon className="mr-2 h-4 w-4" />
                Create New Brand
              </Button>
            </Link>

            <Link href="/app/ads/new" className="block">
              <Button
                variant="outline"
                className="w-full justify-start"
                size="lg"
              >
                <ImagePlus className="mr-2 h-4 w-4" />
                Generate New Ad
              </Button>
            </Link>

            <Button
              variant="outline"
              className="w-full justify-start"
              size="lg"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              View Analytics
            </Button>

            {credits < 2 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mr-2" />
                  <div className="text-sm text-amber-800 dark:text-amber-200">
                    You're running low on credits. Top up to continue creating
                    ads.
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
