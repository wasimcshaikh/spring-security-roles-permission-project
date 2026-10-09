import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AppBar,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";

import CommonButton from "./CommonButton";

import { logout } from "../utils/auth";
import { canAccessNavigationItem } from "../utils/permissions";
import { navigationItems } from "../config/navigation";

// ----------------------------------------------------------------------
// Responsive strategy
// ----------------------------------------------------------------------
// - At widths >= FULL_NAV_MIN_WIDTH every button is shown on the bar and
//   the hamburger icon is hidden (wide laptop / desktop screens).
// - Below that, only the call and signout buttons remain beside the menu.
// - Below MOBILE_MAX_WIDTH, only the brand and menu remain.
// - Whatever is hidden from the bar is always reachable from the right
//   side drawer opened by the hamburger, which always lists every item.
// ----------------------------------------------------------------------
const FULL_NAV_MIN_WIDTH = 1200; // px – desktop: show every navigation item
const MOBILE_MAX_WIDTH = 600; // px – phones: only logo + hamburger

function Navbar() {
  const navigate = useNavigate();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [openDesktopSubmenu, setOpenDesktopSubmenu] = useState(null);
  const [openDrawerSubmenu, setOpenDrawerSubmenu] = useState(null);

  const visibleNavigationItems = navigationItems
    .filter(canAccessNavigationItem)
    .filter((item) => item.path !== "/home");

  const handleNavigation = (path) => {
    setOpenMobileMenu(false);
    setOpenDesktopSubmenu(null);
    setOpenDrawerSubmenu(null);
    navigate(path);
  };

  const handleLogoutClick = () => {
    setOpenMobileMenu(false);
    setOpenDesktopSubmenu(null);
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

  // Navigation links collapse before the call and signout actions.
  const priorityItems = [
    ...visibleNavigationItems.map((item) => ({
      key: item.path,
      label: item.label,
      icon: item.icon,
      children: item.children,
      isNavigation: true,
      hasSubmenu: Boolean(item.children) || item.path === "/flex-practice",
      submenuItems: item.children || (
        item.path === "/flex-practice"
          ? [
              { label: "Flex Practice", path: "/flex-practice" },
              { label: "Grid Practice", path: "/grid-practice" },
            ]
          : null
      ),
      onClick: item.children || item.path === "/flex-practice"
        ? () => setOpenDesktopSubmenu((open) => open === item.path ? null : item.path)
        : () => handleNavigation(item.path),
      variant: "text",
    })),
    
    {
      key: "logout",
      label:  "Signout",
      icon: <LogoutIcon />,
      onClick: handleLogoutClick,
      variant: "outlined",
      isLogout: true,
    },
  ];

  const barButtonSx = (item) => {
    return {
      display: "none",
      [`@media (min-width:${MOBILE_MAX_WIDTH}px)`]: {
        display: item.isNavigation ? "none" : "inline-flex",
      },
      [`@media (min-width:${FULL_NAV_MIN_WIDTH}px)`]: {
        display: "inline-flex",
      },
      whiteSpace: "nowrap",
      flexShrink: item.isLogout ? 0 : 1,
      minWidth: item.isLogout ? "max-content" : 0,
      color: "#ffffff",
      px: 1,
      boxShadow: "none",
      "&:hover": {
        backgroundColor: "rgba(255,255,255,0.1)",
      },
      // position : "fixed"
    };
  };

  const renderBarItem = (item) => {
    const button = (
      <CommonButton
        key={item.key}
        text={item.label}
        variant={item.variant}
        color="inherit"
        fullWidth={false}
        size="medium"
        startIcon={item.icon}
        onClick={item.onClick}
        sx={{
          ...barButtonSx(item),
          ...(item.isLogout && {
            borderColor: "rgba(255,255,255,0.5)",
            "&:hover": {
              borderColor: "#ffffff",
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }),
        }}
      />
    );

    if (!item.hasSubmenu) {
      return button;
    }

    const submenuItems = item.submenuItems.filter(canAccessNavigationItem);

    return (
      <Box
        key={item.key}
        sx={{ position: "relative", display: "inline-flex" }}
        onMouseEnter={() => setOpenDesktopSubmenu(item.key)}
        onMouseLeave={() => setOpenDesktopSubmenu(null)}
      >
        {button}
        {openDesktopSubmenu === item.key && (
          <Box
            role="menu"
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: 190,
              p: 1,
              bgcolor: "#ffffff",
              borderRadius: 1,
              boxShadow: 3,
              zIndex: (theme) => theme.zIndex.appBar + 1,
            }}
          >
            {submenuItems.map((submenuItem) => (
              <CommonButton
                key={submenuItem.path}
                text={submenuItem.label}
                variant="text"
                color="inherit"
                fullWidth
                size="medium"
                startIcon={submenuItem.icon}
                onClick={() => handleNavigation(submenuItem.path)}
                sx={{
                  justifyContent: "flex-start",
                  color: "#0f172a",
                  px: 1.5,
                  boxShadow: "none",
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    );
  };

  const renderDrawerItem = (item) => {
    if (item.hasSubmenu) {
      const submenuItems = item.submenuItems.filter(canAccessNavigationItem);

      return (
        <Box key={item.key}>
          <CommonButton
            text={item.label}
            variant={item.variant}
            color="inherit"
            fullWidth
            size="medium"
            startIcon={item.icon}
            onClick={() => setOpenDrawerSubmenu((open) => open === item.key ? null : item.key)}
            sx={{
              justifyContent: "flex-start",
              whiteSpace: "nowrap",
              color: "#0f172a",
              px: 2,
              boxShadow: "none",
              "&:hover": { backgroundColor: "rgba(15,23,42,0.08)" },
            }}
          />
          {openDrawerSubmenu === item.key && (
            <Box sx={{ pl: 3, display: "flex", flexDirection: "column" }}>
              {submenuItems.map((submenuItem) => (
                <CommonButton
                  key={submenuItem.path}
                  text={submenuItem.label}
                  variant="text"
                  color="inherit"
                  fullWidth
                  size="medium"
                  startIcon={submenuItem.icon}
                  onClick={() => handleNavigation(submenuItem.path)}
                  sx={{
                    justifyContent: "flex-start",
                    color: "#0f172a",
                    px: 2,
                    boxShadow: "none",
                    "&:hover": { backgroundColor: "rgba(15,23,42,0.08)" },
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      );
    }

    return (
      <CommonButton
        key={item.key}
        text={item.label}
        variant={item.variant}
        color="inherit"
        fullWidth
        size="medium"
        startIcon={item.icon}
        onClick={item.onClick}
        sx={{
          justifyContent: "flex-start",
          whiteSpace: "nowrap",
          color: "#0f172a",
          px: 2,
          boxShadow: "none",
          ...(item.isLogout && {
            borderColor: "rgba(15,23,42,0.35)",
          }),
          "&:hover": {
            backgroundColor: "rgba(15,23,42,0.08)",
          },
        }}
      />
    );
  };

  return (
    <>
      <AppBar
        position="fixed"
        
        elevation={0}
        sx={{
          background: "#164e63",
         padding : 0 ,
         margin : 0
        }}
      >
       
         <Toolbar
          sx={{
            minHeight: { xs: 60, sm: 72 },
            width: "100%",
            // p : 0 ,
            px: { xs: 2, sm: 3, md: 3, lg: 1 },
            display: "flex",
            alignItems: "center",
            justifyContent: {
              xs: "space-between",
              sm: "space-between",
              lg: "space-between",
            },
            gap: { xs: 1, sm: 2 },
            
            
           
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 0.25,
              flexShrink: 0,
              minWidth: 0,
            //   bgcolor:"primary.main",
              
            }}
          >
            <Typography
              sx={{
                fontWeight: 800,
                letterSpacing: 0.5,
                fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                lineHeight: 1.2,
                whiteSpace: "nowrap",
              }}
            >
              MediSlot
            </Typography>
            <Typography
              sx={{
                opacity: 0.8,
                fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
                display: "block",
                whiteSpace: "nowrap",
              }}
            >
              Provider Verification
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1 },
              ml: "auto",
              minWidth: 0,
            }}
          >
            {/* Navigation links collapse before the call and signout actions. */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "nowrap",
                gap: 0.5,
                overflow: "visible",
                flex: "1 1 auto",
                minWidth: 0,
                justifyContent: "flex-end",
              }}
            >
              {priorityItems
                .filter((item) => !item.isLogout)
                .map((item) => renderBarItem(item))}
            </Box>

            {renderBarItem(priorityItems.find((item) => item.isLogout))}

            <IconButton
              aria-label="Open navigation menu"
              onClick={() => setOpenMobileMenu(true)}
              sx={{
                display: "inline-flex",
                [`@media (min-width:${FULL_NAV_MIN_WIDTH}px)`]: {
                  display: "none",
                },
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.45)",
                borderRadius: 2,
                flexShrink: 0,
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
       
      </AppBar>

      <Toolbar
        aria-hidden="true"
        sx={{ minHeight: { xs: 60, sm: 72 } }}
      />

      <Drawer
        anchor="right"
        open={openMobileMenu}
        onClose={() => setOpenMobileMenu(false)}
        PaperProps={{
          sx: {
            width: { xs: "min(85vw, 300px)", sm: 340 },
            p: 2,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
            Navigation
          </Typography>
          <IconButton
            aria-label="Close navigation menu"
            onClick={() => setOpenMobileMenu(false)}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 1.5 }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {priorityItems.map((item) => renderDrawerItem(item))}
        </Box>
      </Drawer>

      <Dialog open={openLogoutDialog} onClose={handleLogoutCancel}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>Are you sure you want to logout?</DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
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