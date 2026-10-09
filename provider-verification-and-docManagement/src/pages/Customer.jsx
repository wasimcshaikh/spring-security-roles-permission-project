import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import CommonButton from "../components/CommonButton";
import CommonTable from "../components/CommonTable";
import axiosInstance from "../utils/axiosInstance";

const emptyForm = {
  fullName: "",
  email: "",
  phoneNumber: "",
};

const formatColumnName = (field) =>
  field
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (character) => character.toUpperCase());

const formatCellValue = (value, field) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "boolean") {
    if (field === "active") {
      return value ? "Active" : "Inactive";
    }
    return value ? "Yes" : "No";
  }

  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T/.test(value)
  ) {
    return value.split("T")[0];
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return value;
};

function Customer() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const columns = [
    ...new Set(customers.flatMap((customer) => Object.keys(customer))),
  ].map((field) => ({
    field,
    headerName: formatColumnName(field),
  }));
  const cardTitleField =
    columns.find((column) => column.field === "fullName")?.field ||
    columns.find((column) => column.field !== "id")?.field ||
    columns[0]?.field;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/customers");
        if (!Array.isArray(response.data)) {
          throw new Error("The customers response was not a list.");
        }

        setCustomers(response.data);
      } catch (fetchError) {
        console.error("Failed to fetch customers:", fetchError);
        setError(
          fetchError.response?.data?.message ||
            fetchError.message ||
            "Unable to fetch customers."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const openCreateDialog = () => {
    setEditingCustomer(null);
    setFormData(emptyForm);
    setFormError("");
    setDialogOpen(true);
  };

  const openUpdateDialog = async (customer) => {
    setEditingCustomer(customer);
    setFormData(emptyForm);
    setFormError("");
    setDialogOpen(true);
    setLoadingCustomer(true);

    try {
      const response = await axiosInstance.get(
        `/api/admin/customers/${customer.id}`
      );
      const customerDetails = response.data;

      if (
        !customerDetails ||
        String(customerDetails.id) !== String(customer.id)
      ) {
        throw new Error("The customer response was invalid.");
      }

      setEditingCustomer(customerDetails);
      setFormData({
        fullName: customerDetails.fullName || "",
        email: customerDetails.email || "",
        phoneNumber: customerDetails.phoneNumber || "",
      });
    } catch (fetchError) {
      console.error("Failed to fetch customer details:", fetchError);
      setFormError(
        fetchError.response?.data?.message ||
          fetchError.message ||
          "Unable to load customer details."
      );
    } finally {
      setLoadingCustomer(false);
    }
  };

  const closeDialog = () => {
    if (!saving && !loadingCustomer) {
      setDialogOpen(false);
      setFormError("");
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phoneNumber: formData.phoneNumber.trim(),
    };

    if (!payload.fullName || !payload.email || !payload.phoneNumber) {
      setFormError("Enter the customer name, email, and phone number.");
      return;
    }

    try {
      setSaving(true);
      const response = editingCustomer
        ? await axiosInstance.put(
            `/api/admin/customers/${editingCustomer.id}`,
            payload
          )
        : await axiosInstance.post("/api/admin/customers", payload);

      const savedCustomer = response.data;
      setCustomers((current) =>
        editingCustomer
          ? current.map((item) =>
              item.id === savedCustomer.id ? savedCustomer : item
            )
          : [...current, savedCustomer]
      );
      setSuccess(
        editingCustomer
          ? "Customer updated successfully."
          : "Customer created successfully."
      );
      setDialogOpen(false);
      setEditingCustomer(null);
      setFormData(emptyForm);
    } catch (submitError) {
      console.error("Failed to save customer:", submitError);
      setFormError(
        submitError.response?.data?.message ||
          "Unable to save the customer. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (customer) => {
    console.log(`Customer with id ${customer.id} deleted successfully`);
  };

  const renderActions = (customer) => (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      <CommonButton
        text="Update"
        variant="outlined"
        fullWidth={false}
        size="small"
        startIcon={<EditIcon />}
        onClick={() => openUpdateDialog(customer)}
      />
      <CommonButton
        text="Delete"
        variant="outlined"
        color="error"
        fullWidth={false}
        size="small"
        startIcon={<DeleteIcon />}
        onClick={() => handleDeleteClick(customer)}
      />
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 72px)",
        backgroundColor: "#f8fafc",
        p: { xs: 1.5, sm: 3, md: 5 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#0f172a",
            fontSize: { xs: "1.75rem", sm: "2.125rem" },
          }}
        >
          Customers
        </Typography>
        <CommonButton
          text="Create New"
          variant="contained"
          fullWidth={false}
          size="medium"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
          sx={{
            alignSelf: { xs: "flex-end", sm: "auto" },
            whiteSpace: "nowrap",
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 200,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <CommonTable
              columns={columns}
              rows={customers.map((customer) =>
                Object.fromEntries(
                  columns.map((column) => [
                    column.field,
                    formatCellValue(
                      customer[column.field],
                      column.field
                    ),
                  ])
                )
              )}
              actions={renderActions}
              rowKey="id"
              emptyMessage="No customers found"
              compact
            />
          </Box>

          <Box
            sx={{
              display: { xs: "grid", md: "none" },
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              gap: 1.25,
            }}
          >
            {customers.length === 0 ? (
              <Typography
                align="center"
                color="text.secondary"
                sx={{ py: 3, gridColumn: "1 / -1" }}
              >
                No customers found
              </Typography>
            ) : (
              customers.map((customer) => (
                <Paper
                  key={customer.id}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    border: "1px solid rgba(24, 91, 117, 0.1)",
                    borderRadius: 1,
                    minWidth: 0,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 1.25,
                      color: "#123b4a",
                      fontWeight: 700,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {formatCellValue(customer[cardTitleField], cardTitleField)}
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 1,
                      mb: 1.5,
                    }}
                  >
                    {columns
                      .filter((column) => column.field !== cardTitleField)
                      .map((column) => (
                        <Box key={column.field} sx={{ minWidth: 0 }}>
                          <Typography variant="caption" color="text.secondary">
                            {column.headerName}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ overflowWrap: "anywhere" }}
                          >
                            {formatCellValue(
                              customer[column.field],
                              column.field
                            )}
                          </Typography>
                        </Box>
                      ))}
                  </Box>

                  {renderActions(customer)}
                </Paper>
              ))
            )}
          </Box>
        </>
      )}

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {editingCustomer ? "Update Customer" : "Create Customer"}
            <IconButton
              aria-label="Close dialog"
              onClick={closeDialog}
              disabled={saving || loadingCustomer}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ display: "grid", gap: 2, pt: "8px !important" }}>
            {formError && <Alert severity="error">{formError}</Alert>}
            {loadingCustomer ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TextField
                  label="Full name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Phone number"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleFormChange}
                  required
                  fullWidth
                />
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <CommonButton
              text="Cancel"
              variant="outlined"
              fullWidth={false}
              size="medium"
              onClick={closeDialog}
              disabled={saving || loadingCustomer}
            />
            <CommonButton
              text={
                saving
                  ? "Saving..."
                  : editingCustomer
                    ? "Save Changes"
                    : "Create"
              }
              type="submit"
              fullWidth={false}
              size="medium"
              disabled={saving || loadingCustomer}
            />
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

export default Customer;
