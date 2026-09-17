import React, { useState } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import DownloadIcon from "@mui/icons-material/Download";
import LogoutIcon from "@mui/icons-material/Logout";

import { useNavigate } from "react-router-dom";

import CommonButton from "./CommonButton";

function DashboardNavbar() {

  const navigate = useNavigate();

  const [openLogoutDialog, setOpenLogoutDialog] =
    useState(false);

  const providerData =
    sessionStorage.getItem("provider");

  const provider = providerData
    ? JSON.parse(providerData)
    : null;

  const role = provider?.role;

  const permissions =
    provider?.permissions || [];


  /*
   * Check permission
   */

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };


  /*
   * Logout
   */

  const handleLogout = () => {

    sessionStorage.clear();

    setOpenLogoutDialog(false);

    navigate("/login");
  };


  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "#123b4a",
          borderBottom:
            "1px solid rgba(255,255,255,0.12)",
        }}
      >

        <Toolbar
          sx={{
            minHeight: 72,
            display: "flex",
            gap: 2,
          }}
        >

          {/* ========================= */}
          {/* LOGO */}
          {/* ========================= */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mr: 3,
              cursor: "pointer",
            }}
            onClick={() =>
              navigate("/home")
            }
          >

            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                letterSpacing: 0.5,
              }}
            >
              MediSlot
            </Typography>

          </Box>


          {/* ========================= */}
          {/* NAVIGATION */}
          {/* ========================= */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexGrow: 1,
            }}
          >

            {/* Dashboard */}

            {hasPermission(
              "VIEW_DASHBOARD"
            ) && (

              <CommonButton
                text="Dashboard"
                variant="text"
                color="inherit"
                fullWidth={false}
                size="medium"
                startIcon={
                  <DashboardIcon />
                }
                onClick={() =>
                  navigate("/home")
                }
                sx={{
                  color: "white",
                  boxShadow: "none",
                }}
              />

            )}


            {/* ========================= */}
            {/* PROVIDER */}
            {/* ========================= */}

            {role === "PROVIDER" &&
              hasPermission(
                "VIEW_DOCUMENTS"
              ) && (

                <CommonButton
                  text="My Documents"
                  variant="text"
                  color="inherit"
                  fullWidth={false}
                  size="medium"
                  startIcon={
                    <DescriptionIcon />
                  }
                  onClick={() =>
                    navigate(
                      "/dashboard"
                    )
                  }
                  sx={{
                    color: "white",
                    boxShadow: "none",
                  }}
                />

              )}


            {/* ========================= */}
            {/* ADMIN */}
            {/* ========================= */}

            {role === "ADMIN" &&
              hasPermission(
                "VIEW_PROVIDERS"
              ) && (

                <CommonButton
                  text="Providers"
                  variant="text"
                  color="inherit"
                  fullWidth={false}
                  size="medium"
                  startIcon={
                    <PeopleIcon />
                  }
                  onClick={() =>
                    navigate(
                      "/providers"
                    )
                  }
                  sx={{
                    color: "white",
                    boxShadow: "none",
                  }}
                />

              )}


            {role === "ADMIN" &&
              hasPermission(
                "VIEW_PROVIDER_DETAILS"
              ) && (

                <CommonButton
                  text="Provider Documents"
                  variant="text"
                  color="inherit"
                  fullWidth={false}
                  size="medium"
                  startIcon={
                    <FolderSharedIcon />
                  }
                  onClick={() =>
                    navigate(
                      "/provider-documents"
                    )
                  }
                  sx={{
                    color: "white",
                    boxShadow: "none",
                  }}
                />

              )}


            {role === "ADMIN" &&
              hasPermission(
                "EXPORT_PROVIDERS"
              ) && (

                <CommonButton
                  text="Export Providers"
                  variant="text"
                  color="inherit"
                  fullWidth={false}
                  size="medium"
                  startIcon={
                    <DownloadIcon />
                  }
                  onClick={() =>
                    navigate(
                      "/provider-export"
                    )
                  }
                  sx={{
                    color: "white",
                    boxShadow: "none",
                  }}
                />

              )}

          </Box>


          {/* ========================= */}
          {/* RIGHT SIDE */}
          {/* ========================= */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >

            {hasPermission(
              "VIEW_PROFILE"
            ) && (

              <CommonButton
                text="My Profile"
                variant="text"
                color="inherit"
                fullWidth={false}
                size="medium"
                startIcon={
                  <PersonIcon />
                }
                onClick={() =>
                  navigate("/profile")
                }
                sx={{
                  color: "white",
                  boxShadow: "none",
                }}
              />

            )}


            <CommonButton
              text="Logout"
              variant="outlined"
              color="inherit"
              fullWidth={false}
              size="medium"
              startIcon={
                <LogoutIcon />
              }
              onClick={() =>
                setOpenLogoutDialog(
                  true
                )
              }
              sx={{
                color: "white",

                borderColor:
                  "rgba(255,255,255,0.5)",

                "&:hover": {
                  borderColor: "white",
                },
              }}
            />

          </Box>

        </Toolbar>

      </AppBar>


      {/* ========================= */}
      {/* LOGOUT CONFIRMATION */}
      {/* ========================= */}

      <Dialog
        open={openLogoutDialog}
        onClose={() =>
          setOpenLogoutDialog(false)
        }
        fullWidth
        maxWidth="xs"
      >

        <DialogTitle
          sx={{
            fontWeight: 800,
            color: "#123b4a",
          }}
        >
          Confirm Logout
        </DialogTitle>


        <DialogContent>

          <Typography
            color="text.secondary"
          >
            Are you sure you want to
            logout from MediSlot?
          </Typography>

        </DialogContent>


        <DialogActions
          sx={{
            p: 2,
            gap: 1,
          }}
        >

          <CommonButton
            text="No"
            variant="outlined"
            fullWidth={false}
            onClick={() =>
              setOpenLogoutDialog(
                false
              )
            }
          />


          <CommonButton
            text="Yes, Logout"
            color="error"
            fullWidth={false}
            onClick={
              handleLogout
            }
          />

        </DialogActions>

      </Dialog>
    </>
  );
}

export default DashboardNavbar;