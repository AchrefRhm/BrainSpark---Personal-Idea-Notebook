import React from 'react';
import * as LucideIcons from 'lucide-react';

interface CategoryIconProps {
  iconName: string;
  className?: string;
}

export function CategoryIcon({ iconName, className = "w-4 h-4" }: CategoryIconProps) {
  // @ts-ignore - Dynamic icon access
  const Icon = LucideIcons[iconName] || LucideIcons.Lightbulb;
  return <Icon className={className} />;
}