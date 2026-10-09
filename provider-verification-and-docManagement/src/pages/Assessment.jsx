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

const emptyForm = { name: "", organisation: "", file: null };

const base64ToFile = (base64Data, fileName, fileType) => {
  if (typeof base64Data !== "string" || !base64Data) {
    throw new Error("The assessment response did not include its file data.");
  }

  const base64 = base64Data.replace(/^data:[^;]+;base64,/, "");
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (character) =>
    character.charCodeAt(0)
  );

  return new File([bytes], fileName, {
    type: fileType || "application/octet-stream",
  });
};

const formatDate = (value) => {
  if (!value) {
    return "—";
  }

  return typeof value === "string" && value.includes("T")
    ? value.split("T")[0]
    : value;
};

const toAssessmentRow = (assessment) => ({
  ...assessment,
  status: assessment.active ? "Active" : "Inactive",
  createdAt: formatDate(assessment.createdAt),
  updatedAt: formatDate(assessment.updatedAt),
});

const getApiErrorMessage = (error) => {
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

  return null;
};

function Assessment() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [loadingAssessment, setLoadingAssessment] = useState(false);
  const [saving, setSaving] = useState(false);
  const [assessmentToDelete, setAssessmentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Assessment" },
    { field: "organisation", headerName: "Organisation" },
    { field: "fileName", headerName: "File Name" },
    { field: "fileType", headerName: "File Type" },
    { field: "status", headerName: "Status" },
    { field: "createdAt", headerName: "Created At" },
    { field: "updatedAt", headerName: "Updated At" },
  ];

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/assessments");
        if (!Array.isArray(response.data)) {
          throw new Error("The assessments response was not a list.");
        }

        setAssessments(response.data.map(toAssessmentRow));
      } catch (fetchError) {
        console.error("Failed to fetch assessments:", fetchError);
        setError(
          fetchError.response?.data?.message ||
            fetchError.message ||
            "Unable to fetch assessments."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const openCreateDialog = () => {
    setEditingAssessment(null);
    setFormData(emptyForm);
    setFormError("");
    setDialogOpen(true);
  };

  const openUpdateDialog = (assessment) => {
    setEditingAssessment(assessment);
    setFormData(emptyForm);
    setFormError("");
    setDialogOpen(true);
    setLoadingAssessment(true);

    axiosInstance
      .get(`/api/admin/assessments/${assessment.id}`)
      .then(({ data }) => {
        if (!data || String(data.id) !== String(assessment.id)) {
          throw new Error("The assessment response was invalid.");
        }

        setEditingAssessment(data);
        setFormData({
          name: data.name || "",
          organisation: data.organisation || "",
          file: null,
        });
      })
      .catch((fetchError) => {
        console.error("Failed to fetch assessment details:", fetchError);
        setFormError(
          fetchError.response?.data?.message ||
            fetchError.message ||
            "Unable to load assessment details."
        );
      })
      .finally(() => {
        setLoadingAssessment(false);
      });
  };

  const closeFormDialog = () => {
    if (!saving && !loadingAssessment) {
      setDialogOpen(false);
      setFormError("");
    }
  };

  const handleFormChange = (event) => {
    const { name, value, files } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: files ? files[0] || null : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!formData.name.trim() || !formData.organisation.trim()) {
      setFormError("Enter the assessment name and organisation.");
      return;
    }

    let assessmentFile = formData.file;
    if (!assessmentFile && editingAssessment) {
      try {
        assessmentFile = base64ToFile(
          editingAssessment.fileData,
          editingAssessment.fileName,
          editingAssessment.fileType
        );
      } catch (fileError) {
        setFormError(
          fileError.message ||
            "The existing assessment file could not be loaded. Choose a replacement PDF."
        );
        return;
      }
    }

    if (!assessmentFile) {
      setFormError("Choose a PDF file.");
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name.trim());
    payload.append("organisation", formData.organisation.trim());
    payload.append("file", assessmentFile);

    try {
      setSaving(true);
      const response = editingAssessment
        ? await axiosInstance.put(
            `/api/admin/assessments/${editingAssessment.id}`,
            payload
          )
        : await axiosInstance.post("/api/admin/assessments", payload);

      const savedAssessment = toAssessmentRow(response.data);
      setAssessments((current) =>
        editingAssessment
          ? current.map((item) =>
              item.id === savedAssessment.id ? savedAssessment : item
            )
          : [...current, savedAssessment]
      );
      setSuccess(
        editingAssessment
          ? "Assessment updated successfully."
          : "Assessment created successfully."
      );
      setDialogOpen(false);
      setFormData(emptyForm);
      setEditingAssessment(null);
    } catch (submitError) {
      console.error("Failed to save assessment:", submitError);
      setFormError(
        getApiErrorMessage(submitError) ||
          "Unable to save the assessment. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!assessmentToDelete) {
      return;
    }

    try {
      setDeleting(true);
      await axiosInstance.delete(
        `/api/admin/assessments/${assessmentToDelete.id}`
      );
      setAssessments((current) =>
        current.filter((item) => item.id !== assessmentToDelete.id)
      );
      setSuccess("Assessment deactivated successfully.");
      setAssessmentToDelete(null);
    } catch (deleteError) {
      console.error("Failed to deactivate assessment:", deleteError);
      setError(
        deleteError.response?.data?.message ||
          "Unable to delete the assessment. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  const renderActions = (assessment) => (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
      }}
    >
      <CommonButton
        text="Update"
        variant="outlined"
        fullWidth={false}
        size="small"
        startIcon={<EditIcon />}
        onClick={() => openUpdateDialog(assessment)}
      />
      <CommonButton
        text="Delete"
        variant="outlined"
        color="error"
        fullWidth={false}
        size="small"
        startIcon={<DeleteIcon />}
        onClick={() => setAssessmentToDelete(assessment)}
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
          Assessments
        </Typography>
        <CommonButton
          text="Create New"
          variant="contained"
          fullWidth={false}
          size="medium"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
          sx={{ alignSelf: { xs: "flex-end", sm: "auto" }, whiteSpace: "nowrap" }}
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
              rows={assessments}
              actions={renderActions}
              rowKey="id"
              emptyMessage="No assessments found"
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
            {assessments.length === 0 ? (
              <Typography
                align="center"
                color="text.secondary"
                sx={{ py: 3, gridColumn: "1 / -1" }}
              >
                No assessments found
              </Typography>
            ) : (
              assessments.map((assessment) => (
                <Paper
                  key={assessment.id}
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
                    {assessment.name}
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 1,
                      mb: 1.5,
                    }}
                  >
                    {[
                      ["ID", assessment.id],
                      ["Organisation", assessment.organisation],
                      ["File Name", assessment.fileName],
                      ["File Type", assessment.fileType],
                      ["Status", assessment.status],
                      ["Created At", assessment.createdAt],
                      ["Updated At", assessment.updatedAt],
                    ].map(([label, value]) => (
                      <Box key={label} sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="text.secondary">
                          {label}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ overflowWrap: "anywhere" }}
                        >
                          {value ?? "—"}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {renderActions(assessment)}
                </Paper>
              ))
            )}
          </Box>
        </>
      )}

      <Dialog
        open={dialogOpen}
        onClose={closeFormDialog}
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
            {editingAssessment ? "Update Assessment" : "Create Assessment"}
            <IconButton
              aria-label="Close dialog"
              onClick={closeFormDialog}
              disabled={saving || loadingAssessment}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ display: "grid", gap: 2, pt: "8px !important" }}>
            {formError && <Alert severity="error">{formError}</Alert>}
            {loadingAssessment ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
            <TextField
              label="Assessment name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              required
              fullWidth
            />
            <TextField
              label="Organisation"
              name="organisation"
              value={formData.organisation}
              onChange={handleFormChange}
              required
              fullWidth
            />
            <Typography variant="body2" color="text.secondary">
              {formData.file
                ? `Selected file: ${formData.file.name}`
                : editingAssessment
                  ? `Current file: ${editingAssessment.fileName}`
                  : "No file selected"}
            </Typography>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ py: 1.25 }}
            >
              {formData.file
                ? "Replace selected PDF"
                : editingAssessment
                  ? "Choose replacement PDF (optional)"
                  : "Choose PDF"}
              <input
                hidden
                type="file"
                name="file"
                accept=".pdf,application/pdf"
                onChange={handleFormChange}
              />
            </Button>
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <CommonButton
              text="Cancel"
              variant="outlined"
              fullWidth={false}
              size="medium"
              onClick={closeFormDialog}
              disabled={saving || loadingAssessment}
            />
            <CommonButton
              text={
                saving
                  ? "Saving..."
                  : editingAssessment
                    ? "Save Changes"
                    : "Create"
              }
              type="submit"
              fullWidth={false}
              size="medium"
              disabled={saving || loadingAssessment}
            />
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog
        open={Boolean(assessmentToDelete)}
        onClose={deleting ? undefined : () => setAssessmentToDelete(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Deactivate Assessment</DialogTitle>
        <DialogContent>
          <Typography>
            Deactivate “{assessmentToDelete?.name}”? It will no longer appear in
            the assessment list.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <CommonButton
            text="Cancel"
            variant="outlined"
            fullWidth={false}
            size="medium"
            onClick={() => setAssessmentToDelete(null)}
            disabled={deleting}
          />
          <CommonButton
            text={deleting ? "Deleting..." : "Delete"}
            variant="contained"
            color="error"
            fullWidth={false}
            size="medium"
            onClick={handleDelete}
            disabled={deleting}
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Assessment;
