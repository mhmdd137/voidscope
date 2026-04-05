"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWatchlist } from "@/hooks/useWatchlist";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/watchlist", label: "Watchlist" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { count } = useWatchlist();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/10 h-16 flex items-center px-8 justify-between"
        style={{ backgroundColor: "color-mix(in srgb, #0a0a0b 60%, transparent)" }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-black tracking-tighter text-primary uppercase"
        >
          VOIDSCOPE
        </Link>

        {/* Nav Links — desktop */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm tracking-wide transition-colors duration-200 uppercase",
                pathname === link.href
                  ? "text-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {count > 0 && (
            <Link href="/watchlist" className="flex items-center gap-2">
              <span className="text-xs font-bold text-on-primary bg-primary rounded-sm px-2 py-0.5">
                {count}
              </span>
            </Link>
          )}

          {/* User icon — desktop only */}
          <div className="hidden md:flex w-8 h-8 rounded-full border border-outline-variant items-center justify-center cursor-pointer hover:border-primary transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="md:hidden flex flex-col gap-1.5 p-1"
          >
            <span className={cn(
              "block h-px w-6 bg-white transition-all duration-300",
              menuOpen && "translate-y-2 rotate-45"
            )} />
            <span className={cn(
              "block h-px w-6 bg-white transition-all duration-300",
              menuOpen && "opacity-0"
            )} />
            <span className={cn(
              "block h-px w-6 bg-white transition-all duration-300",
              menuOpen && "-translate-y-2 -rotate-45"
            )} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="fixed top-16 left-0 w-full z-40 border-b border-white/10 backdrop-blur-xl md:hidden"
          style={{ backgroundColor: "color-mix(in srgb, #0a0a0b 90%, transparent)" }}
        >
          <div className="flex flex-col px-8 py-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "text-sm tracking-[0.1em] uppercase py-2 border-b border-white/5 transition-colors",
                  pathname === link.href
                    ? "text-primary"
                    : "text-on-surface-variant hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}