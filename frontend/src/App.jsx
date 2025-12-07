import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import AnalyticsChart from './components/AnalyticsChart';
import DataGrid from './components/DataGrid';
import Skeleton from './components/Skeleton';

// Define Fetchers
const fetchStats = async () => {
  const { data } = await axios.get('http://localhost:8000/api/stats');
  return data;
};

const fetchSales = async ({ queryKey }) => {
  const [_, category] = queryKey;
  const params = { limit: 1000 };
  if (category) params.category = category;
  
  const { data } = await axios.get('http://localhost:8000/api/sales', { params });
  return data.data;
};

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 1. React Query for Stats (Cached, Auto-refetching)
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
  });

  // 2. React Query for Grid Data (Depends on selectedCategory)
  const { data: gridData, isLoading: gridLoading } = useQuery({
    queryKey: ['sales', selectedCategory],
    queryFn: fetchSales,
    keepPreviousData: true, // Prevents UI flickering while new data loads!
  });

  const handleChartClick = (data) => {
    if (data && data.activePayload) {
      const category = data.activePayload[0].payload.category;
      setSelectedCategory(prev => prev === category ? null : category);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <header className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-slate-900">Lakehouse Viewer</h1>
        <p className="text-slate-600 mt-2">
          Powered by <span className="font-mono text-indigo-600">DuckDB (Parquet)</span> & <span className="font-mono text-indigo-600">React Query</span>
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Top: Visualization */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-800">Revenue Aggregation</h2>
            {selectedCategory && (
              <button 
                onClick={() => setSelectedCategory(null)}
                className="bg-red-100 text-red-700 text-sm px-3 py-1 rounded hover:bg-red-200 transition"
              >
                Clear Filter: {selectedCategory}
              </button>
            )}
          </div>
          
          {statsLoading ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <AnalyticsChart data={stats} onBarClick={handleChartClick} />
          )}
        </div>

        {/* Bottom: Grid */}
        <div className="w-full">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Raw Data Lake
            {gridData && <span className="text-sm text-slate-500 font-normal ml-2">({gridData.length} records fetched)</span>}
          </h2>
          
          <div className="bg-white p-1 rounded-lg shadow border border-gray-200 h-[500px]">
             {gridLoading ? (
               <div className="space-y-2 p-4">
                 <Skeleton className="h-8 w-full" />
                 <Skeleton className="h-8 w-full" />
                 <Skeleton className="h-8 w-full" />
                 <Skeleton className="h-8 w-full" />
                 <Skeleton className="h-8 w-full" />
               </div>
             ) : (
               <DataGrid rowData={gridData} />
             )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;