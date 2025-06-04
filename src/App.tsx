// mindmap-timeline-app: MVP Setup
// Stack: React + TypeScript + Redux Toolkit + react-flow for MindMap

import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
// import { mindMapReducer } from './store/mindMapSlice';
import MindMap from './components/MindMap';
// import TimelineView from './components/TimelineView';

const store = configureStore({
  reducer: {
    // mindMap: mindMapReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const App: React.FC = () => {
  // Removed unused view state for now
  // const [view, setView] = React.useState<'map' | 'timeline'>('map');

  return (
    <Provider store={store}>
      <div className="w-screen h-screen p-4">
        <div className="mb-4">
          <button className="mr-2">
            🧠 MindMap
          </button>
          <button>📅 Timeline</button>
        </div>
        <MindMap />
      </div>
    </Provider>
  );
};

export default App;
