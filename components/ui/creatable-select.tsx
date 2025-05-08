"use client";

import * as React from "react";
import CreatableSelect from "react-select/creatable";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Option {
  label: string;
  value: string;
  description?: string;
  isDisabled?: boolean;
}

interface CreatableSelectProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  isDisabled?: boolean;
}

export function CreatableSelectComponent({
  options,
  value,
  onChange,
  placeholder = "Select or type...",
  className,
  isDisabled = false,
}: CreatableSelectProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const selectedOption =
    options.find((opt) => opt.value === value) ||
    (value ? { label: value, value } : null);

  // hack to allow scrolling in the menu since portal causes issues when document.body
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (!isMenuOpen) return;

      const menuList = document.querySelector(".react-select__menu-list");
      if (!menuList) return;

      // Check if the event target is the menuList or a child of menuList
      if (menuList.contains(e.target as Node)) {
        menuList.scrollTop += e.deltaY;
        e.preventDefault();
      }
    };

    // Add wheel event listener to handle scroll
    window.addEventListener("wheel", handleScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [isMenuOpen]);

  return (
    <CreatableSelect
      isClearable
      isDisabled={isDisabled}
      options={options}
      value={selectedOption}
      onChange={(newValue) => onChange(newValue?.value || "")}
      onCreateOption={(inputValue) => {
        const newOption = { label: inputValue, value: inputValue };
        onChange(inputValue);
      }}
      onMenuOpen={() => setIsMenuOpen(true)}
      onMenuClose={() => setIsMenuOpen(false)}
      placeholder={placeholder}
      className={cn("react-select-container", className)}
      classNamePrefix="react-select"
      formatOptionLabel={(option) => (
        <div>
          <div
            className={
              option.value === "__instruction__"
                ? "italic text-gray-400 flex items-center"
                : ""
            }
          >
            {option.value === "__instruction__" && (
              <span className="mr-1">💡</span>
            )}
            {option.label}
          </div>
          {option.description && (
            <div className="text-xs text-gray-500">{option.description}</div>
          )}
        </div>
      )}
      menuPortalTarget={typeof document !== "undefined" ? document.body : null}
      styles={{
        menuPortal: (base) => ({
          ...base,
          zIndex: 9999,
          pointerEvents: "auto",
        }),
        control: (base) => ({
          ...base,
          minHeight: "40px",
          borderColor: "hsl(var(--input))",
          backgroundColor: "hsl(var(--background))",
          "&:hover": {
            borderColor: "hsl(var(--ring))",
          },
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: "hsl(var(--popover))",
          color: "hsl(var(--popover-foreground))",
          animation: "fadeIn 0.1s ease-in-out",
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          marginTop: "8px",
          overflow: "hidden",
          borderRadius: "0.5rem",
        }),
        menuList: (base) => ({
          ...base,
          padding: "4px",
          maxHeight: "200px",
          overflowY: "auto",
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected
            ? "hsl(var(--accent))"
            : state.isFocused
            ? "hsl(var(--accent))"
            : "transparent",
          color: state.isSelected
            ? "hsl(var(--accent-foreground))"
            : "hsl(var(--popover-foreground))",
          "&:hover": {
            backgroundColor: "hsl(var(--accent))",
            color: "hsl(var(--accent-foreground))",
          },
          borderRadius: "0.375rem",
          cursor: "pointer",
          padding: "8px 12px",
        }),
        input: (base) => ({
          ...base,
          color: "hsl(var(--foreground))",
        }),
        singleValue: (base) => ({
          ...base,
          color: "hsl(var(--foreground))",
        }),
      }}
    />
  );
}
