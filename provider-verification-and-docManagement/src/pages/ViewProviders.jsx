import React, { useEffect, useState } from "react";

import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";

import CommonTable from "../components/CommonTable";
import axiosInstance from "../utils/axiosInstance";

function ViewProviders() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Table columns
   *
   * field -> must match the API response property
   * headerName -> displayed table heading
   */
  const columns = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "fullName",
      headerName: "Full Name",
    },
    {
      field: "email",
      headerName: "Email",
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
    },
    {
      field: "role",
      headerName: "Role",
    },
    // {
    //   field: "verified",
    //   headerName: "Verification Status",
    // },
  ];

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(
        "/api/providers"
      );

      setProviders(response.data);
    } catch (error) {
      console.error(
        "Error fetching providers:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to fetch providers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  return (
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
          View Providers
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
        >
          View all registered providers in MediSlot.
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
        <>
          <Box sx={{ display: { xs: "none", lg: "block" } }}>
            <CommonTable
              columns={columns}
              rows={providers}
              emptyMessage="No providers found"
              rowKey="id"
              compact
            />
          </Box>

          <Box
            sx={{
              display: { xs: "grid", lg: "none" },
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
              },
              gap: 1.25,
            }}
          >
            {providers.length === 0 ? (
              <Typography
                align="center"
                color="text.secondary"
                sx={{ py: 3, gridColumn: "1 / -1" }}
              >
                No providers found
              </Typography>
            ) : (
              providers.map((provider) => (
                <Paper
                  key={provider.id}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    border: "1px solid rgba(24, 91, 117, 0.1)",
                    borderRadius: 1,
                    minWidth: 0,
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
                    {provider.fullName || "Provider"}
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 1,
                    }}
                  >
                    {[
                      ["ID", provider.id],
                      ["Email", provider.email],
                      ["Phone Number", provider.phoneNumber],
                      ["Role", provider.role],
                    ].map(([label, value]) => (
                      <Box key={label} sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="text.secondary">
                          {label}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ overflowWrap: "anywhere" }}
                        >
                          {value ?? "—"}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              ))
            )}
          </Box>
        </>
      )}
    </Box>
  );
}

export default ViewProviders;