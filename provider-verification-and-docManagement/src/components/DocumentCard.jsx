import { Box, Button, Paper, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

function DocumentCard({ document, onOpen, onDelete }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        border: "2px solid rgba(30, 111, 161, 0.1)",
        borderRadius: 1,
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          mb: 1.25,
          color: "#123b4a",
          fontWeight: 700,
          overflowWrap: "anywhere",
        }}
      >
        {document.fileName}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1,
          mb: 1.5,
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary">
            File size
          </Typography>
          <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>
            {document.fileSize}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Uploaded
          </Typography>
          <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>
            {document.uploadedAt}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 1,
        }}
      >
        <Button
          variant="outlined"
          size="small"
          startIcon={<VisibilityIcon />}
          onClick={() => onOpen(document)}
          sx={{
            minWidth: 0,
            minHeight: 32,
            px: 0.75,
            py: 0.25,
            fontSize: "0.75rem",
            whiteSpace: "nowrap",
            "& .MuiButton-startIcon": { mr: 0.5, ml: 0 },
            "& .MuiSvgIcon-root": { fontSize: 17 },
          }}
        >
          Open
        </Button>
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(document)}
          sx={{
            minWidth: 0,
            minHeight: 32,
            px: 0.75,
            py: 0.25,
            fontSize: "0.75rem",
            whiteSpace: "nowrap",
            "& .MuiButton-startIcon": { mr: 0.5, ml: 0 },
            "& .MuiSvgIcon-root": { fontSize: 17 },
          }}
        >
          Delete
        </Button>
      </Box>
    </Paper>
  );
}

export default DocumentCard;