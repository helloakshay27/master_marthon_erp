import React from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box, Typography } from '@mui/material';

// Data with nested rows (subRows)
const data = [
  {
    firstName: 'Dylan',
    lastName: 'Murray',
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
    subRows: [
      {
        firstName: 'Ervin',
        lastName: 'Reinger',
        address: '566 Brakus Inlet',
        city: 'South Linda',
        state: 'West Virginia',
        subRows: [
          {
            firstName: 'Jordane',
            lastName: 'Homenick',
            address: '1234 Brakus Inlet',
            city: 'South Linda',
            state: 'West Virginia',
          },
        ],
      },
      {
        firstName: 'Brittany',
        lastName: 'McCullough',
        address: '722 Emie Stream',
        city: 'Lincoln',
        state: 'Nebraska',
      },
    ],
  },
  {
    firstName: 'Raquel',
    lastName: 'Kohler',
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio',
    subRows: [
      {
        firstName: 'Branson',
        lastName: 'Frami',
        address: '32188 Larkin Turnpike',
        city: 'Charleston',
        state: 'South Carolina',
      },
    ],
  },
];

// Table columns configuration
const columns = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'address', header: 'Address' },
  { accessorKey: 'city', header: 'City' },
  { accessorKey: 'state', header: 'State' },
];

// Detail Panel component for the last level rows
const DetailPanel = ({ row }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%' }}>
    <Typography>Address: {row.original.address}</Typography>
    <Typography>City: {row.original.city}</Typography>
    <Typography>State: {row.original.state}</Typography>
  </Box>
);

const TreeDataTable = () => {
  return (
    <div className="tbl-container px-0 mt-3">
      <style>
        {`
          .tbl-container td {
            padding: 0px 1rem !important;
          }
        `}
      </style>
      <MaterialReactTable
        columns={columns}
        data={data}
        enableExpanding={true}
        getSubRows={(row) => row.subRows} // Handle child rows
        renderDetailPanel={({ row }) =>
          row.original.subRows ? null : <DetailPanel row={row} /> // Show detail only for last level rows
        }
      />
    </div>
  );
};

export default TreeDataTable;
