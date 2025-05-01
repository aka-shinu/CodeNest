"use client";

import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import Link from "next/link";

type Snippet = {
  id: string;
  title: string;
  description: string;
  language: string;
  tags?: string[];
  author: {
    name: string | null;
    image: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
};

type TabType = 'my-snippets' | 'liked-snippets' | 'settings';

interface DashboardProps {
  mySnippets: Snippet[];
  likedSnippets: Snippet[];
}

export default function DashboardClient({ mySnippets, likedSnippets }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('my-snippets');
  const snippets = activeTab === 'my-snippets' ? mySnippets : likedSnippets;

  const handleDelete = async (snippetId: string) => {
    try {
      const response = await fetch(`/api/snippets/${snippetId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete snippet');
      }

      // Refresh the page to update the list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting snippet:', error);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-orbitron text-cyan-400 mb-6 sm:mb-8">Dashboard</h1>
        
        <div className="flex overflow-x-auto pb-2 mb-4 sm:mb-6 gap-2 sm:gap-4">
          <button
            onClick={() => setActiveTab('my-snippets')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm sm:text-base min-w-[120px] sm:min-w-[140px] ${
              activeTab === 'my-snippets'
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            My Snippets
          </button>
          <button
            onClick={() => setActiveTab('liked-snippets')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm sm:text-base min-w-[120px] sm:min-w-[140px] ${
              activeTab === 'liked-snippets'
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Liked Snippets
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm sm:text-base min-w-[120px] sm:min-w-[140px] ${
              activeTab === 'settings'
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Settings
          </button>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-orbitron text-white mb-4">
            {activeTab === 'my-snippets' && 'My Snippets'}
            {activeTab === 'liked-snippets' && 'Liked Snippets'}
            {activeTab === 'settings' && 'Settings'}
          </h2>
          
          <p className="text-sm sm:text-base text-gray-400 mb-6">
            {activeTab === 'my-snippets' && 'View and manage your code snippets'}
            {activeTab === 'liked-snippets' && 'Browse your liked snippets'}
            {activeTab === 'settings' && 'Manage your account settings'}
          </p>

          {activeTab !== 'settings' && (
            <div className="grid gap-4 sm:gap-6">
              {snippets.map((snippet) => (
                <div key={snippet.id} className="bg-gray-800/50 rounded-lg p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-white truncate mb-1">{snippet.title}</h3>
                      <p className="text-sm text-gray-400 break-words">{snippet.description}</p>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-400">{snippet._count.likes}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-400">{snippet._count.comments}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 text-xs rounded-md bg-gray-700/50 text-gray-300">
                      {snippet.language}
                    </span>
                    {snippet.tags?.map((tag) => (
                      <span key={tag} className="px-2 py-1 text-xs rounded-md bg-gray-700/50 text-gray-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <Link
                      href={`/snippets/${snippet.id}`}
                      className="flex-1 px-4 py-2 text-sm text-center bg-cyan-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-colors"
                    >
                      View Snippet
                    </Link>
                    {activeTab === 'my-snippets' && (
                      <button
                        onClick={() => handleDelete(snippet.id)}
                        className="px-4 py-2 text-sm text-center text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="text-gray-400">
              Settings page coming soon...
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 