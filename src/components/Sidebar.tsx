import React from 'react';
import { Search, Plus, Download } from 'lucide-react';
import { Category } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface SidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onNewIdea: () => void;
  onExport: () => void;
  ideaCount: number;
}

export function Sidebar({
  categories,
  selectedCategory,
  onCategorySelect,
  searchTerm,
  onSearchChange,
  onNewIdea,
  onExport,
  ideaCount,
}: SidebarProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">BrainSpark</h1>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search ideas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onNewIdea}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            New Idea
          </button>
          <button
            onClick={onExport}
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Categories</h2>
        
        <div className="space-y-1">
          {/* All Ideas */}
          <button
            onClick={() => onCategorySelect(null)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              selectedCategory === null
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <span className="font-medium">All Ideas</span>
            <span className="ml-auto text-sm text-gray-500">{ideaCount}</span>
          </button>

          {/* Category List */}
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: category.color }}
              />
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-500">
          Created by{' '}
          <span className="font-semibold text-gray-700">Achref Rhouma</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          All data stored locally for privacy
        </p>
      </div>
    </div>
  );
}