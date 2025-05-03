"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Tag, ImagePlus, Menu, X, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
}

function SidebarItem({ icon, label, href, isActive }: SidebarItemProps) {
  return (
    <Link href={href} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 font-normal",
          isActive && "bg-accent"
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path: string) => {
    if (path === "/app" && pathname === "/app") {
      return true;
    }
    if (path !== "/app" && pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <div
      className={cn(
        "relative h-full border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <h1
          className={cn(
            "font-bold text-lg transition-opacity",
            isCollapsed ? "opacity-0 w-0" : "opacity-100"
          )}
        >
          AdMuseAI
        </h1>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>

      <div className="space-y-1 py-4 px-2">
        <SidebarItem
          icon={<Home size={20} />}
          label="Dashboard"
          href="/app"
          isActive={isActive("/app")}
        />
        <SidebarItem
          icon={<Tag size={20} />}
          label="Brands"
          href="/app/brands"
          isActive={isActive("/app/brands")}
        />
        <SidebarItem
          icon={<ImagePlus size={20} />}
          label="Ads"
          href="/app/ads"
          isActive={isActive("/app/ads")}
        />
        <SidebarItem
          icon={<User size={20} />}
          label="Profile"
          href="/app/profile"
          isActive={isActive("/app/profile")}
        />
      </div>

      <div className="absolute bottom-4 w-full px-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground"
          onClick={() => signOut()}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </div>
  );
}
