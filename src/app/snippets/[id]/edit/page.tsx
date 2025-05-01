"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function SkeletonLoader() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-gray-700/50 rounded w-1/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-700/50 rounded w-1/6"></div>
        <div className="h-10 bg-gray-700/50 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-700/50 rounded w-1/6"></div>
        <div className="h-32 bg-gray-700/50 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-700/50 rounded w-1/6"></div>
        <div className="h-64 bg-gray-700/50 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-700/50 rounded w-1/6"></div>
        <div className="h-10 bg-gray-700/50 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-700/50 rounded w-1/6"></div>
        <div className="h-10 bg-gray-700/50 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-700/50 rounded w-1/6"></div>
        <div className="h-10 bg-gray-700/50 rounded"></div>
      </div>
      <div className="flex gap-4 pt-4">
        <div className="h-10 bg-gray-700/50 rounded w-24"></div>
        <div className="h-10 bg-gray-700/50 rounded w-24"></div>
      </div>
    </div>
  );
}

export default function EditSnippetPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    code: "",
    language: "",
    tags: "",
    visibility: "public"
  });

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const response = await fetch(`/api/snippets/${params.id}`);
        const data = await response.json();
        setFormData({
          title: data.title,
          description: data.description || "",
          code: data.code,
          language: data.language,
          tags: data.tags.join(", "),
          visibility: data.visibility
        });
      } catch (error) {
        console.error("Error fetching snippet:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSnippet();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`/api/snippets/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        tags: formData.tags.split(",").map(tag => tag.trim())
      })
    });
    if (response.ok) {
      router.push("/dashboard");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 bg-gray-700/50 rounded w-1/4 mb-6 animate-pulse"></div>
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-white">Edit Snippet</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-white">Title</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block mb-2 text-white">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block mb-2 text-white">Code</label>
          <Textarea
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="bg-gray-800 border-gray-700 text-white font-mono h-64"
          />
        </div>
        <div>
          <label className="block mb-2 text-white">Language</label>
          <Input
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block mb-2 text-white">Tags</label>
          <Input
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="Enter tags separated by commas"
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block mb-2 text-white">Visibility</label>
          <select
            value={formData.visibility}
            onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
            className="w-full p-2 border rounded bg-gray-800 border-gray-700 text-white"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div className="flex gap-4">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            Save Changes
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push("/dashboard")}
            className="border-gray-700 text-white hover:bg-gray-800"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
} 