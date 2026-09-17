import React from "react";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

function CommonTable({
  columns,
  rows,
  actions,
  emptyMessage = "No records found",
  rowKey = "id",
}) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid rgba(24, 91, 117, 0.1)",
        overflow: "hidden",
      }}
    >
      <Table>

        {/* Table Header */}
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: "#e7f5ff",
            }}
          >
            {columns.map((column) => (
              <TableCell
                key={column.field}
                sx={{
                  fontWeight: 800,
                  color: "#123b4a",
                }}
              >
                {column.headerName}
              </TableCell>
            ))}

            {actions && (
              <TableCell
                sx={{
                  fontWeight: 800,
                  color: "#123b4a",
                }}
              >
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>

          {rows.length === 0 ? (

            <TableRow>
              <TableCell
                colSpan={
                  columns.length +
                  (actions ? 1 : 0)
                }
                align="center"
                sx={{
                  py: 4,
                }}
              >
                <Typography
                  color="text.secondary"
                >
                  {emptyMessage}
                </Typography>
              </TableCell>
            </TableRow>

          ) : (

            rows.map((row) => (

              <TableRow
                key={row[rowKey]}
                hover
              >

                {columns.map((column) => (

                  <TableCell
                    key={column.field}
                  >
                    {row[column.field]}
                  </TableCell>

                ))}

                {actions && (
                  <TableCell>
                    {actions(row)}
                  </TableCell>
                )}

              </TableRow>

            ))

          )}

        </TableBody>

      </Table>
    </TableContainer>
  );
}

export default CommonTable;