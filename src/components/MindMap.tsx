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
  NodeMouseHandler,
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
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
} from "@mui/material";
import CustomNode, { CustomNodeData } from "./CustomNode";

// Register custom node types
const nodeTypes = {
  customNode: CustomNode,
};

const initialNodes: Node<CustomNodeData>[] = [
  {
    id: "1",
    data: { 
      label: "Yoffix", 
      description: "", 
      startDate: "", 
      endDate: "",
      backgroundColor: "#ffffff",
      completed: false,
      icon: ""
    },
    position: { x: 250, y: 5 },
    type: "customNode",
  },
];

const initialEdges: Edge[] = [];

const MindMap: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [connectingNodeId, setConnectingNodeId] = React.useState<string | null>(null);
  const [selectedNode, setSelectedNode] = React.useState<Node<CustomNodeData> | null>(null);

  const onConnectStart = (_event: React.MouseEvent | React.TouchEvent, params: OnConnectStartParams) => {
    setConnectingNodeId(params.nodeId);
  };

  const onConnectEnd = (event: MouseEvent | TouchEvent) => {
    const reactFlowBounds = document
      .querySelector(".react-flow__viewport")
      ?.getBoundingClientRect();

    if (!reactFlowBounds || !connectingNodeId) return;

    const position = {
      x: (event as MouseEvent).clientX - reactFlowBounds.left,
      y: (event as MouseEvent).clientY - reactFlowBounds.top,
    };

    const newNodeId = nanoid();
    const newNode: Node<CustomNodeData> = {
      id: newNodeId,
      data: { 
        label: "New Node", 
        description: "", 
        startDate: "", 
        endDate: "",
        backgroundColor: "#ffffff",
        completed: false,
        icon: ""
      },
      position,
      type: "customNode",
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, { id: nanoid(), source: connectingNodeId, target: newNodeId }]);
    setConnectingNodeId(null);
  };

  const onConnect = (params: Connection) => setEdges((eds) => addEdge(params, eds));

  const onNodeDoubleClick: NodeMouseHandler = (_, node) => {
    setSelectedNode(node as Node<CustomNodeData>);
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
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background gap={12} size={1} />
      </ReactFlow>

      <Dialog open={!!selectedNode} onClose={closeEditor} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Node</DialogTitle>
        <DialogContent className="flex flex-col gap-4">
          <TextField
            label="Title"
            name="label"
            value={selectedNode?.data.label || ""}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={selectedNode?.data.description || ""}
            onChange={handleEditChange}
            multiline
            rows={3}
            fullWidth
          />
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            value={selectedNode?.data.startDate || ""}
            onChange={handleEditChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            value={selectedNode?.data.endDate || ""}
            onChange={handleEditChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          
          {/* Background Color Selection */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>Background Color</Typography>
            <TextField
              label="Background Color"
              name="backgroundColor"
              type="color"
              value={selectedNode?.data.backgroundColor || "#ffffff"}
              onChange={handleEditChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          
          {/* Completion Status */}
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedNode?.data.completed || false}
                  onChange={(e) => {
                    const { checked } = e.target;
                    setNodes((nds) =>
                      nds.map((n) =>
                        n.id === selectedNode?.id
                          ? { ...n, data: { ...n.data, completed: checked } }
                          : n
                      )
                    );
                  }}
                />
              }
              label="Completed"
            />
          </Box>
          
          {/* Icon */}
          <TextField
            label="Icon (emoji or text)"
            name="icon"
            value={selectedNode?.data.icon || ""}
            onChange={handleEditChange}
            fullWidth
            placeholder="e.g., 🎯, ⭐, 📝"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditor} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MindMap;
