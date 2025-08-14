import { useState, useEffect } from 'react';
import { Idea, Category } from '../types';
import { useLocalStorage } from './useLocalStorage';

const defaultCategories: Category[] = [
  { id: '1', name: 'General', color: '#6B7280', icon: 'Lightbulb' },
  { id: '2', name: 'Business', color: '#3B82F6', icon: 'Briefcase' },
  { id: '3', name: 'Creative', color: '#8B5CF6', icon: 'Palette' },
  { id: '4', name: 'Tech', color: '#10B981', icon: 'Code' },
  { id: '5', name: 'Personal', color: '#F59E0B', icon: 'Heart' },
];

export function useIdeas() {
  const [ideas, setIdeas] = useLocalStorage<Idea[]>('brainspark-ideas', []);
  const [categories, setCategories] = useLocalStorage<Category[]>('brainspark-categories', defaultCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const addIdea = (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newIdea: Idea = {
      ...idea,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setIdeas(prev => [...prev, newIdea]);
    return newIdea.id;
  };

  const updateIdea = (id: string, updates: Partial<Idea>) => {
    setIdeas(prev => prev.map(idea => 
      idea.id === id 
        ? { ...idea, ...updates, updatedAt: new Date() }
        : idea
    ));
  };

  const deleteIdea = (id: string) => {
    setIdeas(prev => {
      const filtered = prev.filter(idea => idea.id !== id);
      // Remove references to deleted idea from other ideas
      return filtered.map(idea => ({
        ...idea,
        linkedIdeas: idea.linkedIdeas.filter(linkedId => linkedId !== id)
      }));
    });
  };

  const linkIdeas = (ideaId: string, linkedIdeaId: string) => {
    setIdeas(prev => prev.map(idea => {
      if (idea.id === ideaId && !idea.linkedIdeas.includes(linkedIdeaId)) {
        return { ...idea, linkedIdeas: [...idea.linkedIdeas, linkedIdeaId] };
      }
      if (idea.id === linkedIdeaId && !idea.linkedIdeas.includes(ideaId)) {
        return { ...idea, linkedIdeas: [...idea.linkedIdeas, ideaId] };
      }
      return idea;
    }));
  };

  const unlinkIdeas = (ideaId: string, linkedIdeaId: string) => {
    setIdeas(prev => prev.map(idea => ({
      ...idea,
      linkedIdeas: idea.linkedIdeas.filter(id => 
        !(idea.id === ideaId && id === linkedIdeaId) &&
        !(idea.id === linkedIdeaId && id === ideaId)
      )
    })));
  };

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = searchTerm === '' || 
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === null || idea.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return {
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
    setCategories,
  };
}