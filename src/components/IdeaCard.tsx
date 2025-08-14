import React from 'react';
import { Idea, Category } from '../types';
import { Calendar, Link as LinkIcon, Edit2, Trash2, Tag } from 'lucide-react';

interface IdeaCardProps {
  idea: Idea;
  category: Category | undefined;
  linkedIdeasCount: number;
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => void;
  onViewLinks: (idea: Idea) => void;
}

export function IdeaCard({ 
  idea, 
  category, 
  linkedIdeasCount, 
  onEdit, 
  onDelete, 
  onViewLinks 
}: IdeaCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {category && (
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
            )}
            <span className="text-sm font-medium text-gray-600">
              {category?.name || 'Uncategorized'}
            </span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(idea)}
              className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(idea.id)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {idea.title}
        </h3>

        {/* Content */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {idea.content}
        </p>

        {/* Tags */}
        {idea.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {idea.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(idea.updatedAt)}
          </div>
          {linkedIdeasCount > 0 && (
            <button
              onClick={() => onViewLinks(idea)}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-600 font-medium"
            >
              <LinkIcon className="w-3 h-3" />
              {linkedIdeasCount} linked
            </button>
          )}
        </div>
      </div>
    </div>
  );
}