import React, { useEffect, useState } from "react";

import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

import RoleCountPieChart from "./RoleCountPieChart";

import { getProviderCountsByRole } from "../services/providerService";

function AdminRoleStatistics() {

  const [roleCounts, setRoleCounts] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {

    const loadRoleCounts = async () => {

      try {

        setLoading(true);
        setError("");

        const data =
          await getProviderCountsByRole();

        console.log(
          "Role counts:",
          data
        );

        setRoleCounts(data);

      } catch (error) {

        console.error(
          "Failed to load role counts:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to load role counts"
        );

      } finally {

        setLoading(false);

      }
    };

    loadRoleCounts();

  }, []);

  if (loading) {

    return (
      <Paper
        sx={{
          mt: 3,
          p: 3,
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 5,
          }}
        >
          <CircularProgress />
        </Box>
      </Paper>
    );

  }

  if (error) {

    return (
      <Alert
        severity="error"
        sx={{ mt: 3 }}
      >
        {error}
      </Alert>
    );

  }

  if (!roleCounts) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 3,
        p: {
          xs: 2,
          sm: 3,
        },
        borderRadius: 3,
      }}
    >

      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 2,
        }}
      >
        Users by Role
      </Typography>

      <RoleCountPieChart
        roleCounts={roleCounts}
      />

    </Paper>
  );
}

export default AdminRoleStatistics;