import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AnalyticsChart = ({ data, onBarClick }) => {
  return (
    <div className="bg-white p-4 rounded shadow border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Revenue by Category (Click to Filter)</h3>
      
      <div className="h-72 w-full"> 
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
              cursor={{fill: 'transparent'}}
            />
            <Bar dataKey="total" onClick={onBarClick} cursor="pointer">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#4F46E5" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;