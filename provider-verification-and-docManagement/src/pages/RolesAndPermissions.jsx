import React, { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";

import CommonButton from "../components/CommonButton";
import axiosInstance from "../utils/axiosInstance";

function RolesAndPermissions() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchRolesAndPermissions = async () => {
      try {
        setLoading(true);
        setError("");

        const [rolesResponse, permissionsResponse] = await Promise.all([
          axiosInstance.get("/api/admin/roles"),
          axiosInstance.get("/api/admin/permissions"),
        ]);

        setRoles(rolesResponse.data);
        setPermissions(permissionsResponse.data);

        // if (rolesResponse.data.length > 0) {
        //   setSelectedRole(rolesResponse.data[0].id);
        // }
      } catch (error) {
        console.error(error);

        if (error.response) {
          setError(error.response.data);
        } else {
          setError("Unable to load roles and permissions");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRolesAndPermissions();
  }, []);

  useEffect(() => {
    if (!selectedRole) {
      return;
    }

    const fetchRolePermissions = async () => {
      try {
        setError("");
        setSuccess("");

        const response = await axiosInstance.get(
          `/api/admin/roles/${selectedRole}/permissions`
        );

        setSelectedPermissions(
          response.data.map((permission) => permission.id)
        );
      } catch (error) {
        console.error(error);

        if (error.response) {
          setError(error.response.data);
        } else {
          setError("Unable to load role permissions");
        }
      }
    };

    fetchRolePermissions();
  }, [selectedRole]);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions((previousPermissions) => {
      if (previousPermissions.includes(permissionId)) {
        return previousPermissions.filter(
          (id) => id !== permissionId
        );
      }

      return [...previousPermissions, permissionId];
    });

    setSuccess("");
    setError("");
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await axiosInstance.put(
        `/api/admin/roles/${selectedRole}/permissions`,
        {
          permissionIds: selectedPermissions,
        }
      );

      setSuccess("Role permissions updated successfully.");
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(error.response.data);
      } else {
        setError("Unable to update role permissions");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        flexDirection: "column",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
    <Box
      sx={{
        width: "100%",
        maxWidth: 800,
        mx: "auto",
      }}
    >
      <Box 
      sx={{
        mb: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      >
        <Typography
        variant="h4"
        fontWeight={700}
        mb={1}
      >
        Roles & Permissions
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        mb={4}
      >
        Manage permissions assigned to each role.
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
        >
          {success}
        </Alert>
      )}
      </Box>

      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 3,
          width: "100%",
          maxWidth: 700,
          mx: "auto",
          boxSizing: "border-box",
        }}
      >
        {/* Role Dropdown */}

        <Typography
          variant="h6"
          fontWeight={600}
          mb={2}
        >
          Select Role
        </Typography>

        <FormControl fullWidth variant="outlined">
          <InputLabel
            id="role-select-label"
          >
            Select Role
          </InputLabel>

          <Select
            labelId="role-select-label"
            value={selectedRole}
            label="Select Role"
            onChange={handleRoleChange}
          >
            {roles.map((role) => (
              <MenuItem
                key={role.id}
                value={role.id}
              >
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Permissions */}

        <Typography
          variant="h6"
          fontWeight={600}
          mt={4}
          mb={2}
        >
          Permissions
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          {permissions.map((permission) => (
            <FormControlLabel
              key={permission.id}
              sx={{
                mx: 0,
                width: "100%",
                minWidth: 0,
                alignItems: "flex-start",
                "& .MuiCheckbox-root": {
                  flexShrink: 0,
                  mt: { xs: 0, sm: 0.25 },
                },
                "& .MuiFormControlLabel-label": {
                  minWidth: 0,
                  pt: 1,
                  whiteSpace: "normal",
                  overflowWrap: "anywhere",
                  lineHeight: 1.4,
                },
              }}
              control={
                <Checkbox
                  checked={selectedPermissions.includes(
                    permission.id
                  )}
                  onChange={() =>
                    handlePermissionChange(permission.id)
                  }
                />
              }
              label={permission.name}
            />
          ))}
        </Box>

        {/* Submit */}

        <CommonButton
          text={saving ? "Updating..." : "Update Permissions"}
          onClick={handleSubmit}
          disabled={saving || !selectedRole}
          fullWidth={false}
          sx={{
            mt: 3,
            width: { xs: "100%", sm: "auto" },
            minWidth: { sm: 200 },
            px: { xs: 1.5, sm: 2.5 },
            py: { xs: 1, sm: 1.1, md: 1.25 },
            fontSize: { xs: "0.875rem", sm: "0.9rem" },
            borderRadius: 2,
            fontWeight: 700,
          }}
        />
      </Paper>
    </Box>
    </Box>
  );
}

export default RolesAndPermissions;