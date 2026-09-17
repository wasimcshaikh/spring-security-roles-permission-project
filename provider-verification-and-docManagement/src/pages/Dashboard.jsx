
import React, { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import axiosInstance from "../utils/axiosInstance";

import CommonButton from "../components/CommonButton";
import CommonFormDialog from "../components/CommonFormDialog";
import DocumentTable from "../components/DocumentTable";
import PdfViewer from "../components/PdfViewer";

import documentFields from "../config/documentFields";


function DashboardPage() {

  /*
   * Get logged-in provider
   */

  const provider =
    JSON.parse(sessionStorage.getItem("provider"));


  /*
   * Upload dialog
   */

  const [openUploadDialog, setOpenUploadDialog] =
    useState(false);


  /*
   * Upload form
   */

  const [formData, setFormData] = useState({
    file: null,
  });


  /*
   * Upload error
   */

  const [error, setError] = useState("");


  /*
   * Success message
   */

  const [success, setSuccess] = useState("");


  /*
   * Upload loading
   */

  const [loading, setLoading] = useState(false);


  /*
   * Documents
   */

  const [documents, setDocuments] = useState([]);


  /*
   * Whether documents table
   * should be displayed
   */

  const [showDocuments, setShowDocuments] =
    useState(false);


  /*
   * Documents loading
   */

  const [documentsLoading, setDocumentsLoading] =
    useState(false);


  /*
   * Documents error
   */

  const [documentsError, setDocumentsError] =
    useState("");


  /*
   * Used to trigger document
   * refresh after delete/upload.
   */

  const [refreshDocuments, setRefreshDocuments] =
    useState(0);


  /*
   * Selected document
   *
   * Used when opening a PDF.
   */

  const [selectedDocument, setSelectedDocument] =
    useState(null);


  /*
   * PDF dialog
   */

  const [openPdfDialog, setOpenPdfDialog] =
    useState(false);


  /*
   * Handle form field change
   */

  const handleChange = (event) => {

    const {
      name,
      value,
      files,
    } = event.target;

    setFormData((previousData) => ({
      ...previousData,

      [name]: files
        ? files[0]
        : value,
    }));

    setError("");
  };


  /*
   * Open upload dialog
   */

  const handleOpenUploadDialog = () => {

    setError("");

    setSuccess("");

    setFormData({
      file: null,
    });

    setOpenUploadDialog(true);
  };


  /*
   * Close upload dialog
   */

  const handleCloseUploadDialog = () => {

    if (loading) {
      return;
    }

    setOpenUploadDialog(false);

    setError("");
  };


  /*
   * Upload PDF
   */

  const handleUpload = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");


    /*
     * Validate file
     */

    if (!formData.file) {

      setError(
        "Please select a PDF file"
      );

      return;
    }


    /*
     * Validate provider
     */

    if (!provider) {

      setError(
        "Provider information not found. Please login again."
      );

      return;
    }


    try {

      setLoading(true);


      /*
       * Create multipart FormData
       */

      const uploadData = new FormData();

      uploadData.append(
        "providerId",
        provider.id
      );

      uploadData.append(
        "file",
        formData.file
      );


      /*
       * Call upload API
       *
       * JWT is automatically added
       * by axiosInstance interceptor.
       */

      await axiosInstance.post(
        "/api/providers/documents",
        uploadData
      );


      /*
       * Show success message
       */

      setSuccess(
        "Document uploaded successfully"
      );


      /*
       * Reset upload form
       */

      setFormData({
        file: null,
      });


      /*
       * Close upload dialog
       */

      setOpenUploadDialog(false);


      /*
       * If documents are currently
       * visible, refresh them.
       */

      if (showDocuments) {

        setRefreshDocuments(
          (previousValue) =>
            previousValue + 1
        );
      }

    } catch (error) {

      if (error.response) {

        setError(
          error.response.data
        );

      } else {

        setError(
          "Unable to connect to server"
        );
      }

    } finally {

      setLoading(false);
    }
  };


  /*
   * View My Documents
   *
   * This only controls whether
   * the document section is visible.
   *
   * The actual GET API is handled
   * inside useEffect().
   */

  const handleViewDocuments = () => {

    console.log("showDocuments clicked");

    if (!provider) {

      setDocumentsError(
        "Provider information not found. Please login again."
      );

      return;
    }

       setShowDocuments (
      !showDocuments
    );
  };


  /*
   * Fetch documents
   *
   * This useEffect runs when:
   *
   * 1. showDocuments changes
   * 2. refreshDocuments changes
   *
   * Therefore:
   *
   * View documents
   *       ↓
   * GET API
   *
   * Delete document
   *       ↓
   * refreshDocuments changes
   *       ↓
   * GET API again
   */

  useEffect(() => {

    /*
     * Don't call API while
     * documents section is hidden.
     */

    if (!showDocuments) {
      return;
    }


    /*
     * Don't call API if provider
     * information doesn't exist.
     */

    if (!provider) {
      return;
    }


    const fetchDocuments = async () => {

      try {

        setDocumentsLoading(true);

        setDocumentsError("");


        /*
         * GET all documents
         *
         * JWT is automatically added
         * by axiosInstance interceptor.
         */

        const response =
          await axiosInstance.get(
            `/api/providers/documents/provider/${provider.id}`
          );


        /*
         * Store API response
         */

        setDocuments(
          response.data
        );

      } catch (error) {

        console.error(
          "Unable to fetch documents",
          error
        );


        if (error.response) {

          setDocumentsError(
            error.response.data
          );

        } else {

          setDocumentsError(
            "Unable to connect to server"
          );
        }

      } finally {

        setDocumentsLoading(false);
      }
    };


    fetchDocuments();

  }, [
    showDocuments,
    refreshDocuments,
  ]);


  /*
   * Open specific document
   */

  const handleOpenDocument = (
    document
  ) => {

    /*
     * Store selected document
     */

    setSelectedDocument(
      document
    );


    /*
     * Open PDF dialog
     */

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
   * Delete document
   */

  const handleDeleteDocument = async (
    document
  ) => {

    /*
     * Validate provider
     */

    if (!provider) {

      setError(
        "Provider information not found. Please login again."
      );

      return;
    }


    try {

      setError("");
      setSuccess("");


      /*
       * Call DELETE API
       *
       * DELETE
       * /documents/{documentId}
       *
       * ?providerId={providerId}
       *
       * JWT is automatically added
       * by axiosInstance interceptor.
       */

      await axiosInstance.delete(
        `/api/providers/documents/${document.id}`,
        {
          params: {
            providerId: provider.id,
          },
        }
      );


      /*
       * Don't manually remove the
       * document using filter().
       *
       * Instead, trigger the GET API
       * again using useEffect().
       */

      setRefreshDocuments(
        (previousValue) =>
          previousValue + 1
      );


      /*
       * Show success message
       */

      setSuccess(
        "Document deleted successfully"
      );

    } catch (error) {

      console.error(
        "Error deleting document:",
        error
      );


      if (error.response) {

        setError(
          error.response.data
        );

      } else {

        setError(
          "Unable to connect to server"
        );
      }
    }
  };


  return (

    <Box
      sx={{
        minHeight: "100vh",

        background: "#123b4a",

        p: {
          xs: 2,
          sm: 4,
        },
      }}
    >

      <Paper
        elevation={0}
        sx={{
          maxWidth: 1000,
          mx: "auto",

          p: {
            xs: 2,
            sm: 3,
          },

          borderRadius: 4,

          border: "1px solid #123b4a",

          boxShadow:
            "0 24px 70px rgba(24, 67, 88, 0.14)",
        }}
      >

        {/* Dashboard information */}

        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2.5,
              sm: 4,
            },

            borderRadius: 3,
          }}
        >

          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                sm: "1.2fr 0.8fr",
              },

              gap: 2,
            }}
          >

            <Box
              sx={{
                p: {
                  xs: 2,
                  sm: 3,
                },

                borderRadius: 2.5,

                backgroundColor:
                  "#ffffff",

                border:
                  "1px solid rgba(24, 91, 117, 0.1)",
              }}
            >

              <Typography
                variant="overline"
                sx={{
                  fontWeight: 800,
                  letterSpacing: 1.2,
                }}
              >
                Provider portal
              </Typography>


              <Typography
                variant="h4"
                sx={{
                  mt: 0.5,
                  color: "#123b4a",
                  fontWeight: 800,
                  lineHeight: 1.15,
                }}
              >
                Welcome,{" "}
                {provider?.fullName ||
                  "Provider"}
              </Typography>

            </Box>


            <Box
              sx={{
                p: {
                  xs: 2,
                  sm: 3,
                },

                borderRadius: 2.5,

                backgroundColor:
                  "#ffffff",

                border:
                  "1px solid rgba(24, 91, 117, 0.1)",

                display: "flex",

                flexDirection: "column",

                justifyContent: "center",
              }}
            >

              <Typography
                variant="h6"
                sx={{
                  color: "#123b4a",
                  fontWeight: 800,
                }}
              >
                Provider Dashboard
              </Typography>


              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.75,
                }}
              >
                Manage your verification
                documents in one place.
              </Typography>

            </Box>

          </Box>

        </Paper>


        {/* Success */}

        {success && (

          <Alert
            severity="success"
            sx={{
              mt: 2,
            }}
          >
            {success}
          </Alert>

        )}


        {/* Dashboard actions */}

        <Paper
          elevation={0}
          sx={{
            mt: 2,

            p: {
              xs: 2.5,
              sm: 3,
            },

            borderRadius: 3,

            backgroundColor:
              "#ffffff",

            border:
              "1px solid rgba(24, 91, 117, 0.1)",
          }}
        >

          <Typography
            variant="subtitle1"
            sx={{
              mb: 1.5,
              color: "#123b4a",
              fontWeight: 800,
            }}
          >
            Document actions
          </Typography>


          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },

              gap: 1.5,
            }}
          >

            <CommonButton
              text="Upload Document"
              onClick={
                handleOpenUploadDialog
              }
              sx={{
                py: 1.4,
              }}
            />


            <CommonButton
              text={
                documentsLoading
                  ? "Loading Documents..."
                  : "View My Documents"
              }
              variant="outlined"
              onClick={
                handleViewDocuments
              }
              disabled={
                documentsLoading
              }
              sx={{
                py: 1.4,
              }}
            />

          </Box>

        </Paper>


        {/* Documents error */}

        {documentsError && (

          <Alert
            severity="error"
            sx={{
              mt: 2,
            }}
          >
            {documentsError}
          </Alert>

        )}


        {/* Documents table */}

        {showDocuments && (

          <Paper
            elevation={0}
            sx={{
              mt: 2,

              p: {
                xs: 2.5,
                sm: 3,
              },

              borderRadius: 3,

              backgroundColor:
                "#ffffff",

              border:
                "1px solid rgba(24, 91, 117, 0.1)",
            }}
          >

            <Typography
              variant="subtitle1"
              sx={{
                mb: 2,
                color: "#123b4a",
                fontWeight: 800,
              }}
            >
              My Documents
            </Typography>


            <DocumentTable
              documents={documents}
              onOpen={
                handleOpenDocument
              }
              onDelete={
                handleDeleteDocument
              }
            />

          </Paper>

        )}

      </Paper>


      {/* Upload Dialog */}

      <CommonFormDialog
        open={openUploadDialog}
        title="Upload PDF Document"
        onClose={
          handleCloseUploadDialog
        }
        fields={documentFields}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleUpload}
        error={error}
        loading={loading}
        submitText="Upload Document"
        loadingText="Uploading..."
      />


      {/* PDF Viewer Dialog */}

      <Dialog
        open={openPdfDialog}
        onClose={
          handleClosePdfDialog
        }
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
            onClick={
              handleClosePdfDialog
            }
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
                selectedDocument.id
              }
              providerId={
                provider.id
              }
            />

          )}

        </DialogContent>

      </Dialog>

    </Box>
  );
}

export default DashboardPage;

