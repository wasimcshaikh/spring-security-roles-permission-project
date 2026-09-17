import React, { useEffect, useState } from "react";

import {
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";

import axios from "axios";
import axiosInstance from "../utils/axiosInstance";


function PdfViewer({
  documentId,
  providerId,
}) {

  const [pdfUrl, setPdfUrl] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    let objectUrl = null;


    const fetchPdf = async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await axiosInstance.get(
            `api/providers/documents/${documentId}`,
            {
              params: {
                providerId: providerId,
              },

              responseType: "blob",
            }
          );


        objectUrl =
          URL.createObjectURL(
            response.data
          );

        setPdfUrl(objectUrl);

      } catch (error) {

        console.error(
          "Unable to load PDF",
          error
        );

        setError(
          "Unable to load document"
        );

      } finally {

        setLoading(false);

      }
    };


    if (documentId && providerId) {
      fetchPdf();
    }


    return () => {

      if (objectUrl) {

        URL.revokeObjectURL(
          objectUrl
        );

      }

    };

  }, [
    documentId,
    providerId,
  ]);


  if (loading) {

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );

  }


  if (error) {

    return (
      <Alert severity="error">
        {error}
      </Alert>
    );

  }


  return (
    <Box
      sx={{
        width: "100%",
        height: "70vh",
      }}
    >

      {pdfUrl && (
        <iframe
          src={pdfUrl}
          title="PDF Document"
          width="100%"
          height="100%"
          style={{
            border: "none",
          }}
        />
      )}

    </Box>
  );
}


export default PdfViewer;