import React, { useEffect, useState } from "react";

import {
  Box,
  Typography,
  CircularProgress,
  Alert,
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
        <CommonTable
          columns={columns}
          rows={providers}
          emptyMessage="No providers found"
        />
      )}
    </Box>
  );
}

export default ViewProviders;