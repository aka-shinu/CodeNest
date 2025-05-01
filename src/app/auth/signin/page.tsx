"use client";

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Github, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
        <CardDescription className="text-center">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
            {error === "OAuthSignin" && "Error signing in with OAuth provider"}
            {error === "OAuthCallback" && "Error during OAuth callback"}
            {error === "OAuthCreateAccount" && "Error creating account"}
            {error === "EmailCreateAccount" && "Error creating account with email"}
            {error === "Callback" && "Error during callback"}
            {error === "OAuthAccountNotLinked" && "Email already in use with different provider"}
            {error === "EmailSignin" && "Error signing in with email"}
            {error === "CredentialsSignin" && "Invalid credentials"}
            {error === "SessionRequired" && "Please sign in to access this page"}
            {error === "Default" && "Unable to sign in"}
          </div>
        )}
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signIn("github", { callbackUrl })}
          >
            <Github className="mr-2 h-4 w-4" />
            Continue with GitHub
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Suspense fallback={
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </CardHeader>
        </Card>
      }>
        <SignInForm />
      </Suspense>
    </div>
  );
} 