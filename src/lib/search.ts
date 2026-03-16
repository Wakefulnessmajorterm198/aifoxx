import Fuse from 'fuse.js';
import type { Tool } from '@/types/tool';
import toolsData from '@/data/tools.json';

const tools = toolsData as Tool[];

const fuse = new Fuse<Tool>(tools, {
  keys: [
    { name: 'name', weight: 2 },
    { name: 'tags', weight: 1.5 },
    { name: 'description', weight: 1 },
    { name: 'category', weight: 0.5 },
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2,
});

export function searchTools(query: string): Tool[] {
  if (!query || !query.trim()) return tools;
  return fuse.search(query).map((r) => r.item);
}

export default searchTools;
