import React from "react";
import { Button } from "@mui/material";

function CommonButton({
  text,
  variant = "contained",
  color = "primary",
  type = "button",
  fullWidth = true,
  size = "large",
  disabled = false,
  onClick,
  startIcon,
  endIcon,
  sx = {},
}) {
  return (
    <Button
      variant={variant}
      color={color}
      type={type}
      fullWidth={fullWidth}
      size={size}
      disabled={disabled}
      onClick={onClick}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{
        borderRadius: 2,
        textTransform: "none",
        fontWeight: 700,
        boxShadow:
          variant === "contained"
            ? "0 8px 18px rgba(25, 118, 150, 0.2)"
            : "none",
        ...sx,
      }}
    >
      {text}
    </Button>
  );
}

export default CommonButton;