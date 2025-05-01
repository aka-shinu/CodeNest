import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Code2, Hash, Globe2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', icon: '⚡' },
  { value: 'typescript', label: 'TypeScript', icon: '🔷' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'java', label: 'Java', icon: '☕' },
  { value: 'c++', label: 'C++', icon: '⚙️' },
  { value: 'ruby', label: 'Ruby', icon: '💎' },
  { value: 'go', label: 'Go', icon: '🔵' },
  { value: 'rust', label: 'Rust', icon: '🦀' },
  { value: 'php', label: 'PHP', icon: '🐘' },
  { value: 'html', label: 'HTML', icon: '🌐' },
  { value: 'css', label: 'CSS', icon: '🎨' },
  { value: 'sql', label: 'SQL', icon: '🗄️' },
  { value: 'shell', label: 'Shell', icon: '🐚' },
  { value: 'other', label: 'Other', icon: '📝' }
];

export function CreateSnippetDialog() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    language: 'javascript',
    tags: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error('Please sign in to create snippets');
      return;
    }

    if (!formData.code.trim()) {
      toast.error('Code cannot be empty');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/snippets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create snippet');
      }

      // Reset form and close dialog immediately
      setFormData({
        title: '',
        description: '',
        code: '',
        language: 'javascript',
        tags: '',
      });
      setIsOpen(false);

      // Update the router cache and navigate
      router.refresh();
      router.push(`/snippets/${data.id}`);

      // Show success message after navigation starts
      toast.success('Snippet created successfully!');
    } catch (error) {
      console.error('Create snippet error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create snippet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2 bg-cyan-500/30 border-cyan-400 text-cyan-300 hover:bg-cyan-400/20 hover:border-cyan-300 hover:text-cyan-200 transition-all duration-300 font-medium shadow-lg shadow-cyan-500/10"
        >
          <Plus className="h-4 w-4" />
          Create Snippet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-gradient-to-b from-gray-900/95 to-gray-950/95 border-gray-800/50 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-orbitron bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
            Create New Snippet
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="relative">
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-cyan-400" />
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-gray-800/30 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 placeholder:text-gray-500 transition-all duration-200"
                placeholder="Enter snippet title"
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-cyan-400" />
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={2}
                className="w-full bg-gray-800/30 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 placeholder:text-gray-500 transition-all duration-200"
                placeholder="Describe your snippet"
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Code2 className="h-4 w-4 text-cyan-400" />
                Code
              </label>
              <textarea
                id="code"
                name="code"
                required
                value={formData.code}
                onChange={handleChange}
                rows={8}
                className="w-full bg-gray-800/30 border border-gray-700/50 rounded-lg px-4 py-2 text-white font-mono focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 placeholder:text-gray-500 transition-all duration-200"
                placeholder="Paste your code here"
                disabled={isLoading}
                style={{ 
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.9rem',
                  lineHeight: '1.5'
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Globe2 className="h-4 w-4 text-cyan-400" />
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full bg-gray-800/30 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all duration-200"
                  disabled={isLoading}
                >
                  {LANGUAGES.map(({ value, label, icon }) => (
                    <option key={value} value={value}>
                      {icon} {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Hash className="h-4 w-4 text-cyan-400" />
                  Tags
                </label>
                <input
                  id="tags"
                  name="tags"
                  type="text"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full bg-gray-800/30 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 placeholder:text-gray-500 transition-all duration-200"
                  placeholder="react, hooks, frontend"
                  disabled={isLoading}
                />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              type="submit"
              disabled={isLoading}
              className={`
                relative px-6 py-2 bg-transparent border border-cyan-400 rounded-md
                text-cyan-300 font-medium hover:bg-cyan-400/10
                transition-all duration-300 
                disabled:opacity-50 disabled:cursor-not-allowed
                before:absolute before:inset-0 before:bg-cyan-400/20 before:rounded-md
                before:opacity-0 hover:before:opacity-100 before:transition-opacity
                shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_25px_rgba(34,211,238,0.2)]
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create Snippet'
              )}
            </Button>
          </motion.div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 