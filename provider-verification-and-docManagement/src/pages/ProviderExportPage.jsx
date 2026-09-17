
import React, { useState } from "react";

import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";

import axiosInstance from "../utils/axiosInstance";

import CommonButton from "../components/CommonButton";


function ProviderExportPage() {

  const [loading, setLoading] =
    useState("");

  const [error, setError] =
    useState("");


  const downloadFile = async (
    format
  ) => {

    try {

      setLoading(format);

      setError("");


      /*
       * Call export API
       *
       * axiosInstance automatically adds:
       *
       * Authorization: Bearer <JWT>
       *
       * using the Axios interceptor.
       */

      const response =
        await axiosInstance.get(
          `/api/admin/export/${format}`,
          {
            responseType: "blob",
          }
        );


      /*
       * Create Blob
       */

      const blob =
        new Blob(
          [response.data],
          {
            type:
              format === "pdf"
                ? "application/pdf"
                : "text/csv",
          }
        );


      /*
       * Create temporary URL
       */

      const url =
        window.URL.createObjectURL(
          blob
        );


      /*
       * Create download link
       */

      const link =
        document.createElement("a");


      link.href = url;


      /*
       * Set downloaded filename
       */

      link.download =
        format === "pdf"
          ? "providers.pdf"
          : "providers.csv";


      document.body.appendChild(link);


      /*
       * Start download
       */

      link.click();


      /*
       * Remove temporary link
       */

      link.remove();


      /*
       * Release Blob URL
       */

      window.URL.revokeObjectURL(
        url
      );

    } catch (error) {

      console.error(
        "Export failed:",
        error
      );


      setError(
        `Unable to download ${format.toUpperCase()} file`
      );

    } finally {

      setLoading("");

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

        display: "flex",

        alignItems: "center",

        justifyContent: "center",
      }}
    >

      <Paper
        elevation={0}
        sx={{
          width: "100%",

          maxWidth: 850,

          p: {
            xs: 3,
            sm: 5,
          },

          borderRadius: 4,

          boxShadow:
            "0 24px 70px rgba(24, 67, 88, 0.14)",
        }}
      >

        <Typography
          variant="overline"
          sx={{
            color: "#19768f",

            fontWeight: 800,

            letterSpacing: 1.2,
          }}
        >
          Provider Reports
        </Typography>


        <Typography
          variant="h4"
          sx={{
            mt: 0.5,

            color: "#123b4a",

            fontWeight: 800,
          }}
        >
          Export Provider Data
        </Typography>


        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mt: 1,

            mb: 4,
          }}
        >
          Download provider information in
          your preferred format.
        </Typography>


        {error && (

          <Alert
            severity="error"
            sx={{
              mb: 3,
            }}
          >
            {error}
          </Alert>

        )}


        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
            },

            gap: 2,
          }}
        >

          {/* ========================= */}
          {/* PDF */}
          {/* ========================= */}

          <Paper
            elevation={0}
            sx={{
              p: 3,

              borderRadius: 3,

              border:
                "1px solid rgba(24, 91, 117, 0.1)",

              backgroundColor:
                "#f8fcff",
            }}
          >

            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                gap: 1.5,

                mb: 1,
              }}
            >

              <PictureAsPdfIcon
                sx={{
                  fontSize: 32,

                  color: "#d32f2f",
                }}
              />


              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,

                  color: "#123b4a",
                }}
              >
                PDF
              </Typography>

            </Box>


            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2.5,
              }}
            >
              Download the provider data as a
              formatted PDF report.
            </Typography>


            <CommonButton
              text={
                loading === "pdf"
                  ? "Downloading..."
                  : "Download PDF"
              }

              onClick={() =>
                downloadFile("pdf")
              }

              disabled={
                loading !== ""
              }

              startIcon={
                loading === "pdf" ? (

                  <CircularProgress
                    size={20}
                    color="inherit"
                  />

                ) : (

                  <PictureAsPdfIcon />

                )
              }

              sx={{
                py: 1.3,

                borderRadius: 2,
              }}
            />

          </Paper>


          {/* ========================= */}
          {/* CSV */}
          {/* ========================= */}

          <Paper
            elevation={0}
            sx={{
              p: 3,

              borderRadius: 3,

              border:
                "1px solid rgba(24, 91, 117, 0.1)",

              backgroundColor:
                "#f8fcff",
            }}
          >

            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                gap: 1.5,

                mb: 1,
              }}
            >

              <TableChartIcon
                sx={{
                  fontSize: 32,

                  color: "#2e7d32",
                }}
              />


              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,

                  color: "#123b4a",
                }}
              >
                CSV
              </Typography>

            </Box>


            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2.5,
              }}
            >
              Download provider data as a CSV
              file for spreadsheets.
            </Typography>


            <CommonButton
              text={
                loading === "csv"
                  ? "Downloading..."
                  : "Download CSV"
              }

              onClick={() =>
                downloadFile("csv")
              }

              disabled={
                loading !== ""
              }

              startIcon={
                loading === "csv" ? (

                  <CircularProgress
                    size={20}
                    color="inherit"
                  />

                ) : (

                  <TableChartIcon />

                )
              }

              sx={{
                py: 1.3,

                borderRadius: 2,
              }}
            />

          </Paper>

        </Box>

      </Paper>

    </Box>
  );
}

export default ProviderExportPage;

