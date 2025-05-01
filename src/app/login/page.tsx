"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("github", { callbackUrl: "/snippets" });
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6 bg-[#0a0a0f] p-6 rounded-lg border border-[#1a1a2e]">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-medium text-white">Welcome back</h1>
          <p className="text-sm text-gray-400">Sign in to your account</p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleGithubLogin}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-100 text-black flex items-center justify-center gap-2"
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0a0a0f] px-2 text-gray-400">
                More options coming soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 