import React, { useState } from 'react';
import { X, Download, FileText, Code, FileDown } from 'lucide-react';
import { Idea, Category, ExportOptions } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideas: Idea[];
  categories: Category[];
  onExport: (options: ExportOptions) => void;
}

export function ExportModal({ isOpen, onClose, ideas, categories, onExport }: ExportModalProps) {
  const [format, setFormat] = useState<'text' | 'json' | 'markdown'>('markdown');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleExport = () => {
    onExport({
      format,
      includeMetadata,
      selectedCategories: selectedCategories.length > 0 ? selectedCategories : undefined,
    });
    onClose();
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const formatIcons = {
    text: FileText,
    json: Code,
    markdown: FileDown,
  };

  const FormatIcon = formatIcons[format];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Export Ideas</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['text', 'json', 'markdown'] as const).map((fmt) => {
                const Icon = formatIcons[fmt];
                return (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-colors ${
                      format === fmt
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm font-medium capitalize">{fmt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Options
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={includeMetadata}
                onChange={(e) => setIncludeMetadata(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Include Metadata</span>
                <p className="text-xs text-gray-500">
                  Include creation dates, tags, and category information
                </p>
              </div>
            </label>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Categories (leave empty to export all)
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {categories.map((category) => {
                const categoryIdeas = ideas.filter(idea => idea.category === category.id);
                return (
                  <label
                    key={category.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm text-gray-700">{category.name}</span>
                    <span className="text-xs text-gray-500 ml-auto">
                      ({categoryIdeas.length})
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FormatIcon className="w-4 h-4" />
              <span className="font-medium">Export Preview</span>
            </div>
            <p>
              {selectedCategories.length > 0 
                ? `Exporting ${ideas.filter(idea => selectedCategories.includes(idea.category)).length} ideas from selected categories`
                : `Exporting all ${ideas.length} ideas`
              } as {format.toUpperCase()} format
              {includeMetadata ? ' with metadata' : ''}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}