import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

import CommonButton from "../components/CommonButton";
import CommonTable from "../components/CommonTable";
import axiosInstance from "../utils/axiosInstance";

const emptyForm = {
  fullName: "",
  email: "",
  phoneNumber: "",
};

const emptyAssignment = {
  assessmentId: "",
  frequency: "",
  frequencyUnit: "WEEK",
};

const frequencyUnits = ["DAY", "WEEK", "MONTH"];

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
  const navigate = useNavigate();
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
  const [assessmentOptions, setAssessmentOptions] = useState([]);
  const [loadingAssessments, setLoadingAssessments] = useState(true);
  const [assessmentOptionsError, setAssessmentOptionsError] = useState("");
  const [existingAssignments, setExistingAssignments] = useState([]);
  const [newAssignments, setNewAssignments] = useState([]);

  const columns = [
    ...new Set(customers.flatMap((customer) => Object.keys(customer))),
  ].map((field) => ({
    field,
    headerName: formatColumnName(field),
    ...(field === "fullName" && {
      renderCell: (row) => (
        <Button
          variant="text"
          onClick={() => {
            const customer = customers.find(
              (item) => String(item.id) === String(row.id)
            );
            if (customer) {
              navigate(`/customer-profile/${customer.id}`, {
                state: { customer },
              });
            }
          }}
          sx={{
            p: 0,
            minWidth: 0,
            textTransform: "none",
            fontWeight: 700,
            textAlign: "left",
            justifyContent: "flex-start",
          }}
        >
          {row[field]}
        </Button>
      ),
    }),
  }));
  const cardTitleField =
    columns.find((column) => column.field === "fullName")?.field ||
    columns.find((column) => column.field !== "id")?.field ||
    columns[0]?.field;
  const hasSelectableAssessment = assessmentOptions.some(
    (option) =>
      !existingAssignments.some(
        (assignment) =>
          String(assignment.assessmentId) === String(option.id)
      ) &&
      !newAssignments.some(
        (assignment) => String(assignment.assessmentId) === String(option.id)
      )
  );

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

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/assessments");
        if (!Array.isArray(response.data)) {
          throw new Error("The assessments response was not a list.");
        }

        setAssessmentOptions(
          response.data.filter(
            (assessment) => assessment.active !== false && assessment.id != null
          )
        );
      } catch (fetchError) {
        console.error("Failed to fetch assessments for customer assignment:", fetchError);
        setAssessmentOptionsError(
          fetchError.response?.data?.message ||
            fetchError.message ||
            "Unable to load assessments."
        );
      } finally {
        setLoadingAssessments(false);
      }
    };

    fetchAssessments();
  }, []);

  const openCreateDialog = () => {
    setEditingCustomer(null);
    setFormData(emptyForm);
    setFormError("");
    setExistingAssignments([]);
    setNewAssignments([]);
    setDialogOpen(true);
  };

  const openUpdateDialog = async (customer) => {
    setEditingCustomer(customer);
    setFormData(emptyForm);
    setFormError("");
    setExistingAssignments([]);
    setNewAssignments([]);
    setDialogOpen(true);
    setLoadingCustomer(true);

    try {
      const [customerResponse, assignmentsResponse] = await Promise.all([
        axiosInstance.get(`/api/admin/customers/${customer.id}`),
        axiosInstance.get(
          `/api/admin/customers/assessments/${customer.id}`
        ),
      ]);
      const customerDetails = customerResponse.data;

      if (
        !customerDetails ||
        String(customerDetails.id) !== String(customer.id)
      ) {
        throw new Error("The customer response was invalid.");
      }
      if (!Array.isArray(assignmentsResponse.data)) {
        throw new Error("The customer assessments response was not a list.");
      }

      setEditingCustomer(customerDetails);
      setFormData({
        fullName: customerDetails.fullName || "",
        email: customerDetails.email || "",
        phoneNumber: customerDetails.phoneNumber || "",
      });
      setExistingAssignments(assignmentsResponse.data);
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

    const selectedAssessmentIds = newAssignments.map((assignment) =>
      Number(assignment.assessmentId)
    );
    if (
      newAssignments.some(
        (assignment) =>
          !assignment.assessmentId ||
          !Number.isInteger(Number(assignment.assessmentId)) ||
          Number(assignment.assessmentId) <= 0 ||
          !Number.isInteger(Number(assignment.frequency)) ||
          Number(assignment.frequency) <= 0 ||
          !frequencyUnits.includes(assignment.frequencyUnit)
      )
    ) {
      setFormError(
        "Complete each new assessment assignment with an assessment, a frequency greater than zero, and a valid frequency unit."
      );
      return;
    }

    if (new Set(selectedAssessmentIds).size !== selectedAssessmentIds.length) {
      setFormError("Each assessment can only be assigned once.");
      return;
    }

    const assessmentAssignments = newAssignments.map((assignment) => ({
      assessmentId: Number(assignment.assessmentId),
      frequency: Number(assignment.frequency),
      frequencyUnit: assignment.frequencyUnit,
    }));

    let customerDetailsSaved = false;
    try {
      setSaving(true);
      const response = editingCustomer
        ? await axiosInstance.put(
            `/api/admin/customers/${editingCustomer.id}`,
            payload
          )
        : await axiosInstance.post("/api/admin/customers", {
            ...payload,
            treatmentPlanAssessments: assessmentAssignments,
          });

      const savedCustomer = response.data;
      customerDetailsSaved = true;
      setCustomers((current) =>
        editingCustomer
          ? current.map((item) =>
              item.id === savedCustomer.id ? savedCustomer : item
            )
          : [...current, savedCustomer]
      );

      if (editingCustomer && assessmentAssignments.length > 0) {
        for (const assignment of assessmentAssignments) {
          const assignmentResponse = await axiosInstance.post(
            `/api/admin/customers/assessments/${editingCustomer.id}`,
            assignment
          );
          setExistingAssignments((current) => [
            ...current,
            assignmentResponse.data,
          ]);
          setNewAssignments((current) =>
            current.filter(
              (item) =>
                Number(item.assessmentId) !== assignment.assessmentId
            )
          );
        }
      }

      setSuccess(
        editingCustomer
          ? assessmentAssignments.length > 0
            ? "Customer updated and new assessments assigned successfully."
            : "Customer updated successfully."
          : "Customer created successfully."
      );
      setDialogOpen(false);
      setEditingCustomer(null);
      setFormData(emptyForm);
      setExistingAssignments([]);
      setNewAssignments([]);
    } catch (submitError) {
      console.error("Failed to save customer:", submitError);
      const errorDetail =
        submitError.response?.data?.message ||
        (typeof submitError.response?.data === "string"
          ? submitError.response.data
          : null);
      setFormError(
        editingCustomer &&
        customerDetailsSaved &&
        assessmentAssignments.length > 0
          ? `Customer details were saved, but an assessment assignment failed. ${
              errorDetail || "Please retry the remaining assignments."
            }`
          : errorDetail || "Unable to save the customer. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const addAssessmentDraft = () => {
    setNewAssignments((current) => [...current, { ...emptyAssignment }]);
  };

  const updateAssessmentDraft = (index, field, value) => {
    setNewAssignments((current) =>
      current.map((assignment, currentIndex) =>
        currentIndex === index
          ? { ...assignment, [field]: value }
          : assignment
      )
    );
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
                    component="button"
                    onClick={() =>
                      navigate(`/customer-profile/${customer.id}`, {
                        state: { customer },
                      })
                    }
                    sx={{
                      mb: 1.25,
                      color: "#123b4a",
                      fontWeight: 700,
                      overflowWrap: "anywhere",
                      cursor: "pointer",
                      border: 0,
                      background: "none",
                      p: 0,
                      font: "inherit",
                      textAlign: "left",
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
                <Box
                  sx={{
                    display: "grid",
                    gap: 1.5,
                    pt: 1,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontSize: "1rem" }}>
                      Assessment assignments (optional)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Keep this section empty to skip assessment assignments.
                    </Typography>
                  </Box>

                  {assessmentOptionsError && (
                    <Alert severity="error">
                      {assessmentOptionsError} You can still save the customer
                      without adding assessments.
                    </Alert>
                  )}

                  {editingCustomer && existingAssignments.length > 0 && (
                    <Box sx={{ display: "grid", gap: 1 }}>
                      <Typography variant="subtitle2">
                        Existing assessments (read-only)
                      </Typography>
                      {existingAssignments.map((assignment) => (
                        <Paper
                          key={assignment.id || assignment.assessmentId}
                          variant="outlined"
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                            gap: 1,
                            p: 1.25,
                          }}
                        >
                          <Typography variant="body2" fontWeight={600}>
                            {assignment.assessmentName ||
                              `Assessment ${assignment.assessmentId}`}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {assignment.frequency} time
                            {assignment.frequency === 1 ? "" : "s"} per{" "}
                            {assignment.frequencyUnit.toLowerCase()}
                          </Typography>
                        </Paper>
                      ))}
                    </Box>
                  )}

                  {newAssignments.map((assignment, index) => {
                    const existingIds = new Set(
                      existingAssignments.map((item) =>
                        String(item.assessmentId)
                      )
                    );
                    const selectedByOtherRows = new Set(
                      newAssignments
                        .filter((_, rowIndex) => rowIndex !== index)
                        .map((item) => String(item.assessmentId))
                    );
                    const availableOptions = assessmentOptions.filter(
                      (option) =>
                        !existingIds.has(String(option.id)) &&
                        (!selectedByOtherRows.has(String(option.id)) ||
                          String(option.id) === String(assignment.assessmentId))
                    );

                    return (
                      <Box
                        key={`new-assessment-${index}`}
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            sm: "minmax(0, 1.3fr) minmax(100px, 0.7fr) minmax(125px, 0.9fr) auto",
                          },
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <FormControl fullWidth size="small">
                          <InputLabel id={`assessment-select-${index}`}>
                            Assessment
                          </InputLabel>
                          <Select
                            labelId={`assessment-select-${index}`}
                            label="Assessment"
                            value={assignment.assessmentId}
                            onChange={(event) =>
                              updateAssessmentDraft(
                                index,
                                "assessmentId",
                                event.target.value
                              )
                            }
                            disabled={
                              loadingAssessments ||
                              Boolean(assessmentOptionsError) ||
                              saving
                            }
                          >
                            {availableOptions.map((option) => (
                              <MenuItem key={option.id} value={String(option.id)}>
                                {option.name}
                                {option.organisation
                                  ? ` — ${option.organisation}`
                                  : ""}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <TextField
                          label="Number of times"
                          type="number"
                          size="small"
                          value={assignment.frequency}
                          onChange={(event) =>
                            updateAssessmentDraft(
                              index,
                              "frequency",
                              event.target.value
                            )
                          }
                          inputProps={{ min: 1, step: 1 }}
                          disabled={saving}
                        />
                        <FormControl fullWidth size="small">
                          <InputLabel id={`frequency-unit-${index}`}>
                            Frequency
                          </InputLabel>
                          <Select
                            labelId={`frequency-unit-${index}`}
                            label="Frequency"
                            value={assignment.frequencyUnit}
                            onChange={(event) =>
                              updateAssessmentDraft(
                                index,
                                "frequencyUnit",
                                event.target.value
                              )
                            }
                            disabled={saving}
                          >
                            {frequencyUnits.map((unit) => (
                              <MenuItem key={unit} value={unit}>
                                {unit}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <IconButton
                          aria-label="Remove new assessment"
                          color="error"
                          onClick={() =>
                            setNewAssignments((current) =>
                              current.filter((_, rowIndex) => rowIndex !== index)
                            )
                          }
                          disabled={saving}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    );
                  })}

                  {loadingAssessments && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        py: 1,
                      }}
                    >
                      <CircularProgress size={22} />
                    </Box>
                  )}

                  {!loadingAssessments &&
                    !assessmentOptionsError &&
                    !hasSelectableAssessment && (
                      <Typography variant="body2" color="text.secondary">
                        {assessmentOptions.length === 0
                          ? "No active assessments are available."
                          : "All active assessments are assigned or selected."}
                      </Typography>
                    )}

                  <CommonButton
                    text="Add Assessment"
                    variant="outlined"
                    fullWidth={false}
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={addAssessmentDraft}
                    disabled={
                      loadingAssessments ||
                      Boolean(assessmentOptionsError) ||
                      !hasSelectableAssessment ||
                      saving
                    }
                    sx={{ justifySelf: "start" }}
                  />
                </Box>
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
