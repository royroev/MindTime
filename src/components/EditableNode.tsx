// --- components/EditableNode.tsx ---
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import {
  Paper,
  TextField,
  Box,
  Checkbox,
  Button,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { KeyboardArrowDown, Delete as DeleteIcon } from '@mui/icons-material';

// Predefined color palette
const COLOR_PALETTE = [
  { value: '#ffffff', name: 'White' }, // White (default)
  { value: '#e3f2fd', name: 'Light Blue' },
  { value: '#f3e5f5', name: 'Light Purple' },
  { value: '#e8f5e8', name: 'Light Green' },
  { value: '#fff3e0', name: 'Light Orange' },
  { value: '#ffebee', name: 'Light Pink' },
  { value: '#f1f8e9', name: 'Light Lime' },
  { value: '#fce4ec', name: 'Light Rose' },
  { value: '#e0f2f1', name: 'Light Teal' },
];

export interface EditableNodeData {
  label: string;
  description: string;
  startDate: string;
  endDate: string;
  backgroundColor: string;
  completed: boolean;
  icon: string;
  onDataChange?: (id: string, newData: Partial<EditableNodeData>) => void;
  onColorChangeWithChildren?: (id: string, color: string) => void;
  onDelete?: (id: string) => void;
}

const EditableNode: React.FC<NodeProps<EditableNodeData>> = ({ id, data, selected }) => {
  const [localData, setLocalData] = useState<EditableNodeData>(data);
  const [colorMenuAnchor, setColorMenuAnchor] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingIcon, setIsEditingIcon] = useState(false);
  const labelInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

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

  const handleIconClick = useCallback(() => {
    setIsEditingIcon(true);
    setTimeout(() => {
      iconInputRef.current?.focus();
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

  const handleIconChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newIcon = event.target.value;
    setLocalData(prev => ({ ...prev, icon: newIcon }));
  }, []);

  const handleIconBlur = useCallback(() => {
    setIsEditingIcon(false);
    if (data.onDataChange) {
      data.onDataChange(id, { icon: localData.icon });
    }
  }, [id, localData.icon, data]);

  const handleIconKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleIconBlur();
    }
    if (event.key === 'Escape') {
      setLocalData(prev => ({ ...prev, icon: data.icon }));
      setIsEditingIcon(false);
    }
  }, [data.icon, handleIconBlur]);

  const handleFieldChange = useCallback((field: keyof EditableNodeData, value: string) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
    if (data.onDataChange) {
      data.onDataChange(id, { [field]: value });
    }
  }, [id, data]);

  const handleColorMenuClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setColorMenuAnchor(event.currentTarget);
  }, []);

  const handleColorMenuClose = useCallback(() => {
    setColorMenuAnchor(null);
  }, []);

  const handleColorChangeWithChildren = (color: string) => {
    if (data.onColorChangeWithChildren) {
      data.onColorChangeWithChildren(id, color);
    }
    setColorMenuAnchor(null);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (data.onDelete) {
      data.onDelete(id);
    }
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

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
        backgroundColor: localData.backgroundColor || '#ffffff',
        opacity: localData.completed ? 0.7 : 1,
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
        {/* Completion Status and Icon Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Checkbox
            checked={localData.completed || false}
            onChange={(e) => {
              const newCompleted = e.target.checked;
              setLocalData(prev => ({ ...prev, completed: newCompleted }));
              if (data.onDataChange) {
                data.onDataChange(id, { completed: newCompleted });
              }
            }}
            size="small"
            sx={{ padding: 0 }}
          />
          
          {/* Icon Display */}
          {localData.icon && (
            <Box
              sx={{
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '20px',
              }}
            >
              {localData.icon}
            </Box>
          )}
        </Box>

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
                textDecoration: localData.completed ? 'line-through' : 'none',
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

        {/* Icon Section */}
        <Box sx={{ mb: 1 }}>
          {isEditingIcon ? (
            <TextField
              ref={iconInputRef}
              value={localData.icon}
              onChange={handleIconChange}
              onBlur={handleIconBlur}
              onKeyDown={handleIconKeyDown}
              variant="outlined"
              fullWidth
              size="small"
              placeholder="Add icon..."
            />
          ) : (
            <Typography
              variant="body2"
              onClick={handleIconClick}
              sx={{
                cursor: 'pointer',
                color: localData.icon ? 'text.primary' : 'text.secondary',
                fontStyle: localData.icon ? 'normal' : 'italic',
                minHeight: '20px',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  borderRadius: 1,
                  padding: '2px 4px',
                  margin: '-2px -4px',
                },
              }}
            >
              {localData.icon || 'Click to add icon'}
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

        {/* Background Color Picker */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Background Color
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={handleColorMenuClick}
            endIcon={<KeyboardArrowDown />}
            startIcon={
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: localData.backgroundColor || '#ffffff',
                  border: '1px solid #ccc',
                  borderRadius: 1,
                }}
              />
            }
            sx={{ minWidth: 120 }}
          >
            Color
          </Button>
          
          <Menu
            anchorEl={colorMenuAnchor}
            open={Boolean(colorMenuAnchor)}
            onClose={handleColorMenuClose}
            PaperProps={{
              sx: { p: 1 }
            }}
          >
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0.5 }}>
              {COLOR_PALETTE.map((color) => (
                <MenuItem
                  key={color.value}
                  onClick={() => handleColorChangeWithChildren(color.value)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    minHeight: 40,
                  }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: color.value,
                      border: '1px solid #ccc',
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="body2">{color.name}</Typography>
                </MenuItem>
              ))}
            </Box>
          </Menu>
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

      {/* Delete Button */}
      {data.onDelete && (
        <Box sx={{ mt: 1, textAlign: 'right' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleDeleteClick}
            endIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </Box>
      )}

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this node?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default EditableNode;
