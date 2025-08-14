import { Idea, Category, ExportOptions } from '../types';

export function exportIdeas(ideas: Idea[], categories: Category[], options: ExportOptions): void {
  const filteredIdeas = options.selectedCategories 
    ? ideas.filter(idea => options.selectedCategories!.includes(idea.category))
    : ideas;

  let content: string;
  let filename: string;
  let mimeType: string;

  switch (options.format) {
    case 'text':
      content = exportAsText(filteredIdeas, categories, options.includeMetadata);
      filename = `brainspark-ideas-${new Date().toISOString().split('T')[0]}.txt`;
      mimeType = 'text/plain';
      break;
    
    case 'json':
      content = exportAsJSON(filteredIdeas, categories, options.includeMetadata);
      filename = `brainspark-ideas-${new Date().toISOString().split('T')[0]}.json`;
      mimeType = 'application/json';
      break;
    
    case 'markdown':
      content = exportAsMarkdown(filteredIdeas, categories, options.includeMetadata);
      filename = `brainspark-ideas-${new Date().toISOString().split('T')[0]}.md`;
      mimeType = 'text/markdown';
      break;
    
    default:
      throw new Error(`Unsupported export format: ${options.format}`);
  }

  downloadFile(content, filename, mimeType);
}

function exportAsText(ideas: Idea[], categories: Category[], includeMetadata: boolean): string {
  const categoryMap = new Map(categories.map(cat => [cat.id, cat.name]));
  
  let content = `BrainSpark Ideas Export\n`;
  content += `Generated: ${new Date().toLocaleString()}\n`;
  content += `Total Ideas: ${ideas.length}\n\n`;
  content += '='.repeat(50) + '\n\n';

  ideas.forEach((idea, index) => {
    content += `${index + 1}. ${idea.title}\n`;
    content += '-'.repeat(idea.title.length + 3) + '\n\n';
    
    if (includeMetadata) {
      content += `Category: ${categoryMap.get(idea.category) || 'Uncategorized'}\n`;
      content += `Created: ${new Date(idea.createdAt).toLocaleString()}\n`;
      content += `Updated: ${new Date(idea.updatedAt).toLocaleString()}\n`;
      
      if (idea.tags.length > 0) {
        content += `Tags: ${idea.tags.join(', ')}\n`;
      }
      
      if (idea.linkedIdeas.length > 0) {
        const linkedTitles = idea.linkedIdeas.map(id => 
          ideas.find(i => i.id === id)?.title || 'Unknown'
        );
        content += `Linked Ideas: ${linkedTitles.join(', ')}\n`;
      }
      
      content += '\n';
    }
    
    content += `${idea.content}\n\n`;
    content += '='.repeat(50) + '\n\n';
  });

  return content;
}

function exportAsJSON(ideas: Idea[], categories: Category[], includeMetadata: boolean): string {
  const exportData = {
    exportedAt: new Date().toISOString(),
    totalIdeas: ideas.length,
    ideas: ideas.map(idea => {
      const baseIdea = {
        title: idea.title,
        content: idea.content,
        category: idea.category,
        tags: idea.tags,
        linkedIdeas: idea.linkedIdeas,
      };

      if (includeMetadata) {
        return {
          ...baseIdea,
          id: idea.id,
          createdAt: idea.createdAt,
          updatedAt: idea.updatedAt,
        };
      }

      return baseIdea;
    }),
    categories: categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      color: cat.color,
      icon: cat.icon,
    })),
  };

  return JSON.stringify(exportData, null, 2);
}

function exportAsMarkdown(ideas: Idea[], categories: Category[], includeMetadata: boolean): string {
  const categoryMap = new Map(categories.map(cat => [cat.id, cat.name]));
  
  let content = `# BrainSpark Ideas Export\n\n`;
  content += `**Generated:** ${new Date().toLocaleString()}  \n`;
  content += `**Total Ideas:** ${ideas.length}\n\n`;
  content += '---\n\n';

  // Group ideas by category
  const groupedIdeas = new Map<string, Idea[]>();
  ideas.forEach(idea => {
    const categoryName = categoryMap.get(idea.category) || 'Uncategorized';
    if (!groupedIdeas.has(categoryName)) {
      groupedIdeas.set(categoryName, []);
    }
    groupedIdeas.get(categoryName)!.push(idea);
  });

  groupedIdeas.forEach((categoryIdeas, categoryName) => {
    content += `## ${categoryName}\n\n`;
    
    categoryIdeas.forEach(idea => {
      content += `### ${idea.title}\n\n`;
      
      if (includeMetadata) {
        content += `**Created:** ${new Date(idea.createdAt).toLocaleString()}  \n`;
        content += `**Updated:** ${new Date(idea.updatedAt).toLocaleString()}  \n`;
        
        if (idea.tags.length > 0) {
          content += `**Tags:** ${idea.tags.map(tag => `\`${tag}\``).join(', ')}  \n`;
        }
        
        if (idea.linkedIdeas.length > 0) {
          const linkedTitles = idea.linkedIdeas.map(id => 
            ideas.find(i => i.id === id)?.title || 'Unknown'
          );
          content += `**Linked Ideas:** ${linkedTitles.join(', ')}  \n`;
        }
        
        content += '\n';
      }
      
      content += `${idea.content}\n\n`;
      content += '---\n\n';
    });
  });

  return content;
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}