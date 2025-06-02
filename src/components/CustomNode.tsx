import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Checkbox, Box } from '@mui/material';

export interface CustomNodeData {
  label: string;
  description: string;
  startDate: string;
  endDate: string;
  backgroundColor: string;
  completed: boolean;
  icon: string;
}

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data }) => {
  const { label, backgroundColor = '#ffffff', completed = false, icon = '' } = data;

  return (
    <Box
      sx={{
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        backgroundColor: backgroundColor,
        minWidth: '150px',
        position: 'relative',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555' }}
      />
      
      {/* Completion checkbox */}
      <Checkbox
        checked={completed}
        size="small"
        sx={{ 
          padding: 0,
          '& .MuiSvgIcon-root': { fontSize: 16 }
        }}
        // Note: We'll handle the change in the parent component via double-click edit
        readOnly
      />
      
      {/* Icon */}
      {icon && (
        <Box
          sx={{
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '20px',
          }}
        >
          {icon}
        </Box>
      )}
      
      {/* Label */}
      <Box
        sx={{
          fontSize: '14px',
          fontWeight: 500,
          textDecoration: completed ? 'line-through' : 'none',
          opacity: completed ? 0.7 : 1,
          flex: 1,
        }}
      >
        {label}
      </Box>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#555' }}
      />
    </Box>
  );
};

export default CustomNode;
