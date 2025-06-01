// --- components/EditableNode.tsx ---
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import {
  Box,
  TextField,
  Typography,
  Paper,
  Chip,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

export interface EditableNodeData {
  label: string;
  description: string;
  startDate: string;
  endDate: string;
  onDataChange?: (id: string, newData: Partial<EditableNodeData>) => void;
}

const EditableNode: React.FC<NodeProps<EditableNodeData>> = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [localData, setLocalData] = useState(data);
  const labelInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);

  // Update local data when props change
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleLabelClick = useCallback(() => {
    setIsEditing(true);
    setTimeout(() => {
      labelInputRef.current?.focus();
      labelInputRef.current?.select();
    }, 0);
  }, []);

  const handleLabelChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = event.target.value;
    setLocalData(prev => ({ ...prev, label: newLabel }));
  }, []);

  const handleLabelBlur = useCallback(() => {
    setIsEditing(false);
    if (data.onDataChange) {
      data.onDataChange(id, { label: localData.label });
    }
  }, [id, localData.label, data]);

  const handleLabelKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleLabelBlur();
    }
    if (event.key === 'Escape') {
      setLocalData(prev => ({ ...prev, label: data.label }));
      setIsEditing(false);
    }
  }, [data.label, handleLabelBlur]);

  const handleFieldChange = useCallback((field: keyof EditableNodeData, value: string) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
    if (data.onDataChange) {
      data.onDataChange(id, { [field]: value });
    }
  }, [id, data]);

  const handleDescriptionBlur = useCallback(() => {
    if (data.onDataChange) {
      data.onDataChange(id, { description: localData.description });
    }
  }, [id, localData.description, data]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const hasDateInfo = localData.startDate || localData.endDate;
  const hasDescription = localData.description.trim().length > 0;

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
        <Box sx={{ mb: hasDescription || hasDateInfo ? 1 : 0 }}>
          {isEditing ? (
            <TextField
              ref={labelInputRef}
              value={localData.label}
              onChange={handleLabelChange}
              onBlur={handleLabelBlur}
              onKeyDown={handleLabelKeyDown}
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
              onClick={handleLabelClick}
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

        {/* Expandable Content */}
        {(hasDescription || hasDateInfo) && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {hasDescription && (
                <Chip
                  label="Description"
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem', height: 20 }}
                />
              )}
              {hasDateInfo && (
                <Chip
                  label="Dates"
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem', height: 20 }}
                />
              )}
            </Box>
            <IconButton
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{ padding: 0.5 }}
            >
              {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </IconButton>
          </Box>
        )}

        <Collapse in={isExpanded}>
          <Box sx={{ mt: 1, space: 1 }}>
            {/* Description Field */}
            <TextField
              label="Description"
              value={localData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              onBlur={handleDescriptionBlur}
              multiline
              rows={2}
              fullWidth
              variant="outlined"
              size="small"
              sx={{ mb: 1 }}
            />

            {/* Date Fields */}
            <Box sx={{ display: 'flex', gap: 1 }}>
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
            {hasDateInfo && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {localData.startDate && `From: ${formatDate(localData.startDate)}`}
                  {localData.startDate && localData.endDate && ' • '}
                  {localData.endDate && `To: ${formatDate(localData.endDate)}`}
                </Typography>
              </Box>
            )}
          </Box>
        </Collapse>

        {/* Quick Edit Indicator */}
        {!isExpanded && (hasDescription || hasDateInfo) && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <EditIcon sx={{ fontSize: 12, color: 'text.secondary', mr: 0.5 }} />
            <Typography variant="caption" color="text.secondary">
              Click to expand and edit
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

