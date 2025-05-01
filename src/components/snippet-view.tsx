"use client";

import { useState, Suspense, lazy, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare, Share2, Copy, Loader2, ThumbsUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Snippet } from "@prisma/client";

// Lazy load components that are not immediately needed
const CommentsList = lazy(() => import("@/components/comments-list"));
const CommentForm = lazy(() => import("@/components/comment-form"));

type Snippet = {
  id: string;
  title: string;
  description: string | null;
  code: string;
  language: string;
  tags: string[];
  author: {
    name: string | null;
    image: string | null;
  };
  createdAt: string;
  _count: {
    likes: number;
    comments: number;
  };
  views: number;
};

function LoadingSnippet() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-1 h-3 w-16" />
            </div>
          </div>
        </div>
        <Skeleton className="mt-4 h-7 w-3/4" />
        <div className="mt-2 flex gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-4 h-4 w-full" />
        <Skeleton className="h-[200px] w-full" />
      </CardContent>
    </Card>
  );
}

export function SnippetView({ snippet }: { snippet: Snippet }) {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(snippet._count.likes);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Check if the user has liked the snippet
  useEffect(() => {
    const checkLike = async () => {
      if (status === 'loading' || !session?.user?.id) return;
      try {
        const response = await fetch(`/api/snippets/${snippet.id}/like`);
        if (response.ok) {
          const { liked } = await response.json();
          setIsLiked(liked);
        }
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };
    checkLike();
  }, [session?.user?.id, snippet.id, status]);

  const handleLike = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like snippets.",
        variant: "destructive",
      });
      return;
    }

    if (isLiking) return;

    setIsLiking(true);
    const previousState = { isLiked, likeCount };

    try {
      const response = await fetch(`/api/snippets/${snippet.id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to like snippet");
      }

      const { liked, count } = await response.json();
      setIsLiked(liked);
      setLikeCount(count);
    } catch (error) {
      setIsLiked(previousState.isLiked);
      setLikeCount(previousState.likeCount);
      toast({
        title: "Error",
        description: "Failed to like snippet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      toast({
        title: "Link copied",
        description: "Share link copied to clipboard!",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setIsCopied(true);
      toast({
        title: "Code copied",
        description: "Code copied to clipboard!",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy code. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-cyber-blue/20 bg-cyber-darker/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-cyber-light">
              {snippet.title}
            </CardTitle>
            <Badge variant="outline" className="border-cyber-blue/30 text-cyber-blue">
              {snippet.language}
            </Badge>
          </div>
          <p className="mt-2 text-cyber-light/70">{snippet.description}</p>
          <div className="mt-4 flex items-center gap-4 text-sm text-cyber-light/50">
            <span>Created {formatDistanceToNow(new Date(snippet.createdAt), { addSuffix: true })}</span>
            <span>{snippet.views} views</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute right-4 top-4 flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyCode}
                className={cn(
                  "border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/10 hover:text-cyber-blue animate-glow",
                  isCopied && "text-green-500"
                )}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/10 hover:text-cyber-blue animate-glow"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            <pre className="relative rounded-lg border border-cyber-blue/20 bg-cyber-darker p-4 text-cyber-light">
              <code>{snippet.code}</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      {showComments && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Comments</h2>
          {session && (
            <Suspense fallback={<Skeleton className="h-24 w-full" />}>
              <CommentForm snippetId={snippet.id} />
            </Suspense>
          )}
          <Suspense fallback={<Skeleton className="h-48 w-full" />}>
            <CommentsList snippetId={snippet.id} />
          </Suspense>
        </div>
      )}
    </div>
  );
} 