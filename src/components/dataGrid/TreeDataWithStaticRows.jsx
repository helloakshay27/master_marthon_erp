


import React, { useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box, Typography } from '@mui/material';

const data = [
  {
    id: '1',
    firstName: 'Dylan',
    middleName: 'Sprouse',
    lastName: 'Murray',
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
    country: 'United States',
  },
];

const TreeDataWithStaticRows = () => {
  const columns = useMemo(
    () => [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'firstName', header: 'First Name' },
      { accessorKey: 'lastName', header: 'Last Name' },
    ],
    []
  );

  return (
    <MaterialReactTable
      data={data}
      columns={columns}
      enableRowExpansion
      muiExpandButtonProps={({ row, table }) => ({
        onClick: () => {
          const expanded = { ...table.getExpanded() };
          Object.keys(expanded).forEach((key) => (expanded[key] = false));
          expanded[row.id] = !row.getIsExpanded();
          table.setExpanded(expanded);
        },
        sx: {
          transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
          transition: 'transform 0.2s',
        },
      })}
      renderDetailPanel={({ row }) =>
        row.original.address ? (
          <Box
            sx={{
              display: 'grid',
              margin: 'auto',
              gridTemplateColumns: '1fr 1fr',
              width: '100%',
            }}
          >
            <Typography>Address: {row.original.address}</Typography>
            <Typography>City: {row.original.city}</Typography>
            <Typography>State: {row.original.state}</Typography>
            <Typography>Country: {row.original.country}</Typography>
          </Box>
        ) : null
      }
    />
  );
};

export default TreeDataWithStaticRows;


