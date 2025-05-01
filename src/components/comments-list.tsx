"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Comment = {
  id: string;
  content: string;
  author: {
    name: string | null;
    image: string | null;
  };
  createdAt: string;
};

const COMMENTS_PER_PAGE = 5;

export function CommentsList({ snippetId }: { snippetId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchComments = async (pageNum: number) => {
    try {
      const response = await fetch(`/api/snippets/${snippetId}/comments?page=${pageNum}&limit=${COMMENTS_PER_PAGE}`);
      const data = await response.json();
      if (pageNum === 1) {
        setComments(data);
      } else {
        setComments(prev => [...prev, ...data]);
      }
      setHasMore(data.length === COMMENTS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchComments(1);
  }, [snippetId]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setPage(prev => prev + 1);
    fetchComments(page + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (comments.length === 0) {
    return <p className="text-muted-foreground">No comments yet.</p>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author.image || ""} alt={comment.author.name || ""} />
                <AvatarFallback>{comment.author.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{comment.author.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load more comments'
            )}
          </Button>
        </div>
      )}
    </div>
  );
} 