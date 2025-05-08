"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { trackAnalytics, ANALYTICS_EVENTS } from "@/lib/analytics";
const NAV_ITEMS = [
  { href: "/#examples", label: "Examples" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "/prompt-writing-guidelines", label: "Creative Guidelines" },
  { href: "https://app.admuseai.com/login", label: "Login", target: "_blank" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const trackLinkClicked = (link: string) => {
    trackAnalytics(ANALYTICS_EVENTS.HEADER_LINK_CLICKED, {
      link,
    });
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100"
      style={
        {
          boxShadow:
            "var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)",
          "--tw-shadow":
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          "--tw-shadow-colored":
            "0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color)",
        } as React.CSSProperties
      }
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full flex items-center justify-center mr-2">
              <img
                src="/images/admuse.png"
                alt="AdMuseAI Logo"
                className="h-8 w-8"
              />
            </div>
            <span className="font-bold text-xl">AdMuseAI</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {NAV_ITEMS.map((item) =>
            item.label === "Login" ? (
              <Link
                key={item.href}
                href={item.href}
                target={item.target}
                className="text-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md transition-colors"
                onClick={() => {
                  trackLinkClicked(item.href);
                }}
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                target={item.target}
                className="text-lg font-medium text-zinc-500 hover:text-indigo-600 transition-colors"
                onClick={() => {
                  trackLinkClicked(item.href);
                }}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-100">
          <div className="container mx-auto py-4 px-4 space-y-4">
            {NAV_ITEMS.map((item) =>
              item.label === "Login" ? (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.target}
                  className="block text-center text-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md transition-colors"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    trackLinkClicked(item.href);
                  }}
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.target}
                  className="block text-lg font-medium text-zinc-500 hover:text-indigo-600 transition-colors"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    trackLinkClicked(item.href);
                  }}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
