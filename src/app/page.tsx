import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Code2, Share2, Users, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative">
      <div className="text-center space-y-8 relative z-10">
        <h1 className="font-orbitron text-6xl md:text-7xl lg:text-8xl text-white tracking-wider leading-tight">
                  Welcome to CodeNest
                </h1>
        
        <p className="font-rajdhani text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto tracking-wide leading-relaxed font-light">
                  Share your code snippets, discover amazing solutions, and connect with developers worldwide.
                </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
          <Link 
            href="/snippets" 
            className="bg-transparent border-2 border-white/20 hover:border-white/40 text-white font-orbitron px-8 py-3 rounded-lg transition-all duration-300"
          >
            BROWSE SNIPPETS
                </Link>
          <Link 
            href="/auth/signin" 
            className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-orbitron px-8 py-3 rounded-lg transition-all duration-300"
          >
            SIGN IN
              </Link>
            </div>
          </div>
      </main>
  );
} 