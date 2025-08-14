import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { IdeaCard } from './components/IdeaCard';
import { IdeaModal } from './components/IdeaModal';
import { ExportModal } from './components/ExportModal';
import { EmptyState } from './components/EmptyState';
import { useIdeas } from './hooks/useIdeas';
import { exportIdeas } from './utils/exportUtils';
import { Idea, ExportOptions } from './types';

function App() {
  const {
    ideas,
    categories,
    filteredIdeas,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    addIdea,
    updateIdea,
    deleteIdea,
    linkIdeas,
    unlinkIdeas,
  } = useIdeas();

  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | undefined>();

  const handleCreateIdea = () => {
    setEditingIdea(undefined);
    setIsIdeaModalOpen(true);
  };

  const handleEditIdea = (idea: Idea) => {
    setEditingIdea(idea);
    setIsIdeaModalOpen(true);
  };

  const handleSaveIdea = (ideaData: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingIdea) {
      updateIdea(editingIdea.id, ideaData);
    } else {
      addIdea(ideaData);
    }
  };

  const handleDeleteIdea = (ideaId: string) => {
    if (confirm('Are you sure you want to delete this idea? This action cannot be undone.')) {
      deleteIdea(ideaId);
    }
  };

  const handleViewLinks = (idea: Idea) => {
    // For now, just edit the idea to show linked ideas
    handleEditIdea(idea);
  };

  const handleExport = (options: ExportOptions) => {
    exportIdeas(ideas, categories, options);
  };

  const getCategoryById = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  };

  const getLinkedIdeasCount = (idea: Idea) => {
    return idea.linkedIdeas.length;
  };

  const hasSearchOrFilter = searchTerm.trim() !== '' || selectedCategory !== null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNewIdea={handleCreateIdea}
        onExport={() => setIsExportModalOpen(true)}
        ideaCount={ideas.length}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory 
                  ? getCategoryById(selectedCategory)?.name || 'Unknown Category'
                  : 'All Ideas'
                }
              </h2>
              <p className="text-gray-600 mt-1">
                {filteredIdeas.length} {filteredIdeas.length === 1 ? 'idea' : 'ideas'}
                {hasSearchOrFilter && ` (filtered from ${ideas.length})`}
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {filteredIdeas.length === 0 ? (
          <EmptyState 
            onCreateIdea={handleCreateIdea} 
            hasSearch={hasSearchOrFilter}
          />
        ) : (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredIdeas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  category={getCategoryById(idea.category)}
                  linkedIdeasCount={getLinkedIdeasCount(idea)}
                  onEdit={handleEditIdea}
                  onDelete={handleDeleteIdea}
                  onViewLinks={handleViewLinks}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <IdeaModal
        isOpen={isIdeaModalOpen}
        onClose={() => {
          setIsIdeaModalOpen(false);
          setEditingIdea(undefined);
        }}
        onSave={handleSaveIdea}
        categories={categories}
        existingIdea={editingIdea}
        allIdeas={ideas}
        onLinkIdea={linkIdeas}
        onUnlinkIdea={unlinkIdeas}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        ideas={ideas}
        categories={categories}
        onExport={handleExport}
      />
    </div>
  );
}

export default App;