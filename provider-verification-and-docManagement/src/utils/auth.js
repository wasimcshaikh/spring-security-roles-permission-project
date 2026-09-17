export const getCurrentUser = () => {
  const storedUser = sessionStorage.getItem("provider");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Invalid provider data in sessionStorage");
    return null;
  }
};

export const getCurrentRole = () => {
  const user = getCurrentUser();

  return user?.role || null;
};

export const getToken = () => {
  return sessionStorage.getItem("token");
};

export const logout = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("provider");
};