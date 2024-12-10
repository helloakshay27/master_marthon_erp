

import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

const initialData = [
  { id: 1, name: "Parent 1", level: 0, expanded: false },
  { id: 2, name: "Child 1.1", level: 1, parentId: 1 },
  { id: 3, name: "Child 1.2", level: 1, parentId: 1 },
  { id: 4, name: "Parent 2", level: 0, expanded: false },
  { id: 5, name: "Child 2.1", level: 1, parentId: 4 },
];

const TreeDataWithStaticRows = () => {
  const [rows, setRows] = useState(initialData);

  const handleToggle = (id) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, expanded: !row.expanded } : row
      )
    );
  };

  const getVisibleRows = () => {
    const visibleRows = [];
    const parents = {};

    rows.forEach((row) => {
      // Always add top-level rows
      if (!row.parentId || parents[row.parentId]?.expanded) {
        visibleRows.push(row);
        // Keep track of parents for child visibility
        if (!row.parentId) {
          parents[row.id] = row;
        }
      }
    });

    return visibleRows;
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 300,
      renderCell: (params) => {
        const row = params.row;
        const isExpandable = rows.some((r) => r.parentId === row.id);

        return (
          <div
            style={{
              paddingLeft: `${row.level * 20}px`,
              display: "flex",
              alignItems: "center",
            }}
          >
            {isExpandable && (
              <button
                onClick={() => handleToggle(row.id)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  marginRight: "8px",
                }}
              >
                {row.expanded ? "-" : "+"}
              </button>
            )}
            {params.value}
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={getVisibleRows()}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
  );
};

export default TreeDataWithStaticRows;
