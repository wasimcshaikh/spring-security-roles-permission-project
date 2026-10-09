import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Avatar,
  Box,
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";

import CommonButton from "../components/CommonButton";
import CommonTable from "../components/CommonTable";
import axiosInstance from "../utils/axiosInstance";

const frequencyUnits = ["DAY", "WEEK", "MONTH"];
const emptyAssignment = {
  assessmentId: "",
  frequency: "",
  frequencyUnit: "WEEK",
};

const getApiErrorMessage = (error, fallback) => {
  const responseData = error.response?.data;

  if (typeof responseData === "string" && responseData.trim()) {
    return responseData;
  }
  if (
    responseData &&
    typeof responseData === "object" &&
    typeof responseData.message === "string" &&
    responseData.message.trim()
  ) {
    return responseData.message;
  }
  return error.message || fallback;
};

function CustomerProfile() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAssessments, setLoadingAssessments] = useState(true);
  const [error, setError] = useState("");
  const [assessmentOptionsError, setAssessmentOptionsError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState(emptyAssignment);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const availableAssessments = useMemo(
    () =>
      assessments.filter(
        (assessment) =>
          !assignments.some(
            (assignment) =>
              String(assignment.assessmentId) === String(assessment.id)
          )
      ),
    [assessments, assignments]
  );

  useEffect(() => {
    let active = true;

    const fetchCustomerProfile = async () => {
      setLoading(true);
      setError("");
      setCustomer(null);
      setAssignments([]);

      try {
        const response = await axiosInstance.get(
          `/api/admin/customers/${customerId}`
        );
        const customerDetails = response.data;

        if (
          !customerDetails ||
          String(customerDetails.id) !== String(customerId)
        ) {
          throw new Error("The customer response was invalid.");
        }

        const assignmentsResponse = await axiosInstance.get(
          `/api/admin/customers/assessments/${customerId}`
        );
        if (!Array.isArray(assignmentsResponse.data)) {
          throw new Error("The customer assessments response was not a list.");
        }

        if (active) {
          setCustomer(customerDetails);
          setAssignments(assignmentsResponse.data);
        }
      } catch (fetchError) {
        console.error("Failed to fetch customer profile:", fetchError);
        if (active) {
          setError(
            getApiErrorMessage(fetchError, "Unable to load customer profile.")
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchCustomerProfile();
    return () => {
      active = false;
    };
  }, [customerId]);

  useEffect(() => {
    let active = true;

    const fetchAssessments = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/assessments");
        if (!Array.isArray(response.data)) {
          throw new Error("The assessments response was not a list.");
        }
        if (active) {
          setAssessments(
            response.data.filter(
              (assessment) =>
                assessment.active !== false && assessment.id != null
            )
          );
        }
      } catch (fetchError) {
        console.error("Failed to fetch assessment options:", fetchError);
        if (active) {
          setAssessmentOptionsError(
            getApiErrorMessage(fetchError, "Unable to load assessments.")
          );
        }
      } finally {
        if (active) {
          setLoadingAssessments(false);
        }
      }
    };

    fetchAssessments();
    return () => {
      active = false;
    };
  }, []);

  const openAssignDialog = () => {
    setAssignmentForm(emptyAssignment);
    setFormError("");
    setDialogOpen(true);
  };

  const closeAssignDialog = () => {
    if (!saving) {
      setDialogOpen(false);
      setFormError("");
    }
  };

  const handleAssignAssessment = async (event) => {
    event.preventDefault();
    setFormError("");

    const assessmentId = Number(assignmentForm.assessmentId);
    const frequency = Number(assignmentForm.frequency);
    if (
      !Number.isInteger(assessmentId) ||
      assessmentId <= 0 ||
      !Number.isInteger(frequency) ||
      frequency <= 0 ||
      !frequencyUnits.includes(assignmentForm.frequencyUnit)
    ) {
      setFormError(
        "Select an assessment, enter a number of times greater than zero, and choose a frequency."
      );
      return;
    }

    if (
      assignments.some(
        (assignment) =>
          String(assignment.assessmentId) === String(assessmentId)
      )
    ) {
      setFormError("This assessment is already assigned to the customer.");
      return;
    }

    try {
      setSaving(true);
      const response = await axiosInstance.post(
        `/api/admin/customers/assessments/${customerId}`,
        {
          assessmentId,
          frequency,
          frequencyUnit: assignmentForm.frequencyUnit,
        }
      );

      if (
        !response.data ||
        String(response.data.assessmentId) !== String(assessmentId)
      ) {
        throw new Error("The assessment assignment response was invalid.");
      }

      setAssignments((current) => [...current, response.data]);
      setCustomer((current) => ({
        ...current,
        isAssessmentAssigned: true,
      }));
      setSuccess("Assessment assigned successfully.");
      setDialogOpen(false);
    } catch (submitError) {
      console.error("Failed to assign assessment:", submitError);
      setFormError(
        getApiErrorMessage(submitError, "Unable to assign this assessment.")
      );
    } finally {
      setSaving(false);
    }
  };

  const assignmentColumns = [
    { field: "id", headerName: "ID" },
    { field: "customerId", headerName: "Customer ID" },
    { field: "assessmentId", headerName: "Assessment ID" },
    { field: "assessmentName", headerName: "Title" },
    { field: "organisation", headerName: "Organisation" },
    { field: "frequency", headerName: "Number of Times" },
    { field: "frequencyUnit", headerName: "Frequency" },
    { field: "active", headerName: "Status" },
    { field: "createdAt", headerName: "Created At" },
    { field: "updatedAt", headerName: "Updated At" },
  ];
  const assignmentRows = assignments.map((assignment) => ({
    ...assignment,
    assessmentName: assignment.assessmentName || "—",
    organisation: assignment.organisation || "—",
    frequency: assignment.frequency ?? "—",
    frequencyUnit: assignment.frequencyUnit || "—",
    active:
      typeof assignment.active === "boolean"
        ? assignment.active
          ? "Active"
          : "Inactive"
        : "—",
    createdAt:
      typeof assignment.createdAt === "string"
        ? assignment.createdAt.split("T")[0]
        : "—",
    updatedAt:
      typeof assignment.updatedAt === "string"
        ? assignment.updatedAt.split("T")[0]
        : "—",
  }));
  const renderRowActions = () => (
    <IconButton aria-label="Assessment actions">
      <MoreVertIcon />
    </IconButton>
  );

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 72px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8fafc",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            aria-label="Back to customers"
            onClick={() => navigate("/customers")}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#0f172a",
                fontSize: { xs: "1.65rem", sm: "2.125rem" },
              }}
            >
              Customer Profile
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View customer details and assigned assessments.
            </Typography>
          </Box>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>
      )}

      {customer && (
        <>
          <Paper
            elevation={0}
            sx={{
              mb: 3,
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              p: { xs: 2, sm: 3 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 2.5,
              }}
            >
              <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main" }}>
                <PersonIcon fontSize="large" />
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h5" fontWeight={700} sx={{ overflowWrap: "anywhere" }}>
                  {customer.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Customer ID: {customer.id}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                },
                gap: 1.5,
              }}
            >
              <ProfileDetail
                icon={<PersonIcon color="primary" />}
                label="Full Name"
                value={customer.fullName}
              />
              <ProfileDetail
                icon={<EmailIcon color="primary" />}
                label="Email"
                value={customer.email}
              />
              <ProfileDetail
                icon={<PhoneIcon color="primary" />}
                label="Phone Number"
                value={customer.phoneNumber}
              />
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              p: { xs: 1.5, sm: 2.5 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "row" },
                gap: 1.5,
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Assigned Assessments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Assessments assigned to {customer.fullName}.
                </Typography>
              </Box>
              <CommonButton
                text="Assign Assessment"
                variant="contained"
                fullWidth={false}
                size="medium"
                startIcon={<AddIcon />}
                onClick={openAssignDialog}
                disabled={
                  loadingAssessments ||
                  Boolean(assessmentOptionsError) ||
                  availableAssessments.length === 0
                }
                sx={{ whiteSpace: "nowrap" }}
              />
            </Box>

            {assessmentOptionsError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {assessmentOptionsError}
              </Alert>
            )}

            <CommonTable
              columns={assignmentColumns}
              rows={assignmentRows}
              actions={renderRowActions}
              rowKey="id"
              emptyMessage="No assessments are assigned to this customer."
              compact
            />
          </Paper>
        </>
      )}

      <Dialog
        open={dialogOpen}
        onClose={closeAssignDialog}
        fullWidth
        maxWidth="sm"
      >
        <Box component="form" onSubmit={handleAssignAssessment}>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Assign Assessment
            <IconButton
              aria-label="Close dialog"
              onClick={closeAssignDialog}
              disabled={saving}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ display: "grid", gap: 2, pt: "8px !important" }}>
            {formError && <Alert severity="error">{formError}</Alert>}
            {loadingAssessments ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <CircularProgress />
              </Box>
            ) : assessmentOptionsError ? (
              <Alert severity="error">{assessmentOptionsError}</Alert>
            ) : availableAssessments.length === 0 ? (
              <Alert severity="info">
                There are no unassigned assessments available.
              </Alert>
            ) : (
              <>
                <FormControl fullWidth required>
                  <InputLabel id="profile-assessment-select">
                    Assessment
                  </InputLabel>
                  <Select
                    labelId="profile-assessment-select"
                    label="Assessment"
                    value={assignmentForm.assessmentId}
                    onChange={(event) =>
                      setAssignmentForm((current) => ({
                        ...current,
                        assessmentId: event.target.value,
                      }))
                    }
                    disabled={saving}
                  >
                    {availableAssessments.map((assessment) => (
                      <MenuItem
                        key={assessment.id}
                        value={String(assessment.id)}
                      >
                        {assessment.name}
                        {assessment.organisation
                          ? ` — ${assessment.organisation}`
                          : ""}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "minmax(0, 1fr) minmax(0, 1fr)",
                    },
                    gap: 2,
                  }}
                >
                  <TextField
                    label="Number of times"
                    type="number"
                    value={assignmentForm.frequency}
                    onChange={(event) =>
                      setAssignmentForm((current) => ({
                        ...current,
                        frequency: event.target.value,
                      }))
                    }
                    inputProps={{ min: 1, step: 1 }}
                    required
                    disabled={saving}
                  />
                  <FormControl fullWidth required>
                    <InputLabel id="profile-frequency-unit">
                      Frequency
                    </InputLabel>
                    <Select
                      labelId="profile-frequency-unit"
                      label="Frequency"
                      value={assignmentForm.frequencyUnit}
                      onChange={(event) =>
                        setAssignmentForm((current) => ({
                          ...current,
                          frequencyUnit: event.target.value,
                        }))
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
              onClick={closeAssignDialog}
              disabled={saving}
            />
            <CommonButton
              text={saving ? "Assigning..." : "Submit"}
              type="submit"
              fullWidth={false}
              size="medium"
              disabled={
                saving ||
                loadingAssessments ||
                Boolean(assessmentOptionsError) ||
                availableAssessments.length === 0
              }
            />
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

function ProfileDetail({ icon, label, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 1.75,
        borderRadius: 1.5,
        backgroundColor: "#f8fafc",
        minWidth: 0,
      }}
    >
      {icon}
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1" fontWeight={600} sx={{ overflowWrap: "anywhere" }}>
          {value || "—"}
        </Typography>
      </Box>
    </Box>
  );
}

export default CustomerProfile;
