"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Ruby",
  "Go",
  "Rust",
  "PHP",
  "Swift",
  "Kotlin",
  "Other",
];

export function SnippetsFilter() {
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("");

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <Input
        placeholder="Search snippets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="sm:max-w-[300px]"
      />
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="sm:max-w-[200px]">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All languages</SelectItem>
          {languages.map((lang) => (
            <SelectItem key={lang} value={lang.toLowerCase()}>
              {lang}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 