import React from 'react';
import { Lightbulb, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateIdea: () => void;
  hasSearch: boolean;
}

export function EmptyState({ onCreateIdea, hasSearch }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lightbulb className="w-8 h-8 text-gray-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {hasSearch ? 'No ideas found' : 'No ideas yet'}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {hasSearch 
            ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
            : 'Start capturing your creative thoughts and build your personal idea library.'
          }
        </p>
        
        {!hasSearch && (
          <button
            onClick={onCreateIdea}
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Create Your First Idea
          </button>
        )}
      </div>
    </div>
  );
}