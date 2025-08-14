export interface Idea {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  linkedIdeas: string[];
  createdAt: Date;
  updatedAt: Date;
  color?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface ExportOptions {
  format: 'text' | 'json' | 'markdown';
  includeMetadata: boolean;
  selectedCategories?: string[];
}