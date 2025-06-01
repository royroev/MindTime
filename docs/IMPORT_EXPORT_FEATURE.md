# MindMap Import/Export Feature

## Overview

The MindTime application now includes comprehensive import and export functionality for mindmap configurations. This feature allows users to save their work, share mindmaps with others, and backup their data.

## Features

### 🔄 Export Configuration
- **Full Configuration Export**: Export all nodes, edges, and metadata as a JSON file
- **Custom Metadata**: Add title and description to exported files
- **Automatic Filename**: Generated based on title and export date
- **Structured Format**: Clean, readable JSON format for easy sharing

### 📥 Import Configuration
- **File Validation**: Comprehensive validation of imported JSON files
- **Error Handling**: Clear error messages for invalid files
- **Data Integrity**: Ensures all required properties are present
- **Seamless Integration**: Imported data replaces current mindmap

### 🎯 Sample Templates
- **Quick Start**: Load a pre-configured sample mindmap
- **Learning Tool**: Demonstrates best practices for mindmap structure
- **Template Base**: Use as starting point for new projects

## How to Use

### Accessing the Feature
1. Look for the floating action button (⋮) in the bottom-right corner of the mindmap
2. Click the button to open the import/export menu

### Exporting a MindMap
1. Click the floating action button
2. Select "Export Configuration"
3. Enter a title for your mindmap (optional)
4. Add a description (optional)
5. Click "Export" to download the JSON file

### Importing a MindMap
1. Click the floating action button
2. Select "Import Configuration"
3. Choose a previously exported JSON file
4. The mindmap will be loaded automatically

### Loading a Sample
1. Click the floating action button
2. Select "Load Sample MindMap"
3. A pre-configured sample will be loaded

## File Format

The exported JSON file contains:

```json
{
  "nodes": [
    {
      "id": "unique-id",
      "data": {
        "label": "Node Title",
        "description": "Node Description",
        "startDate": "YYYY-MM-DD",
        "endDate": "YYYY-MM-DD"
      },
      "position": { "x": 100, "y": 200 },
      "type": "default"
    }
  ],
  "edges": [
    {
      "id": "edge-id",
      "source": "source-node-id",
      "target": "target-node-id"
    }
  ],
  "metadata": {
    "exportDate": "2024-01-01T12:00:00.000Z",
    "version": "1.0.0",
    "title": "My MindMap",
    "description": "Description of the mindmap"
  }
}
```

## Benefits

- **Data Persistence**: Save your work for later use
- **Collaboration**: Share mindmaps with team members
- **Backup**: Protect against data loss
- **Version Control**: Keep multiple versions of your mindmaps
- **Migration**: Move mindmaps between different environments

## Technical Implementation

- **Utility Functions**: Centralized import/export logic in `src/utils/mindmapConfig.ts`
- **Error Handling**: Comprehensive validation and user feedback
- **File Management**: Browser-based file download and upload
- **State Management**: Seamless integration with React state
- **UI Components**: Material-UI components for consistent design

## Future Enhancements

- Support for additional file formats (XML, CSV)
- Batch import/export of multiple mindmaps
- Cloud storage integration
- Version history tracking
- Collaborative editing features

