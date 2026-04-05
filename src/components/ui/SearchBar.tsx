"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useTransition } from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  initialQuery?: string;
}

export default function SearchBar({ initialQuery = "" }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }

    startTransition(() => {
      router.replace(`/search?${params.toString()}`);
    });
  }

  return (
    <div className="relative w-full">
      {/* Search Icon */}
      <svg
        className="absolute left-5 top-1/2 -translate-y-1/2 text-[#484849]"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>

      <input
        ref={inputRef}
        type="search"
        role="searchbox"
        aria-label="Search movies and TV shows"
        placeholder="Pulse search the nebula..."
        defaultValue={initialQuery}
        onChange={handleChange}
        className={cn(
          "w-full rounded bg-[#131314] py-4 pl-14 pr-6",
          "text-base text-white placeholder:text-[#484849]",
          "border border-transparent",
          "transition-all duration-200",
          "focus:outline-none focus:border-b-2 focus:border-[#8ff5ff]",
          "focus:[box-shadow:0_0_8px_rgba(143,245,255,0.15)]",
          isPending && "opacity-70",
        )}
      />

      {isPending && (
        <span
          aria-live="polite"
          className="absolute right-5 top-1/2 -translate-y-1/2 text-xs uppercase tracking-widest text-[#8ff5ff]"
        >
          Scanning...
        </span>
      )}
    </div>
  );
}
