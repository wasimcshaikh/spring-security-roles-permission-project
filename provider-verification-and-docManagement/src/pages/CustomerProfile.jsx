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
  Menu,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";

import CommonButton from "../components/CommonButton";
import CommonTable from "../components/CommonTable";
import CustomerCompliance from "../components/CustomerCompliance";
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

const formatColumnName = (field) => {
  if (field === "assessmentName") {
    return "Title";
  }

  return field
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (character) => character.toUpperCase());
};

const formatAssignmentValue = (value, field) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "boolean") {
    if (field === "active") {
      return value ? "Active" : "Inactive";
    }
    return value ? "Yes" : "No";
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return value.split("T")[0];
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return value;
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
  const [completeAssessmentDialogOpen, setCompleteAssessmentDialogOpen] =
    useState(false);
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [loadingPendingAssignments, setLoadingPendingAssignments] =
    useState(false);
  const [pendingAssignmentsError, setPendingAssignmentsError] = useState("");
  const [selectedPendingAssessmentId, setSelectedPendingAssessmentId] =
    useState("");
  const [completingAssessment, setCompletingAssessment] = useState(false);
  const [completeAssessmentError, setCompleteAssessmentError] = useState("");
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [completedCount, setCompletedCount] = useState("");
  const [assignmentForm, setAssignmentForm] = useState(emptyAssignment);
  const [formError, setFormError] = useState("");
  const [completionError, setCompletionError] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingCompletion, setSavingCompletion] = useState(false);
  const [success, setSuccess] = useState("");
  const [selectedProfileTab, setSelectedProfileTab] = useState(0);

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

  const openCompleteAssessmentDialog = async () => {
    setPendingAssignments([]);
    setSelectedPendingAssessmentId("");
    setPendingAssignmentsError("");
    setCompleteAssessmentError("");
    setCompleteAssessmentDialogOpen(true);
    setLoadingPendingAssignments(true);

    try {
      const response = await axiosInstance.get(
        `/api/admin/customers/assessments/${customerId}/pending-assessments`
      );
      if (!Array.isArray(response.data)) {
        throw new Error("The pending assessments response was not a list.");
      }

      setPendingAssignments(response.data);
    } catch (fetchError) {
      console.error("Failed to fetch pending assessments:", fetchError);
      setPendingAssignmentsError(
        getApiErrorMessage(fetchError, "Unable to load pending assessments.")
      );
    } finally {
      setLoadingPendingAssignments(false);
    }
  };

  const closeCompleteAssessmentDialog = () => {
    if (!completingAssessment) {
      setCompleteAssessmentDialogOpen(false);
      setCompleteAssessmentError("");
    }
  };

  const handleCompleteAssessment = async (event) => {
    event.preventDefault();
    setCompleteAssessmentError("");

    const selectedAssignment = pendingAssignments.find(
      (assignment) =>
        String(assignment.assessmentId) ===
        String(selectedPendingAssessmentId)
    );

    if (!selectedAssignment) {
      setCompleteAssessmentError("Select an assessment to complete.");
      return;
    }

    try {
      setCompletingAssessment(true);
      const response = await axiosInstance.patch(
        `/api/admin/customers/assessments/${customerId}/${selectedAssignment.assessmentId}/complete`
      );

      if (
        !response.data ||
        String(response.data.assessmentId) !==
          String(selectedAssignment.assessmentId)
      ) {
        throw new Error("The completed assessment response was invalid.");
      }

      setAssignments((current) =>
        current.map((assignment) =>
          String(assignment.id) === String(response.data.id)
            ? response.data
            : assignment
        )
      );
      setPendingAssignments((current) =>
        current.filter(
          (assignment) =>
            String(assignment.assessmentId) !==
            String(response.data.assessmentId)
        )
      );
      setSuccess(`${response.data.assessmentName} completed successfully.`);
      setCompleteAssessmentDialogOpen(false);
    } catch (submitError) {
      console.error("Failed to complete assessment:", submitError);
      setCompleteAssessmentError(
        getApiErrorMessage(submitError, "Unable to complete this assessment.")
      );
    } finally {
      setCompletingAssessment(false);
    }
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

  const openAssignmentActions = (event, assignment) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedAssignment(assignment);
  };

  const closeAssignmentActions = () => {
    setActionMenuAnchor(null);
  };

  const openCompletionDialog = () => {
    if (!selectedAssignment) {
      return;
    }

    setCompletedCount(String(selectedAssignment.completedCount ?? 0));
    setCompletionError("");
    setCompletionDialogOpen(true);
    closeAssignmentActions();
  };

  const closeCompletionDialog = () => {
    if (!savingCompletion) {
      setCompletionDialogOpen(false);
      setCompletionError("");
      setSelectedAssignment(null);
    }
  };

  const handleSaveCompletion = async (event) => {
    event.preventDefault();
    setCompletionError("");

    const newCompletedCount = Number(completedCount);
    const frequency = Number(selectedAssignment?.frequency);
    if (
      !selectedAssignment ||
      completedCount === "" ||
      !Number.isInteger(newCompletedCount) ||
      newCompletedCount < 0 ||
      !Number.isInteger(frequency) ||
      newCompletedCount > frequency
    ) {
      setCompletionError(
        `Enter a whole number between 0 and ${frequency || 0}.`
      );
      return;
    }

    try {
      setSavingCompletion(true);
      const response = await axiosInstance.patch(
        `/api/admin/customers/assessments/${customerId}/${selectedAssignment.id}/completion`,
        { completedCount: newCompletedCount }
      );

      if (
        !response.data ||
        String(response.data.id) !== String(selectedAssignment.id)
      ) {
        throw new Error("The completion update response was invalid.");
      }

      setAssignments((current) =>
        current.map((assignment) =>
          String(assignment.id) === String(response.data.id)
            ? response.data
            : assignment
        )
      );
      setSuccess("Assessment completion updated successfully.");
      setCompletionDialogOpen(false);
      setSelectedAssignment(null);
    } catch (submitError) {
      console.error("Failed to update assessment completion:", submitError);
      setCompletionError(
        getApiErrorMessage(
          submitError,
          "Unable to update assessment completion."
        )
      );
    } finally {
      setSavingCompletion(false);
    }
  };

  const assignmentFields = [
    ...new Set(assignments.flatMap((assignment) => Object.keys(assignment))),
  ];
  const assignmentColumns = assignmentFields.map((field) => ({
    field,
    headerName: formatColumnName(field),
  }));
  const assignmentRows = assignments.map((assignment) =>
    Object.fromEntries(
      assignmentFields.map((field) => [
        field,
        formatAssignmentValue(assignment[field], field),
      ])
    )
  );
  const renderRowActions = (row) => {
    const assignment = assignments.find(
      (item) => String(item.id) === String(row.id)
    );

    return (
      <IconButton
        aria-label="Assessment actions"
        aria-haspopup="menu"
        onClick={(event) => {
          if (assignment) {
            openAssignmentActions(event, assignment);
          }
        }}
      >
        <MoreVertIcon />
      </IconButton>
    );
  };

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
            <Tabs
              value={selectedProfileTab}
              onChange={(_, newValue) => setSelectedProfileTab(newValue)}
              aria-label="Customer profile sections"
              variant="scrollable"
              allowScrollButtonsMobile
              sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
            >
              <Tab label="Treatment Plan" />
              <Tab label="Assessment" />
              <Tab label="Compliance" />
            </Tabs>

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
                <Typography variant="h4" fontWeight={800}>
                  {selectedProfileTab === 0
                    ? "Treatment Plan"
                    : selectedProfileTab === 1
                      ? "Assessment"
                      : "Compliance Summary"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedProfileTab === 0
                    ? `Assessments assigned to ${customer.fullName} under the treatment plan.`
                    : selectedProfileTab === 1
                      ? `Assessments assigned to ${customer.fullName}.`
                      : `Completion progress across ${customer.fullName}'s assigned assessments.`}
                </Typography>
              </Box>
              {selectedProfileTab !== 2 && (
                <CommonButton
                  text={
                    selectedProfileTab === 0
                      ? "Assign Assessment"
                      : "Complete Assessment"
                  }
                  variant="contained"
                  fullWidth={false}
                  size="medium"
                  startIcon={<AddIcon />}
                  onClick={
                    selectedProfileTab === 0
                      ? openAssignDialog
                      : openCompleteAssessmentDialog
                  }
                  disabled={
                    selectedProfileTab === 0
                      ? loadingAssessments
                      : completingAssessment
                  }
                  sx={{ whiteSpace: "nowrap" }}
                />
              )}
            </Box>

            {selectedProfileTab === 2 ? (
              <CustomerCompliance
                assignments={assignments}
                customerName={customer.fullName}
              />
            ) : (
              <>
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
              </>
            )}
          </Paper>
        </>
      )}

      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={closeAssignmentActions}
      >
        <MenuItem onClick={openCompletionDialog}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
      </Menu>

      <Dialog
        open={completionDialogOpen}
        onClose={closeCompletionDialog}
        fullWidth
        maxWidth="xs"
      >
        <Box component="form" onSubmit={handleSaveCompletion}>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Mark Assessment Completed
            <IconButton
              aria-label="Close dialog"
              onClick={closeCompletionDialog}
              disabled={savingCompletion}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ display: "grid", gap: 2, pt: "8px !important" }}>
            {completionError && (
              <Alert severity="error">{completionError}</Alert>
            )}
            <Typography variant="body2" color="text.secondary">
              {selectedAssignment?.assessmentName
                ? `Enter how many ${selectedAssignment.assessmentName} assessments have been completed.`
                : "Enter the completed assessment count."}
            </Typography>
            <TextField
              label="Completed count"
              type="number"
              value={completedCount}
              onChange={(event) => setCompletedCount(event.target.value)}
              inputProps={{
                min: 0,
                max: selectedAssignment?.frequency,
                step: 1,
              }}
              helperText={`Enter a whole number from 0 to ${
                selectedAssignment?.frequency ?? 0
              }.`}
              required
              fullWidth
              disabled={savingCompletion}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <CommonButton
              text="Cancel"
              variant="outlined"
              fullWidth={false}
              size="medium"
              onClick={closeCompletionDialog}
              disabled={savingCompletion}
            />
            <CommonButton
              text={savingCompletion ? "Saving..." : "Save"}
              type="submit"
              fullWidth={false}
              size="medium"
              disabled={savingCompletion || !selectedAssignment}
            />
          </DialogActions>
        </Box>
      </Dialog>

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

      <Dialog
        open={completeAssessmentDialogOpen}
        onClose={closeCompleteAssessmentDialog}
        fullWidth
        maxWidth="xs"
      >
        <Box component="form" onSubmit={handleCompleteAssessment}>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Complete Assessment
            <IconButton
              aria-label="Close dialog"
              onClick={closeCompleteAssessmentDialog}
              disabled={completingAssessment}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ display: "grid", gap: 2, pt: "8px !important" }}>
            {completeAssessmentError && (
              <Alert severity="error">{completeAssessmentError}</Alert>
            )}
            {pendingAssignmentsError && (
              <Alert severity="error">{pendingAssignmentsError}</Alert>
            )}
            {loadingPendingAssignments ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <CircularProgress />
              </Box>
            ) : pendingAssignmentsError ? null : pendingAssignments.length ===
              0 ? (
              <Alert severity="info">
                There are no pending assessments to complete.
              </Alert>
            ) : (
              <FormControl fullWidth required>
                <InputLabel id="pending-assessment-select">
                  Assessment
                </InputLabel>
                <Select
                  labelId="pending-assessment-select"
                  label="Assessment"
                  value={selectedPendingAssessmentId}
                  onChange={(event) =>
                    setSelectedPendingAssessmentId(event.target.value)
                  }
                  disabled={completingAssessment}
                >
                  {pendingAssignments.map((assignment) => (
                    <MenuItem
                      key={assignment.id}
                      value={String(assignment.assessmentId)}
                    >
                      {assignment.assessmentName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <CommonButton
              text="Cancel"
              variant="outlined"
              fullWidth={false}
              size="medium"
              onClick={closeCompleteAssessmentDialog}
              disabled={completingAssessment}
            />
            <CommonButton
              text={completingAssessment ? "Completing..." : "Submit"}
              type="submit"
              fullWidth={false}
              size="medium"
              disabled={
                completingAssessment ||
                loadingPendingAssignments ||
                Boolean(pendingAssignmentsError) ||
                pendingAssignments.length === 0
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
