import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Code2 } from 'lucide-react';
import Link from 'next/link';

interface SnippetCardProps {
  id: string;
  title: string;
  description: string;
  language: string;
  authorName: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
}

export function SnippetCardSkeleton() {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 animate-pulse">
      <div className="h-6 bg-gray-800 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-800 rounded w-2/3"></div>
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center space-x-4">
          <div className="h-4 bg-gray-800 rounded w-8"></div>
          <div className="h-4 bg-gray-800 rounded w-8"></div>
        </div>
        <div className="h-4 bg-gray-800 rounded w-24"></div>
      </div>
    </div>
  );
}

export function SnippetCard({
  id,
  title,
  description,
  language,
  authorName,
  createdAt,
  likesCount,
  commentsCount,
}: SnippetCardProps) {
  return (
    <Link 
      href={`/snippets/${id}`}
      className="block bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-cyan-500/30 transition-all duration-300 group"
    >
      <h3 className="text-xl font-orbitron text-white mb-2 group-hover:text-cyan-400 transition-colors">
        {title}
      </h3>
      <p className="text-gray-400 font-rajdhani line-clamp-2 mb-4">
        {description}
      </p>
      
      <div className="flex items-center text-sm text-gray-500 space-x-4">
        <span className="px-2 py-1 bg-gray-800/50 rounded text-cyan-400 text-xs">
          {language}
        </span>
        <div className="flex items-center space-x-1">
          <Heart className="h-4 w-4" />
          <span>{likesCount}</span>
        </div>
        <div className="flex items-center space-x-1">
          <MessageCircle className="h-4 w-4" />
          <span>{commentsCount}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
        <span className="text-sm text-gray-500">{authorName}</span>
        <span className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </span>
      </div>
    </Link>
  );
} 