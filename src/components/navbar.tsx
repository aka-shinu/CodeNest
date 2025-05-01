"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="bg-[#0a0a0f] border-b border-[#1a1a2e]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="text-lg font-medium text-white">
          CodeNest
        </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={cn(
                "text-sm text-gray-400 hover:text-white transition-colors",
                pathname === "/" && "text-white"
              )}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                "text-sm text-gray-400 hover:text-white transition-colors",
                pathname === "/dashboard" && "text-white"
              )}
            >
              Dashboard
            </Link>
            {session?.user ? (
        <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">
                  {session.user.name || session.user.email}
                </span>
          <Button
                  onClick={() => signOut()}
                  variant="outline"
                  className="text-sm bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Sign Out
                </Button>
              </div>
          ) : (
            <Link href="/auth/signin">
                <Button 
                  variant="outline" 
                  className="text-sm bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Sign In
                </Button>
            </Link>
          )}
          </div>
        </div>
      </div>
    </nav>
  );
} 