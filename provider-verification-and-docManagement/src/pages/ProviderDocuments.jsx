import React, { useEffect, useState } from "react";

import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";

import CommonTable from "../components/CommonTable";
import CommonButton from "../components/CommonButton";
import PdfViewer from "../components/PdfViewer";

import axiosInstance from "../utils/axiosInstance";

function ProviderDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedDocument, setSelectedDocument] =
    useState(null);

  const [openPdfDialog, setOpenPdfDialog] =
    useState(false);

  const columns = [
    {
      field: "documentId",
      headerName: "Document ID",
    },
    {
      field: "providerId",
      headerName: "Provider ID",
    },
    {
      field: "providerName",
      headerName: "Provider Name",
    },
    {
      field: "fileName",
      headerName: "Document File Name",
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

  const fetchProviderDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(
        "/api/providers/documents"
      );

      setDocuments(response.data);
    } catch (error) {
      console.error(
        "Error fetching provider documents:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to fetch provider documents"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderDocuments();
  }, []);

  /*
   * Open selected PDF
   */
  const handleOpenDocument = (document) => {
    setSelectedDocument(document);
    setOpenPdfDialog(true);
  };

  /*
   * Close PDF dialog
   */
  const handleClosePdfDialog = () => {
    setOpenPdfDialog(false);
    setSelectedDocument(null);
  };

  /*
   * Actions column
   */
  const actions = (document) => (
    <CommonButton
      text="Open"
      variant="outlined"
      color="primary"
      fullWidth={false}
      size="small"
      startIcon={<VisibilityIcon />}
      onClick={() =>
        handleOpenDocument(document)
      }
      sx={{
        whiteSpace: "nowrap",
      }}
    />
  );

  return (
    <>
      <Box
        sx={{
          minHeight: "calc(100vh - 72px)",
          backgroundColor: "#f8fafc",
          p: {
            xs: 2,
            sm: 3,
            md: 5,
          },
        }}
      >
        {/* Page Header */}

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#0f172a",
              mb: 1,
            }}
          >
            Provider Documents
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
          >
            View documents uploaded by registered
            providers.
          </Typography>
        </Box>

        {/* Error */}

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        {/* Loading */}

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <CommonTable
            columns={columns}
            rows={documents}
            actions={actions}
            emptyMessage="No provider documents found"
          />
        )}
      </Box>

      {/* PDF Viewer Dialog */}

      <Dialog
        open={openPdfDialog}
        onClose={handleClosePdfDialog}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: 700,
          }}
        >
          {selectedDocument?.fileName}

          <IconButton
            onClick={handleClosePdfDialog}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            p: 1,
          }}
        >
          {selectedDocument && (
            <PdfViewer
              documentId={
                selectedDocument.documentId
              }
              providerId={
                selectedDocument.providerId
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ProviderDocuments;