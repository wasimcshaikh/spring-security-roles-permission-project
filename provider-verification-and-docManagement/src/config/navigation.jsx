import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import GroupsIcon from "@mui/icons-material/Groups";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";


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
     label: "Practice",
    path: "/flex-practice",
    icon: <DescriptionIcon />,
    permission: "VIEW_DOCUMENTS",
  },

  {
    label: "Providers",
    path: "/providers-menu",
    icon: <PeopleIcon />,
    permission: "VIEW_PROVIDERS",
    children: [
      {
        label: "Provider's Documents",
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
    ],
  },

  {
    label: "Assessment",
    path: "/assessment-menu",
    icon: <FactCheckIcon />,
    permission: "VIEW_ASSESSMENTS",
    children: [
      {
        label: "Assessment",
        path: "/assessments",
        icon: <FactCheckIcon />,
      },
      {
        label: "Customer",
        path: "/customers",
        icon: <GroupsIcon />,
      },
      {
        label: "Compliance",
        path: "/compliance",
        icon: <VerifiedUserIcon />,
      },
    ],
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
  {
  label: "Upload Users",
  path: "/upload-users",
  icon: <UploadFileIcon />,
  permission: "IMPORT_USERS",
},
{
  label: "Video Call",
  path: "/video-calls",
  icon: <VideoCallIcon />,
  permission: "VIDEO_CALL",
},
];