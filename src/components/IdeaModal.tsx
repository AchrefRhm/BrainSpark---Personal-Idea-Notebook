import React, { useState, useEffect } from 'react';
import { X, Tag, Link as LinkIcon } from 'lucide-react';
import { Idea, Category } from '../types';

interface IdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => void;
  categories: Category[];
  existingIdea?: Idea;
  allIdeas: Idea[];
  onLinkIdea?: (ideaId: string, linkedIdeaId: string) => void;
  onUnlinkIdea?: (ideaId: string, linkedIdeaId: string) => void;
}

export function IdeaModal({
  isOpen,
  onClose,
  onSave,
  categories,
  existingIdea,
  allIdeas,
  onLinkIdea,
  onUnlinkIdea,
}: IdeaModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [linkedIdeas, setLinkedIdeas] = useState<string[]>([]);

  useEffect(() => {
    if (existingIdea) {
      setTitle(existingIdea.title);
      setContent(existingIdea.content);
      setCategory(existingIdea.category);
      setTags(existingIdea.tags);
      setLinkedIdeas(existingIdea.linkedIdeas);
    } else {
      setTitle('');
      setContent('');
      setCategory(categories[0]?.id || '');
      setTags([]);
      setLinkedIdeas([]);
    }
    setTagInput('');
  }, [existingIdea, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      content: content.trim(),
      category,
      tags,
      linkedIdeas,
    });

    onClose();
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const availableIdeas = allIdeas.filter(idea => 
    idea.id !== existingIdea?.id && !linkedIdeas.includes(idea.id)
  );

  const currentLinkedIdeas = allIdeas.filter(idea => linkedIdeas.includes(idea.id));

  const handleToggleLink = (ideaId: string) => {
    if (linkedIdeas.includes(ideaId)) {
      setLinkedIdeas(linkedIdeas.filter(id => id !== ideaId));
      if (existingIdea && onUnlinkIdea) {
        onUnlinkIdea(existingIdea.id, ideaId);
      }
    } else {
      setLinkedIdeas([...linkedIdeas, ideaId]);
      if (existingIdea && onLinkIdea) {
        onLinkIdea(existingIdea.id, ideaId);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {existingIdea ? 'Edit Idea' : 'New Idea'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your idea title..."
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Describe your idea in detail..."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a tag..."
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Linked Ideas */}
            {allIdeas.length > 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <LinkIcon className="inline w-4 h-4 mr-1" />
                  Linked Ideas
                </label>
                
                {currentLinkedIdeas.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">Currently linked:</p>
                    <div className="space-y-1">
                      {currentLinkedIdeas.map((idea) => (
                        <div
                          key={idea.id}
                          className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-lg"
                        >
                          <span className="text-sm text-blue-800 font-medium truncate">
                            {idea.title}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleLink(idea.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {availableIdeas.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Available ideas to link:</p>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {availableIdeas.map((idea) => (
                        <button
                          key={idea.id}
                          type="button"
                          onClick={() => handleToggleLink(idea.id)}
                          className="w-full flex items-center justify-between p-2 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-sm text-gray-700 truncate">
                            {idea.title}
                          </span>
                          <LinkIcon className="w-4 h-4 text-gray-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              {existingIdea ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}