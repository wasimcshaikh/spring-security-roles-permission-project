import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

export const navigationItems = [
  {
    label: "Dashboard",
    path: "/home",
    icon: <DashboardIcon />,
    permission: "VIEW_DASHBOARD",
  },

  // Provider
  {
    label: "View Documents",
    path: "/dashboard",
    icon: <DescriptionIcon />,
    permission: "VIEW_DOCUMENTS",
    roles: ["PROVIDER"],
  },

  // Admin
  {
    label: "View Documents of Provider",
    path: "/provider-documents",
    icon: <DescriptionIcon />,
    permission: "VIEW_DOCUMENTS",
    roles: ["ADMIN"],
  },
  {
    label: "Export Providers",
    path: "/provider-export",
    icon: <FileDownloadIcon />,
    permission: "EXPORT_PROVIDERS",
    roles: ["ADMIN"],
  },
  {
    label: "View Providers",
    path: "/providers",
    icon: <PeopleIcon />,
    permission: "VIEW_PROVIDERS",
    roles: ["ADMIN"],
  },

  // Common
  {
    label: "My Profile",
    path: "/profile",
    icon: <PersonIcon />,
    permission: "VIEW_PROFILE",
  },
];