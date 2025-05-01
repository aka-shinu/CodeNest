export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface Snippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  author: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
  tags: string[];
} 