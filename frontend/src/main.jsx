import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// --- NEW IMPORTS FOR AG GRID V33+ ---
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'; 

// Register the modules globally
ModuleRegistry.registerModules([ AllCommunityModule ]);
// ------------------------------------

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)