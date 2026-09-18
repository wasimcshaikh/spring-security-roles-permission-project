import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export const navigationItems = [
  {
    label: "Dashboard",
    path: "/home",
    icon: <DashboardIcon />,
    permission: "VIEW_DASHBOARD",
  },

  {
    label: "View Documents",
    path: "/dashboard",
    icon: <DescriptionIcon />,
    permission: "VIEW_DOCUMENTS",
  },

  {
    label: "View Documents of Provider",
    path: "/provider-documents",
    icon: <DescriptionIcon />,
    permission: "VIEW_PROVIDER_DETAILS",
  },

  {
    label: "Export Providers",
    path: "/provider-export",
    icon: <FileDownloadIcon />,
    permission: "EXPORT_PROVIDERS",
  },

  {
    label: "View Providers",
    path: "/providers",
    icon: <PeopleIcon />,
    permission: "VIEW_PROVIDERS",
  },

  {
    label: "Roles & Permissions",
    path: "/roles-permissions",
    icon: <AdminPanelSettingsIcon />,
    permission: "MANAGE_PERMISSIONS",
  },

  {
    label: "My Profile",
    path: "/profile",
    icon: <PersonIcon />,
    permission: "VIEW_PROFILE",
  },
];