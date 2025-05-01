"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    image: string | null;
  };
  createdAt: string;
}

interface Snippet {
  id: string;
  title: string;
  description: string;
  code: string;
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
  comments: Comment[];
  isLiked?: boolean;
}

export default function SnippetPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const { id } = params;

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const response = await fetch(`/api/snippets/${id}`);
        if (!response.ok) {
          throw new Error('Snippet not found');
        }
        const data = await response.json();
        setSnippet(data);
      } catch (error) {
        console.error('Failed to fetch snippet:', error);
        router.push('/snippets');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSnippet();
  }, [id, router]);

  const handleLike = async () => {
    if (!session) {
      toast.error('Please sign in to like snippets');
      return;
    }

    if (isLiking) {
      return;
    }

    setIsLiking(true);

    const previousState = snippet;

    setSnippet(prev => {
      if (!prev) return null;
      const newLikeCount = Math.max(0, prev.isLiked ? prev._count.likes - 1 : prev._count.likes + 1);
      return {
        ...prev,
        _count: {
          ...prev._count,
          likes: newLikeCount,
        },
        isLiked: !prev.isLiked,
      };
    });

    try {
      const response = await fetch(`/api/snippets/${id}/like`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to like snippet');
      }

      const { liked, likeCount } = await response.json();
      
      setSnippet(prev => {
        if (!prev) return null;
        return {
          ...prev,
          _count: {
            ...prev._count,
            likes: Math.max(0, likeCount),
          },
          isLiked: liked,
        };
      });
    } catch (error) {
      if (previousState) {
        setSnippet(previousState);
      }
      toast.error('Failed to like snippet');
    } finally {
      setTimeout(() => {
        setIsLiking(false);
      }, 500);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error('Please sign in to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/snippets/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
      },
        credentials: 'include',
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const { comment, commentCount } = await response.json();
      setSnippet(prev => {
        if (!prev) return null;
        return {
          ...prev,
          comments: [comment, ...(prev.comments || [])],
        _count: {
            ...prev._count,
            comments: commentCount,
          },
        };
    });
      setNewComment('');
      toast.success('Comment added successfully');
  } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!session) {
      toast.error('Please sign in to delete comments');
      return;
  }

    setSnippet(prev => {
      if (!prev) return null;
      const updatedComments = prev.comments.filter(c => c.id !== commentId);
      return {
        ...prev,
        comments: updatedComments,
        _count: {
          ...prev._count,
          comments: prev._count.comments - 1,
        },
      };
    });

    try {
      const response = await fetch(`/api/snippets/${id}/comments?commentId=${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      const { commentCount } = await response.json();
      
      setSnippet(prev => {
        if (!prev) return null;
  return {
          ...prev,
          _count: {
            ...prev._count,
            comments: commentCount,
          },
        };
      });
      toast.success('Comment deleted successfully');
    } catch (error) {
      const response = await fetch(`/api/snippets/${id}`);
      if (response.ok) {
        const data = await response.json();
        setSnippet(data);
      }
      toast.error('Failed to delete comment');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-800 rounded w-full mb-8"></div>
          <div className="h-64 bg-gray-800 rounded mb-8"></div>
        </div>
      </div>
    );
  }

  if (!snippet) {
    return null;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/snippets" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to snippets
        </Link>

        <div className="bg-gray-900 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-2">{snippet.title}</h1>
          <p className="text-gray-400 mb-6">{snippet.description}</p>

          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <SyntaxHighlighter
              language={snippet.language}
              style={atomDark}
              customStyle={{
                margin: 0,
                borderRadius: '0.5rem',
                background: 'transparent',
              }}
            >
              {snippet.code}
            </SyntaxHighlighter>
          </div>

          <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-800">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center space-x-1 transition-colors ${
                  snippet.isLiked
                    ? 'text-pink-500 hover:text-pink-600'
                    : 'text-gray-400 hover:text-pink-500'
                } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Heart className={`h-5 w-5 ${isLiking ? 'animate-pulse' : ''}`} />
                <span>{snippet._count.likes}</span>
              </button>
              <div className="flex items-center space-x-1 text-gray-400">
                <MessageCircle className="h-5 w-5" />
                <span>{snippet._count.comments}</span>
              </div>
            </div>
            <div className="flex items-center text-gray-400">
              <span>{snippet.author.name}</span>
              <span className="mx-2">•</span>
              <span>{formatDistanceToNow(new Date(snippet.createdAt), { addSuffix: true })}</span>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-orbitron text-white mb-4">Comments</h2>
            {session && (
              <form onSubmit={handleComment} className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500/30 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                  rows={3}
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/30 disabled:opacity-50"
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
            )}
            <div className="space-y-4">
              {snippet.comments?.map((comment) => (
                <div key={comment.id} className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{comment.author.name}</span>
                      <span className="text-gray-400 text-sm">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    {session?.user?.email === comment.author.email && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <p className="text-gray-300">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 