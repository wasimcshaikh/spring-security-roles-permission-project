import React from "react";

import {
  Box,
  Button,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

import CommonTable from "./CommonTable";


function DocumentTable({
  documents,
  onOpen,
  onDelete,
}) {

  const columns = [
    {
      field: "fileName",
      headerName: "File Name",
    },
    {
      field: "fileSize",
      headerName: "File Size",
    },
    {
      field: "uploadedAt",
      headerName: "Uploaded At",
    },
  ];


  return (
    <CommonTable
      columns={columns}
      rows={documents}
      actions={(document) => (

        <Box
          sx={{
            display: "flex",
            gap: 1,
          }}
        >

          <Button
            variant="outlined"
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={() =>
              onOpen(document)
            }
          >
            Open
          </Button>


          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() =>
              onDelete(document)
            }
          >
            Delete
          </Button>

        </Box>

      )}
    />
  );
}

export default DocumentTable;