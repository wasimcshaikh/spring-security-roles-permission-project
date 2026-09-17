import React from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import CommonForm from "./CommonForm";

function CommonFormDialog({
  open,
  title,
  onClose,
  fields,
  formData,
  onChange,
  onSubmit,
  error = "",
  loading = false,
  submitText = "Submit",
  loadingText = "Submitting...",
}) {

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >

      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 700,
        }}
      >
        {title}

        <IconButton
          onClick={onClose}
          disabled={loading}
        >
          <CloseIcon />
        </IconButton>

      </DialogTitle>

      <DialogContent sx={{ pb: 3 }}>

        <CommonForm
          fields={fields}
          formData={formData}
          onChange={onChange}
          onSubmit={onSubmit}
          error={error}
          loading={loading}
          submitText={submitText}
          loadingText={loadingText}
        />

      </DialogContent>

    </Dialog>
  );
}

export default CommonFormDialog;

