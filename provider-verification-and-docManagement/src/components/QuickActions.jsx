import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Paper,
  Grid,
} from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import CommonButton from "./CommonButton";

import { getCurrentUser } from "../utils/auth";
import { hasPermission } from "../utils/permissions";

function QuickActions() {
  const navigate = useNavigate();

  const user = getCurrentUser();

  const role = user?.role;
  const fullName = user?.fullName || "User";

  const quickActions = [];

  /*
   * PROVIDER
   */
  if (
    role === "PROVIDER" &&
    hasPermission("VIEW_DOCUMENTS")
  ) {
    quickActions.push({
      title: "View Documents",
      description:
        "View your uploaded verification documents.",
      path: "/dashboard",
      icon: <DescriptionIcon fontSize="large" />,
    });
  }

  if (hasPermission("VIEW_PROFILE")) {
    quickActions.push({
      title: "My Profile",
      description:
        "View and manage your profile information.",
      path: "/profile",
      icon: <PersonIcon fontSize="large" />,
    });
  }

  /*
   * ADMIN
   */
  if (
    role === "ADMIN" &&
    hasPermission("VIEW_PROVIDERS")
  ) {
    quickActions.push({
      title: "View Providers",
      description:
        "View registered providers in MediSlot.",
      path: "/providers",
      icon: <PeopleIcon fontSize="large" />,
    });
  }

  if (
    role === "ADMIN" &&
    hasPermission("VIEW_DOCUMENTS")
  ) {
    quickActions.push({
      title: "Provider Documents",
      description:
        "View verification documents uploaded by providers.",
      path: "/provider-documents",
      icon: <DescriptionIcon fontSize="large" />,
    });
  }

  if (
    role === "ADMIN" &&
    hasPermission("EXPORT_PROVIDERS")
  ) {
    quickActions.push({
      title: "Export Providers",
      description:
        "Export provider information as CSV or PDF.",
      path: "/provider-export",
      icon: <FileDownloadIcon fontSize="large" />,
    });
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        backgroundColor: "#d4dbe3",
        p: {
          xs: 2,
          sm: 3,
          md: 5,
        },
      }}
    >
      {/* Welcome Section */}
      <Box
        sx={{
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#0f172a",
            mb: 1,
          }}
        >
          Welcome, {fullName}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
        >
          {role === "ADMIN"
            ? "Manage providers and verification activities from your dashboard."
            : "Manage your documents and profile from your dashboard."}
        </Typography>
      </Box>

      {/* Quick Actions */}
      {/* <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: "#0f172a",
          mb: 2,
        }}
      >
        Quick Actions
      </Typography> */}

      {/* <Grid container spacing={3}>
        {quickActions.map((action) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={action.path}
          >
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                p: 3,
                borderRadius: 3,
                border:
                  "1px solid #e2e8f0",
                transition:
                  "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform:
                    "translateY(-4px)",
                  boxShadow:
                    "0 10px 30px rgba(15,23,42,0.08)",
                },
              }}
            >
              <Box
                sx={{
                  mb: 2,
                  color: "primary.main",
                }}
              >
                {action.icon}
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                {action.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 3,
                  minHeight: 42,
                }}
              >
                {action.description}
              </Typography>

              <CommonButton
                text="Open"
                variant="contained"
                color="primary"
                fullWidth={true}
                size="medium"
                onClick={() =>
                  navigate(action.path)
                }
              />
            </Paper>
          </Grid> */}
        {/* ))} */}
      {/* </Grid> */}
    </Box>
  );
}

export default QuickActions;