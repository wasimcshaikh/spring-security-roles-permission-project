import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

import LogoutIcon from "@mui/icons-material/Logout";

import CommonButton from "./CommonButton";

import { getCurrentUser, logout } from "../utils/auth";
import {
  canAccessNavigationItem,
} from "../utils/permissions";

import { navigationItems } from "../config/navigation";

function Navbar() {
  const navigate = useNavigate();

  const [openLogoutDialog, setOpenLogoutDialog] =
    useState(false);

  const user = getCurrentUser();

  const role = user?.role;

  /*
   * Filter navigation items based on
   * current user's role and permissions.
   */
  const visibleNavigationItems =
    navigationItems.filter(
      canAccessNavigationItem
    );

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    logout();

    setOpenLogoutDialog(false);

    navigate("/");
  };

  const handleLogoutCancel = () => {
    setOpenLogoutDialog(false);
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background:
            "linear-gradient(90deg, #0f172a 0%, #164e63 100%)",
        }}
      >
        <Toolbar
          sx={{
            minHeight: "72px",
            px: {
              xs: 2,
              md: 4,
            },
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Application Name */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexShrink: 0,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                letterSpacing: 0.5,
              }}
            >
              MediSlot
            </Typography>

            <Typography
              variant="body2"
              sx={{
                opacity: 0.8,
                display: {
                  xs: "none",
                  sm: "block",
                },
              }}
            >
              Provider Verification
            </Typography>
          </Box>

          {/* Navigation */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              ml: 3,
              overflowX: "auto",
            }}
          >
            {visibleNavigationItems
              .filter(
                (item) => item.path !== "/home"
              )
              .map((item) => (
                <CommonButton
                  key={item.path}
                  text={item.label}
                  variant="text"
                  color="inherit"
                  fullWidth={false}
                  size="medium"
                  startIcon={item.icon}
                  onClick={() =>
                    handleNavigation(item.path)
                  }
                  sx={{
                    whiteSpace: "nowrap",
                    color: "#ffffff",
                    px: 1.5,
                    boxShadow: "none",

                    "&:hover": {
                      backgroundColor:
                        "rgba(255,255,255,0.1)",
                    },
                  }}
                />
              ))}

            {/* Logout */}
            <CommonButton
              text={
                role === "ADMIN"
                  ? "Signout"
                  : "Logout"
              }
              variant="outlined"
              color="inherit"
              fullWidth={false}
              size="medium"
              startIcon={<LogoutIcon />}
              onClick={handleLogoutClick}
              sx={{
                whiteSpace: "nowrap",
                color: "#ffffff",
                borderColor:
                  "rgba(255,255,255,0.5)",
                boxShadow: "none",

                "&:hover": {
                  borderColor: "#ffffff",
                  backgroundColor:
                    "rgba(255,255,255,0.1)",
                },
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={openLogoutDialog}
        onClose={handleLogoutCancel}
      >
        <DialogTitle>
          Confirm Logout
        </DialogTitle>

        <DialogContent>
          Are you sure you want to logout?
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
            color="inherit"
            fullWidth={false}
            size="medium"
            onClick={handleLogoutCancel}
          />

          <CommonButton
            text="Yes"
            variant="contained"
            color="error"
            fullWidth={false}
            size="medium"
            onClick={handleLogoutConfirm}
          />
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Navbar;