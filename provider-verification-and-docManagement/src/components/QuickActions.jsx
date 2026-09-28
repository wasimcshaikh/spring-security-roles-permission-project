import React, { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";

import ReactFusionCharts from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

import { getProviderCountsByRole } from "../services/providerService";

// Resolve the React FusionCharts component correctly for Vite
const ReactFC =
  ReactFusionCharts.default || ReactFusionCharts;

// Initialize FusionCharts
ReactFC.fcRoot(
  FusionCharts,
  Charts,
  FusionTheme
);

const QuickActions = () => {
  const [roleCounts, setRoleCounts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const provider = JSON.parse(
    sessionStorage.getItem("provider")
  );

  const isAdmin = provider?.role === "ADMIN";

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    const fetchRoleCounts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProviderCountsByRole();

        console.log("Role counts:", data);

        setRoleCounts(data);
      } catch (error) {
        console.error(
          "Failed to fetch role counts:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load role statistics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoleCounts();
  }, [isAdmin]);

  // Don't render anything for non-admin users
  if (!isAdmin) {
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          p: 2,
        }}
      >
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
          }}
        >
          <CircularProgress />
        </Paper>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        sx={{
          width: "100%",
          p: 2,
        }}
      >
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

  // No data
  if (!roleCounts) {
    return null;
  }

  // Convert API response into FusionCharts format
  const chartData = Object.entries(roleCounts).map(
    ([role, count]) => ({
      label: role,
      value: count,
    })
  );

  const dataSource = {
    chart: {
      caption: "Users by Role",
      subCaption: "MediSlot user distribution",

      showValues: "1",
      showPercentValues: "1",
      showLegend: "1",

      enableSmartLabels: "1",
      use3DLighting: "0",

      theme: "fusion",
    },

    data: chartData,
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          borderRadius: 3,

          p: {
            xs: 2,
            sm: 3,
            md: 4,
          },
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

        <ReactFC
          type="pie3d"
          width="100%"
          height="400"
          dataFormat="JSON"
          dataSource={dataSource}
        />
      </Paper>
    </Box>
  );
};

export default QuickActions;