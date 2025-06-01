// --- components/EditableNode.tsx ---
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import {
  Box,
  TextField,
  Typography,
  Paper,
} from '@mui/material';

export interface EditableNodeData {
  label: string;
  description: string;
  startDate: string;
  endDate: string;
  onDataChange?: (id: string, newData: Partial<EditableNodeData>) => void;
}

const EditableNode: React.FC<NodeProps<EditableNodeData>> = ({ id, data, selected }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [localData, setLocalData] = useState(data);
  const labelInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);

  // Update local data when props change
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleTitleClick = useCallback(() => {
    setIsEditingTitle(true);
    setTimeout(() => {
      labelInputRef.current?.focus();
      labelInputRef.current?.select();
    }, 0);
  }, []);

  const handleDescriptionClick = useCallback(() => {
    setIsEditingDescription(true);
    setTimeout(() => {
      descriptionInputRef.current?.focus();
    }, 0);
  }, []);

  const handleTitleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = event.target.value;
    setLocalData(prev => ({ ...prev, label: newLabel }));
  }, []);

  const handleTitleBlur = useCallback(() => {
    setIsEditingTitle(false);
    if (data.onDataChange) {
      data.onDataChange(id, { label: localData.label });
    }
  }, [id, localData.label, data]);

  const handleTitleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleTitleBlur();
    }
    if (event.key === 'Escape') {
      setLocalData(prev => ({ ...prev, label: data.label }));
      setIsEditingTitle(false);
    }
  }, [data.label, handleTitleBlur]);

  const handleDescriptionChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newDescription = event.target.value;
    setLocalData(prev => ({ ...prev, description: newDescription }));
  }, []);

  const handleDescriptionBlur = useCallback(() => {
    setIsEditingDescription(false);
    if (data.onDataChange) {
      data.onDataChange(id, { description: localData.description });
    }
  }, [id, localData.description, data]);

  const handleDescriptionKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleDescriptionBlur();
    }
    if (event.key === 'Escape') {
      setLocalData(prev => ({ ...prev, description: data.description }));
      setIsEditingDescription(false);
    }
  }, [data.description, handleDescriptionBlur]);

  const handleFieldChange = useCallback((field: keyof EditableNodeData, value: string) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
    if (data.onDataChange) {
      data.onDataChange(id, { [field]: value });
    }
  }, [id, data]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <Paper
      elevation={selected ? 8 : 2}
      sx={{
        minWidth: 200,
        maxWidth: 300,
        border: selected ? '2px solid #1976d2' : '1px solid #e0e0e0',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          elevation: 4,
          transform: 'translateY(-1px)',
        },
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: '#1976d2',
          width: 8,
          height: 8,
          border: '2px solid white',
        }}
      />

      <Box sx={{ p: 2 }}>
        {/* Title Section */}
        <Box sx={{ mb: 1 }}>
          {isEditingTitle ? (
            <TextField
              ref={labelInputRef}
              value={localData.label}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              variant="standard"
              fullWidth
              sx={{
                '& .MuiInput-input': {
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  padding: 0,
                },
                '& .MuiInput-underline:before': {
                  borderBottom: 'none',
                },
                '& .MuiInput-underline:hover:before': {
                  borderBottom: 'none',
                },
              }}
            />
          ) : (
            <Typography
              variant="h6"
              onClick={handleTitleClick}
              sx={{
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1.1rem',
                lineHeight: 1.2,
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  borderRadius: 1,
                  padding: '2px 4px',
                  margin: '-2px -4px',
                },
              }}
            >
              {localData.label || 'Click to edit title'}
            </Typography>
          )}
        </Box>

        {/* Description Section */}
        <Box sx={{ mb: 1 }}>
          {isEditingDescription ? (
            <TextField
              ref={descriptionInputRef}
              value={localData.description}
              onChange={handleDescriptionChange}
              onBlur={handleDescriptionBlur}
              onKeyDown={handleDescriptionKeyDown}
              variant="outlined"
              fullWidth
              multiline
              rows={2}
              size="small"
              placeholder="Add description..."
            />
          ) : (
            <Typography
              variant="body2"
              onClick={handleDescriptionClick}
              sx={{
                cursor: 'pointer',
                color: localData.description ? 'text.primary' : 'text.secondary',
                fontStyle: localData.description ? 'normal' : 'italic',
                minHeight: '20px',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  borderRadius: 1,
                  padding: '2px 4px',
                  margin: '-2px -4px',
                },
              }}
            >
              {localData.description || 'Click to add description'}
            </Typography>
          )}
        </Box>

        {/* Date Fields */}
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <TextField
            label="Start Date"
            type="date"
            value={localData.startDate}
            onChange={(e) => handleFieldChange('startDate', e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            value={localData.endDate}
            onChange={(e) => handleFieldChange('endDate', e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        {/* Date Display */}
        {(localData.startDate || localData.endDate) && (
          <Box sx={{ mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              {localData.startDate && `From: ${formatDate(localData.startDate)}`}
              {localData.startDate && localData.endDate && ' • '}
              {localData.endDate && `To: ${formatDate(localData.endDate)}`}
            </Typography>
          </Box>
        )}
      </Box>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: '#1976d2',
          width: 8,
          height: 8,
          border: '2px solid white',
        }}
      />
    </Paper>
  );
};

export default EditableNode;

