import {
  Box,
  Button,
  Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

import CommonTable from "./CommonTable";
import DocumentCard from "./DocumentCard";

const actionButtonSx = {
  minWidth: 0,
  minHeight: { xs: 32, sm: 30 },
  px: { xs: 0.75, sm: 0.5 },
  py: 0.25,
  fontSize: { xs: "0.75rem", sm: "0.7rem" },
  whiteSpace: "nowrap",
  "& .MuiButton-startIcon": {
    mr: 0.5,
    ml: 0,
  },
  "& .MuiSvgIcon-root": {
    fontSize: { xs: 17, sm: 16 },
  },
};


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
    <>
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <CommonTable
          columns={columns}
          rows={documents}
          compact
          actions={(document) => (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Button
                variant="outlined"
                size="small"
                startIcon={<VisibilityIcon />}
                onClick={() => onOpen(document)}
                sx={actionButtonSx}
              >
                Open
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => onDelete(document)}
                sx={actionButtonSx}
              >
                Delete
              </Button>
            </Box>
          )}
        />
      </Box>

      <Box
        sx={{
          display: { xs: "grid", sm: "none" },
          gap: 1.25,
        }}
      >
        {documents.length === 0 ? (
          <Typography
            align="center"
            color="text.secondary"
            sx={{ py: 3 }}
          >
            No records found
          </Typography>
        ) : (
          documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onOpen={onOpen}
              onDelete={onDelete}
            />
          ))
        )}
      </Box>
    </>
  );
}

export default DocumentTable;