// --- components/MindMap.tsx ---
import React from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection,
  OnConnectStartParams,
  OnConnectEndParams,
} from "reactflow";
import "reactflow/dist/style.css";
import { nanoid } from "nanoid";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  Fab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Upload as UploadIcon,
  MoreVert as MoreVertIcon,
  GetApp as GetAppIcon,
  Publish as PublishIcon,
  Restore as RestoreIcon,
} from "@mui/icons-material";
import { exportMindMapConfig, importMindMapConfig, createSampleConfig } from "../utils/mindmapConfig";
import { saveMindMapToStorage, loadMindMapFromStorage, hasSavedMindMap } from "../utils/localStorage";
import EditableNode, { EditableNodeData } from "./EditableNode";

const initialNodes: Node[] = [
  {
    id: "1",
    data: { 
      label: "Yoffix", 
      description: "", 
      startDate: "", 
      endDate: "",
      onDataChange: undefined, // Will be set in component
    },
    position: { x: 250, y: 5 },
    type: "editableNode",
  },
];

const initialEdges: Edge[] = [];

// Custom node types
const nodeTypes = {
  editableNode: EditableNode,
};

const MindMap: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [connectingNodeId, setConnectingNodeId] = React.useState<string | null>(null);
  
  // Import/Export related state
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });
  const [exportDialog, setExportDialog] = React.useState(false);
  const [exportTitle, setExportTitle] = React.useState('');
  const [exportDescription, setExportDescription] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Load saved mindmap on component mount
  React.useEffect(() => {
    const savedData = loadMindMapFromStorage();
    if (savedData) {
      // Add onDataChange callback to loaded nodes
      const nodesWithCallback = savedData.nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          onDataChange: handleNodeDataChange,
        },
      }));
      setNodes(nodesWithCallback);
      setEdges(savedData.edges);
      setSnackbar({
        open: true,
        message: 'Previously saved mindmap loaded!',
        severity: 'info',
      });
    } else {
      // Set callback for initial nodes
      setNodes(currentNodes => 
        currentNodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            onDataChange: handleNodeDataChange,
          },
        }))
      );
    }
  }, []);

  // Auto-save to localStorage whenever nodes or edges change
  React.useEffect(() => {
    if (nodes.length > 0) {
      saveMindMapToStorage(nodes, edges);
    }
  }, [nodes, edges]);

  // Handle node data changes (optimistic UI)
  const handleNodeDataChange = React.useCallback((nodeId: string, newData: Partial<EditableNodeData>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                ...newData,
              },
            }
          : node
      )
    );
  }, [setNodes]);

  const onConnectStart = (_: React.MouseEvent, params: OnConnectStartParams) => {
    setConnectingNodeId(params.nodeId);
  };

  const onConnectEnd = (event: MouseEvent) => {
    const reactFlowBounds = document
      .querySelector(".react-flow__viewport")
      ?.getBoundingClientRect();

    if (!reactFlowBounds || !connectingNodeId) return;

    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };

    const newNodeId = nanoid();
    const newNode: Node = {
      id: newNodeId,
      data: { 
        label: "New Node", 
        description: "", 
        startDate: "", 
        endDate: "",
        onDataChange: handleNodeDataChange,
      },
      position,
      type: "editableNode",
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, { id: nanoid(), source: connectingNodeId, target: newNodeId }]);
    setConnectingNodeId(null);
  };

  const onConnect = (params: Connection) => setEdges((eds) => addEdge(params, eds));

  const onNodeDoubleClick: NodeMouseHandler = (_, node) => {
    setSelectedNode(node);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!selectedNode) return;
    const { name, value } = e.target;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id ? { ...n, data: { ...n.data, [name]: value } } : n
      )
    );
  };

  const closeEditor = () => setSelectedNode(null);

  // Import/Export handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleExportClick = () => {
    setExportDialog(true);
    handleMenuClose();
  };

  const handleExportConfirm = () => {
    try {
      exportMindMapConfig(nodes, edges, exportTitle || 'MindMap', exportDescription);
      setSnackbar({
        open: true,
        message: 'MindMap configuration exported successfully!',
        severity: 'success',
      });
      setExportDialog(false);
      setExportTitle('');
      setExportDescription('');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to export configuration',
        severity: 'error',
      });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
    handleMenuClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    importMindMapConfig(
      file,
      (importedNodes, importedEdges, metadata) => {
        // Add onDataChange callback to imported nodes
        const nodesWithCallback = importedNodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            onDataChange: handleNodeDataChange,
          },
        }));
        setNodes(nodesWithCallback);
        setEdges(importedEdges);
        setSnackbar({
          open: true,
          message: `MindMap "${metadata.title}" imported successfully!`,
          severity: 'success',
        });
      },
      (error) => {
        setSnackbar({
          open: true,
          message: `Import failed: ${error}`,
          severity: 'error',
        });
      }
    );

    // Reset file input
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleLoadSample = () => {
    const sampleConfig = createSampleConfig();
    // Add onDataChange callback to sample nodes
    const nodesWithCallback = sampleConfig.nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onDataChange: handleNodeDataChange,
      },
    }));
    setNodes(nodesWithCallback);
    setEdges(sampleConfig.edges);
    setSnackbar({
      open: true,
      message: 'Sample mindmap loaded successfully!',
      severity: 'info',
    });
    handleMenuClose();
  };

  const handleLoadSavedMindMap = () => {
    const savedData = loadMindMapFromStorage();
    if (savedData) {
      // Add onDataChange callback to loaded nodes
      const nodesWithCallback = savedData.nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          onDataChange: handleNodeDataChange,
        },
      }));
      setNodes(nodesWithCallback);
      setEdges(savedData.edges);
      setSnackbar({
        open: true,
        message: 'Saved mindmap loaded successfully!',
        severity: 'success',
      });
    } else {
      setSnackbar({
        open: true,
        message: 'No saved mindmap found!',
        severity: 'info',
      });
    }
    handleMenuClose();
  };

  const handleSaveMindMap = () => {
    saveMindMapToStorage(nodes, edges);
    setSnackbar({
      open: true,
      message: 'MindMap saved successfully!',
      severity: 'success',
    });
    handleMenuClose();
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div style={{ width: "100%", height: "90vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        nodeTypes={nodeTypes}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background gap={12} size={1} />
      </ReactFlow>

      {/* Floating Action Button for Import/Export */}
      <Fab
        color="primary"
        aria-label="import-export"
        onClick={handleMenuOpen}
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <MoreVertIcon />
      </Fab>

      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        style={{ display: 'none' }}
      />

      {/* Export Dialog */}
      <Dialog open={exportDialog} onClose={() => setExportDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Export MindMap Configuration</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Export your current mindmap as a JSON file that can be imported later.
            </Typography>
            <TextField
              label="Title"
              value={exportTitle}
              onChange={(e) => setExportTitle(e.target.value)}
              fullWidth
              placeholder="Enter a title for your mindmap"
            />
            <TextField
              label="Description"
              value={exportDescription}
              onChange={(e) => setExportDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
              placeholder="Optional description of your mindmap"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialog(false)}>Cancel</Button>
          <Button onClick={handleExportConfirm} variant="contained" startIcon={<DownloadIcon />}>
            Export
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import/Export Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleExportClick}>
          <ListItemIcon>
            <GetAppIcon />
          </ListItemIcon>
          <ListItemText>Export Configuration</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleImportClick}>
          <ListItemIcon>
            <UploadIcon />
          </ListItemIcon>
          <ListItemText>Import Configuration</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLoadSample}>
          <ListItemIcon>
            <PublishIcon />
          </ListItemIcon>
          <ListItemText>Load Sample MindMap</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLoadSavedMindMap}>
          <ListItemIcon>
            <RestoreIcon />
          </ListItemIcon>
          <ListItemText>Load Saved MindMap</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSaveMindMap}>
          <ListItemIcon>
            <PublishIcon />
          </ListItemIcon>
          <ListItemText>Save MindMap</ListItemText>
        </MenuItem>
      </Menu>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MindMap;
