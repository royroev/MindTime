// --- utils/mindmapConfig.ts ---
import { Node, Edge } from 'reactflow';

export interface MindMapConfiguration {
  nodes: Node[];
  edges: Edge[];
  metadata: {
    exportDate: string;
    version: string;
    title?: string;
    description?: string;
  };
}

/**
 * Export the current mindmap configuration to a JSON file
 */
export const exportMindMapConfig = (
  nodes: Node[],
  edges: Edge[],
  title?: string,
  description?: string
): void => {
  const config: MindMapConfiguration = {
    nodes,
    edges,
    metadata: {
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      title: title || 'Untitled MindMap',
      description: description || '',
    },
  };

  const dataStr = JSON.stringify(config, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `mindmap-${title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'export'}-${new Date().toISOString().split('T')[0]}.json`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

/**
 * Import mindmap configuration from a JSON file
 */
export const importMindMapConfig = (
  file: File,
  onSuccess: (nodes: Node[], edges: Edge[], metadata: MindMapConfiguration['metadata']) => void,
  onError: (error: string) => void
): void => {
  const reader = new FileReader();
  
  reader.onload = (event) => {
    try {
      const content = event.target?.result as string;
      const config: MindMapConfiguration = JSON.parse(content);
      
      // Validate the configuration structure
      if (!config.nodes || !config.edges || !config.metadata) {
        throw new Error('Invalid mindmap configuration file format');
      }
      
      // Validate nodes structure
      if (!Array.isArray(config.nodes)) {
        throw new Error('Invalid nodes data in configuration file');
      }
      
      // Validate edges structure
      if (!Array.isArray(config.edges)) {
        throw new Error('Invalid edges data in configuration file');
      }
      
      // Basic validation for required node properties
      for (const node of config.nodes) {
        if (!node.id || !node.data || !node.position) {
          throw new Error('Invalid node structure in configuration file');
        }
      }
      
      // Basic validation for required edge properties
      for (const edge of config.edges) {
        if (!edge.id || !edge.source || !edge.target) {
          throw new Error('Invalid edge structure in configuration file');
        }
      }
      
      onSuccess(config.nodes, config.edges, config.metadata);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to parse configuration file');
    }
  };
  
  reader.onerror = () => {
    onError('Failed to read the file');
  };
  
  reader.readAsText(file);
};

/**
 * Create a sample/template mindmap configuration
 */
export const createSampleConfig = (): MindMapConfiguration => {
  return {
    nodes: [
      {
        id: '1',
        data: {
          label: 'Main Topic',
          description: 'This is the central topic of your mindmap',
          startDate: '',
          endDate: '',
          backgroundColor: '#ffffff',
          completed: false,
          icon: '🎯'
        },
        position: { x: 250, y: 100 },
        type: 'editableNode',
      },
      {
        id: '2',
        data: {
          label: 'Subtopic 1',
          description: 'First branch of ideas',
          startDate: '',
          endDate: '',
          backgroundColor: '#e3f2fd',
          completed: false,
          icon: '⭐'
        },
        position: { x: 100, y: 200 },
        type: 'editableNode',
      },
      {
        id: '3',
        data: {
          label: 'Subtopic 2',
          description: 'Second branch of ideas',
          startDate: '',
          endDate: '',
          backgroundColor: '#f3e5f5',
          completed: true,
          icon: '📝'
        },
        position: { x: 400, y: 200 },
        type: 'editableNode',
      },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e1-3', source: '1', target: '3' },
    ],
    metadata: {
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      title: 'Sample MindMap',
      description: 'A sample mindmap to get you started',
    },
  };
};
