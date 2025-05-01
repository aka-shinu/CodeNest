"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Search } from "lucide-react";
import { SnippetCard, SnippetCardSkeleton } from "@/components/SnippetCard";
import { CreateSnippetDialog } from "@/components/CreateSnippetDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Snippet as PrismaSnippet } from "@prisma/client";

const LANGUAGES = [
  "all",
  "javascript",
  "typescript",
  "python",
  "java",
  "c++",
  "ruby",
  "go",
  "rust",
  "php",
  "html",
  "css",
  "sql",
  "shell",
  "other",
];

interface Snippet {
  id: string;
  title: string;
  description: string;
  language: string;
  tags: string[];
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

export default function SnippetsPage() {
  const { data: session } = useSession();
  const [snippets, setSnippets] = useState<any[]>([]);
  const [filteredSnippets, setFilteredSnippets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await fetch("/api/snippets");
        const data = await response.json();
        setSnippets(data);
        setFilteredSnippets(data);
      } catch (error) {
        console.error("Failed to fetch snippets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSnippets();
  }, []);

  useEffect(() => {
    const filtered = snippets.filter((snippet) => {
      const matchesSearch =
        snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLanguage =
        selectedLanguage === "all" || snippet.language === selectedLanguage;

      return matchesSearch && matchesLanguage;
    });

    setFilteredSnippets(filtered);
  }, [searchTerm, selectedLanguage, snippets]);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-orbitron text-white">Code Snippets</h1>
          <CreateSnippetDialog />
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search snippets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white focus:border-cyan-500/30 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
            />
          </div>

          {/* Language filter */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-cyan-500/30 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Snippets Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            // Show skeleton loading cards
            Array.from({ length: 6 }).map((_, i) => (
              <SnippetCardSkeleton key={i} />
            ))
          ) : filteredSnippets.length > 0 ? (
            filteredSnippets.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                id={snippet.id}
                title={snippet.title}
                description={snippet.description || ""}
                language={snippet.language}
                authorName={snippet.author?.name || "Anonymous"}
                createdAt={snippet.createdAt}
                likesCount={snippet._count?.likes || 0}
                commentsCount={snippet._count?.comments || 0}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-12">
              No snippets found. Try adjusting your search or filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
