import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Paper,
  Grid,
} from "@mui/material";

import CommonButton from "./CommonButton";

import { getCurrentUser } from "../utils/auth";
import {
  canAccessNavigationItem,
} from "../utils/permissions";

import { navigationItems } from "../config/navigation";

function QuickActions() {
  const navigate = useNavigate();

  const user = getCurrentUser();

  const role = user?.role;
  const fullName = user?.fullName || "User";

  /*
   * Get only the navigation items
   * the current user can access.
   */
  const visibleQuickActions =
    navigationItems
      .filter(canAccessNavigationItem)
      .filter(
        (item) => item.path !== "/home"
      );

  return (
    <Box
      sx={{
        minHeight:
          "calc(100vh - 72px)",
        backgroundColor: "#f8fafc",
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

      {/* Quick Actions Heading */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: "#0f172a",
          mb: 2,
        }}
      >
        Quick Actions
      </Typography>

      {/* Quick Action Cards */}
      <Grid
        container
        spacing={3}
      >
        {visibleQuickActions.map(
          (action) => (
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
                {/* Icon */}
                <Box
                  sx={{
                    mb: 2,
                    color: "primary.main",
                  }}
                >
                  {action.icon}
                </Box>

                {/* Title */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  {action.label}
                </Typography>

                {/* Description */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 3,
                    minHeight: 42,
                  }}
                >
                  {getDescription(
                    action.path,
                    role
                  )}
                </Typography>

                {/* Open Button */}
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
            </Grid>
          )
        )}
      </Grid>
    </Box>
  );
}

/*
 * Quick action descriptions
 */
const getDescription = (
  path,
  role
) => {
  switch (path) {
    case "/dashboard":
      return "View your uploaded verification documents.";

    case "/profile":
      return "View and manage your profile information.";

    case "/providers":
      return "View registered providers in MediSlot.";

    case "/provider-documents":
      return "View verification documents uploaded by providers.";

    case "/provider-export":
      return "Export provider information as CSV or PDF.";

    default:
      return "Open this section of MediSlot.";
  }
};

export default QuickActions;