"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Snippet } from "@prisma/client";
import { Loader2 } from "lucide-react";

function SnippetSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="mt-4 h-6 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-2/3" />
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-4 w-16" />
      </CardFooter>
    </Card>
  );
}

interface SnippetsListProps {
  snippets: Snippet[];
}

export default function SnippetsList() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await fetch("/api/snippets");
        const data = await response.json();
        setSnippets(data);
      } catch (error) {
        console.error("Error fetching snippets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (snippets.length === 0) {
    return <p className="text-muted-foreground">No snippets found.</p>;
  }

  return (
    <div className="space-y-4">
      {snippets.map((snippet) => (
        <SnippetCard key={snippet.id} snippet={snippet} />
      ))}
    </div>
  );
}

function SnippetCard({ snippet }: { snippet: Snippet }) {
  return (
    <Link key={snippet.id} href={`/snippets/${snippet.id}`}>
      <Card className="group relative overflow-hidden border-neon-blue/20 bg-space-darker/50 backdrop-blur-sm transition-all duration-300 hover:border-neon-blue/50 hover:shadow-[0_0_15px_rgba(0,243,255,0.3)]">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 via-neon-purple/5 to-neon-pink/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-0 animate-scan-line bg-gradient-to-b from-transparent via-neon-blue/5 to-transparent opacity-0 group-hover:opacity-100" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,243,255,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-space-light group-hover:text-neon-blue transition-colors">
              {snippet.title}
            </CardTitle>
            <Badge variant="outline" className="border-neon-blue/30 text-neon-blue animate-pulse-glow">
              {snippet.language}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-space-light/70 line-clamp-2">
            {snippet.description}
          </p>
          <div className="mt-4 flex items-center justify-between text-xs text-space-light/50">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-neon-blue animate-pulse-glow" />
              Created {formatDistanceToNow(new Date(snippet.createdAt), { addSuffix: true })}
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-neon-purple animate-pulse-glow" />
              {snippet.views} views
            </span>
          </div>
        </CardContent>
        <div className="absolute inset-0 border border-neon-blue/0 group-hover:border-neon-blue/20 transition-colors duration-300" />
        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/0 via-neon-blue/5 to-neon-blue/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </Card>
    </Link>
  );
} 