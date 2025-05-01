"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { CreateSnippetDialog } from "@/components/create-snippet-dialog";

type Snippet = {
  id: string;
  title: string;
  description: string | null;
  language: string;
  tags: string[];
  visibility: string;
  createdAt: string;
  _count: {
    likes: number;
    comments: number;
  };
};

export function DashboardContent({ snippets: initialSnippets }: { snippets: Snippet[] }) {
  const { toast } = useToast();
  const [snippets, setSnippets] = useState(initialSnippets);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this snippet?")) {
      return;
    }

    try {
      const response = await fetch(`/api/snippets/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSnippets(snippets.filter((snippet) => snippet.id !== id));
        toast({
          title: "Snippet deleted",
          description: "The snippet has been deleted successfully.",
        });
      } else {
        throw new Error("Failed to delete snippet");
      }
    } catch (error) {
      toast({
        title: "Failed to delete snippet",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Snippet
        </Button>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {snippets.map((snippet) => (
          <Card key={snippet.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="line-clamp-1">{snippet.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                  >
                    <Link href={`/snippets/${snippet.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(snippet.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{snippet.language}</Badge>
                <Badge variant="outline">{snippet.visibility}</Badge>
                {snippet.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {snippet.description}
              </p>
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span>{snippet._count.likes} likes</span>
                <span>{snippet._count.comments} comments</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateSnippetDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSnippetCreated={(snippet) => {
          setSnippets([snippet, ...snippets]);
          setIsCreateDialogOpen(false);
        }}
      />
    </div>
  );
} 