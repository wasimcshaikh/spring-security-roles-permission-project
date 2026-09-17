import { getCurrentUser } from "./auth";

export const hasPermission = (permission) => {
  const user = getCurrentUser();

  if (!user) {
    return false;
  }

  return user.permissions?.includes(permission) || false;
};

export const hasAnyPermission = (permissions) => {
  const user = getCurrentUser();

  if (!user) {
    return false;
  }

  return permissions.some((permission) =>
    user.permissions?.includes(permission)
  );
};

export const hasAllPermissions = (permissions) => {
  const user = getCurrentUser();

  if (!user) {
    return false;
  }

  return permissions.every((permission) =>
    user.permissions?.includes(permission)
  );
};

export const hasRole = (role) => {
  const user = getCurrentUser();

  if (!user) {
    return false;
  }

  return user.role === role;
};

export const canAccessNavigationItem = (item) => {
  const user = getCurrentUser();

  if (!user) {
    return false;
  }

  // Check permission
  if (
    item.permission &&
    !user.permissions?.includes(item.permission)
  ) {
    return false;
  }

  // Check role if roles are defined
  if (
    item.roles &&
    !item.roles.includes(user.role)
  ) {
    return false;
  }

  return true;
};