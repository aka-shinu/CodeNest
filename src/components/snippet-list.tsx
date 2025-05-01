"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Pencil, Trash } from "lucide-react";

interface Snippet {
  id: string;
  title: string;
  description: string;
  language: string;
  author: {
    name: string;
    image: string | null;
  };
  createdAt: string;
  _count: {
    likes: number;
    comments: number;
  };
}

interface SnippetListProps {
  snippets: Snippet[];
  showActions?: boolean;
}

export function SnippetList({ snippets, showActions = false }: SnippetListProps) {
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this snippet?")) {
      return;
    }

    try {
      const response = await fetch(`/api/snippets/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete snippet");
      }

      // Refresh the page to show updated list
      window.location.reload();
    } catch (error) {
      console.error("Error deleting snippet:", error);
      alert("Failed to delete snippet. Please try again.");
    }
  };

  if (snippets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#8b95a8] text-lg">No snippets found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {snippets.map((snippet) => (
        <Card 
          key={snippet.id} 
          className="group bg-[#1a2332] rounded-lg overflow-hidden"
        >
          <CardHeader className="p-6">
            <CardTitle className="mb-2">
              <Link 
                href={`/snippets/${snippet.id}`} 
                className="text-[#00ffff] hover:text-[#00a3ff] transition-colors line-clamp-1 text-lg"
              >
                {snippet.title}
              </Link>
            </CardTitle>
            <p className="text-sm text-[#8b95a8] line-clamp-2">{snippet.description}</p>
          </CardHeader>
          <CardContent className="px-6 pb-4">
            <div className="flex items-center gap-3 text-sm">
              <span className="px-3 py-1 bg-[#131926] rounded text-[#00ffff] font-medium">
                {snippet.language}
              </span>
              <span className="text-[#8b95a8]">•</span>
              <span className="text-[#8b95a8]">
                {formatDistanceToNow(new Date(snippet.createdAt), { addSuffix: true })}
              </span>
            </div>
          </CardContent>
          <CardFooter className="px-6 py-4 border-t border-[#131926] flex justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[#8b95a8]">
                <Heart className="w-4 h-4" />
                <span>{snippet._count.likes}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#8b95a8]">
                <MessageCircle className="w-4 h-4" />
                <span>{snippet._count.comments}</span>
              </div>
            </div>
            {showActions && (
              <div className="flex items-center gap-2">
                <Link href={`/snippets/${snippet.id}/edit`}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-[#8b95a8] hover:text-[#00ffff] hover:bg-[#131926]"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#8b95a8] hover:text-red-400 hover:bg-[#131926]"
                  onClick={() => handleDelete(snippet.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 