
import React from "react";

import {
  Alert,
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import CommonButton from "./CommonButton";

function CommonForm({
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
    <Box>

      {/* Backend Error */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      {/* Dynamic Form */}

      <Box
        component="form"
        onSubmit={onSubmit}
      >

        {fields.map((field) => {

          /*
           * File field
           */

          if (field.type === "file") {

            return (
              <Box
                key={field.name}
                sx={{ mt: 2 }}
              >

                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                  }}
                >
                  {field.buttonText || "Choose File"}

                  <input
                    type="file"
                    hidden
                    name={field.name}
                    accept={field.accept || "*"}
                    onChange={onChange}
                  />

                </Button>

                {formData[field.name] && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Selected file:{" "}
                    {formData[field.name].name}
                  </Typography>
                )}

              </Box>
            );
          }


          /*
           * Select / Dropdown field
           */

          if (field.type === "select") {

            return (
              <TextField
                key={field.name}
                fullWidth
                select
                label={field.label}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={onChange}
                margin="normal"
                required={field.required || false}
              >

                {field.options.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}

              </TextField>
            );
          }


          /*
           * Normal field
           */

          return (
            <TextField
              key={field.name}
              fullWidth
              label={field.label}
              name={field.name}
              type={field.type || "text"}
              value={formData[field.name] || ""}
              onChange={onChange}
              margin="normal"
              required={field.required || false}
              placeholder={field.placeholder || ""}
              inputProps={field.inputProps || {}}
            />
          );

        })}


        <CommonButton
          text={
            loading
              ? loadingText
              : submitText
          }
          type="submit"
          disabled={loading}
          sx={{
            mt: 2,
            py: 1.4,
            borderRadius: 2,
            fontWeight: 700,
          }}
        />

      </Box>

    </Box>
  );
}

export default CommonForm;

