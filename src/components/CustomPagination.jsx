import React from "react";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

const CustomPagination = ({
  totalEntries,
  page,
  pageSize,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
}) => {
  const totalPages = Math.ceil(totalEntries / pageSize);
  const startEntry = (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, totalEntries);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      padding={2}
    >
      {/* Pagination Component */}
      <Pagination
        count={totalPages}
        page={page}
        onChange={(event, value) => onPageChange(value)}
        siblingCount={siblingCount}
        boundaryCount={boundaryCount}
        showFirstButton
        showLastButton
        color="#8B0203"
      />

      {/* Dynamic Entries Info */}
      <Typography variant="body2">
        Showing {startEntry} to {endEntry} of {totalEntries} entries
      </Typography>
    </Stack>
  );
};

export default CustomPagination;
