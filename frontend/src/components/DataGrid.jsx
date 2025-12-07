import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';

const DataGrid = ({ rowData }) => {
  // Define columns matching the Parquet/Backend keys
  const columnDefs = useMemo(() => [
    { field: "id", width: 90, filter: true },
    // FIXED: Changed 'product' to 'product_name'
    { field: "product_name", headerName: "Product", flex: 1, filter: true }, 
    { field: "category", width: 150, filter: true },
    { field: "region", width: 120, filter: true },
    // ADDED: Status column (since backend generates it)
    { 
      field: "status", 
      width: 120, 
      filter: true,
      cellStyle: params => ({
        color: params.value === 'Failed' ? 'red' : params.value === 'Completed' ? 'green' : 'orange'
      })
    }, 
    { field: "amount", width: 120, valueFormatter: p => `$${p.value}` },
    { field: "date", width: 150, sortable: true }
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true
  }), []);

  return (
    // Ensure "ag-theme-alpine" matches the import in main.jsx
    <div className="ag-theme-alpine w-full h-[500px]">
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={20}
        animateRows={true}
      />
    </div>
  );
};

export default DataGrid;