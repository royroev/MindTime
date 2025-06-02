// --- utils/localStorage.ts ---
import { Node, Edge } from 'reactflow';

const MINDMAP_STORAGE_KEY = 'mindtime-mindmap-data';

export interface MindMapData {
  nodes: Node[];
  edges: Edge[];
  lastUpdated: string;
}

/**
 * Save mindmap data to localStorage
 */
export const saveMindMapToStorage = (nodes: Node[], edges: Edge[]): void => {
  try {
    const data: MindMapData = {
      nodes,
      edges,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(MINDMAP_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save mindmap to localStorage:', error);
  }
};

/**
 * Load mindmap data from localStorage
 */
export const loadMindMapFromStorage = (): MindMapData | null => {
  try {
    const stored = localStorage.getItem(MINDMAP_STORAGE_KEY);
    if (!stored) return null;
    
    const data: MindMapData = JSON.parse(stored);
    
    // Validate the data structure
    if (!data.nodes || !data.edges || !Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
      console.warn('Invalid mindmap data in localStorage, ignoring');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to load mindmap from localStorage:', error);
    return null;
  }
};

/**
 * Clear mindmap data from localStorage
 */
export const clearMindMapFromStorage = (): void => {
  try {
    localStorage.removeItem(MINDMAP_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear mindmap from localStorage:', error);
  }
};

/**
 * Check if there's saved mindmap data in localStorage
 */
export const hasSavedMindMap = (): boolean => {
  try {
    const stored = localStorage.getItem(MINDMAP_STORAGE_KEY);
    return stored !== null;
  } catch (error) {
    return false;
  }
};

