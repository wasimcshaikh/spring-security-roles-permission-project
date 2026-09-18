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
  const [roleFieldFocused, setRoleFieldFocused] = useState(false);

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
        alignItems: "center",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        
      }}
    >
    <Box
      sx={{
        width: "60%",
        maxWidth: 800,
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
          maxWidth: 700,
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

        <FormControl fullWidth>
          <InputLabel
            sx={{
              visibility: roleFieldFocused || selectedRole
                ? "hidden"
                : "visible",
            }}
          >
            Select Role
          </InputLabel>

          <Select
            value={selectedRole}
            label="Role"
            onChange={handleRoleChange}
            onFocus={() => setRoleFieldFocused(true)}
            onBlur={() => setRoleFieldFocused(false)}
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
          }}
        >
          {permissions.map((permission) => (
            <FormControlLabel
              key={permission.id}
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
          sx={{
            mt: 3,
            py: 1.4,
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