import React, { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";

import axiosInstance from "../utils/axiosInstance";

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(
        "/api/providers/me"
      );

      setProfile(response.data);
    } catch (error) {
      console.error(
        "Error fetching profile:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProfile();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 72px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8fafc",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
          My Profile
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
        >
          View your MediSlot provider profile
          information.
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

      {/* Profile */}

      {profile && (
        <Paper
          elevation={0}
          sx={{
            maxWidth: 800,
            borderRadius: 3,
            border: "1px solid #e2e8f0",
            p: {
              xs: 2,
              sm: 4,
            },
          }}
        >
          {/* Profile Header */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                backgroundColor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
              }}
            >
              <PersonIcon fontSize="large" />
            </Box>

            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                }}
              >
                {profile.fullName}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {profile.role}
              </Typography>
            </Box>
          </Box>

          {/* Profile Information */}

          <Grid container spacing={3}>
            {/* Full Name */}

            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#f8fafc",
                }}
              >
                <PersonIcon color="primary" />

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Full Name
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600 }}
                  >
                    {profile.fullName}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Email */}

            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#f8fafc",
                }}
              >
                <EmailIcon color="primary" />

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Email
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600 }}
                  >
                    {profile.email}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Phone Number */}

            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#f8fafc",
                }}
              >
                <PhoneIcon color="primary" />

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Phone Number
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600 }}
                  >
                    {profile.phoneNumber}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Role */}

            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#f8fafc",
                }}
              >
                <BadgeIcon color="primary" />

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Role
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600 }}
                  >
                    {profile.role}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Verification Status */}

            <Grid item xs={12}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor:
                    profile.verified
                      ? "#f0fdf4"
                      : "#fff7ed",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Verification Status
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 700,
                    mt: 0.5,
                  }}
                >
                  {profile.verified
                    ? "Verified"
                    : "Not Verified"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
}

export default MyProfile;