import { useState } from "react";

import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

import axiosInstance from "../utils/axiosInstance";

import CommonButton from "../components/CommonButton";
import CommonTable from "../components/CommonTable";

function UploadUsers() {
  const [selectedFile, setSelectedFile] = useState(null);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [importResult, setImportResult] = useState(null);

  // "create" or "compare"
  const [resultType, setResultType] = useState(null);

  // ============================================================
  // FILE CHANGE
  // ============================================================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setError("");
    setImportResult(null);
    setResultType(null);
    setSelectedFile(null);

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please select a CSV file.");
      return;
    }

    setSelectedFile(file);
  };

  // ============================================================
  // CREATE USERS
  // ============================================================

  const handleCreate = async () => {
    if (!selectedFile) {
      return;
    }

    setError("");
    setImportResult(null);
    setResultType(null);
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await axiosInstance.post(
        "/api/admin/users/import/create",
        formData
      );

      setImportResult(response.data);
      setResultType("create");
    } catch (err) {
      console.error("User creation failed:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 403) {
        setError(
          "You do not have permission to create/import users."
        );
      } else if (err.response?.status === 400) {
        setError(
          "Invalid CSV file. Please check the file and try again."
        );
      } else {
        setError(
          "Failed to create users. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // COMPARE USERS
  // ============================================================

  const handleCompare = async () => {
    if (!selectedFile) {
      return;
    }

    setError("");
    setImportResult(null);
    setResultType(null);
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await axiosInstance.post(
        "/api/admin/users/import/compare",
        formData
      );

      setImportResult(response.data);
      setResultType("compare");
    } catch (err) {
      console.error("User comparison failed:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 403) {
        setError(
          "You do not have permission to compare users."
        );
      } else if (err.response?.status === 400) {
        setError(
          "Invalid CSV file. Please check the file and try again."
        );
      } else {
        setError(
          "Failed to compare users. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // ERROR TABLE
  // ============================================================

  const errorColumns = [
    {
      field: "rowNumber",
      headerName: "Row",
    },
    {
      field: "email",
      headerName: "Email",
    },
    {
      field: "errors",
      headerName: "Errors",
    },
  ];

  const errorRows =
    importResult?.errors?.map((item, index) => ({
      id: index,
      rowNumber: item.rowNumber,
      email: item.email || "-",
      errors: item.errors?.join(", ") || "-",
    })) || [];

  // ============================================================
  // UI
  // ============================================================

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 72px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      <Card
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 900,
          borderRadius: 3,
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2,
              sm: 3,
              md: 4,
            },

            "&:last-child": {
              pb: {
                xs: 2,
                sm: 3,
                md: 4,
              },
            },
          }}
        >
          {/* Page Header */}

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 1,
            }}
          >
            Upload Users
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 3,
            }}
          >
            Upload a CSV file to compare existing users or create
            multiple users at once.
          </Typography>

          {/* Error Message */}

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
              }}
            >
              {error}
            </Alert>
          )}

          {/* File Upload Area */}

          <Box
            sx={{
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: 2,
              p: {
                xs: 3,
                sm: 4,
              },
              textAlign: "center",
              mb: 3,
            }}
          >
            <UploadFileIcon
              sx={{
                fontSize: 50,
                color: "primary.main",
                mb: 1,
              }}
            />

            <Typography
              variant="body1"
              sx={{
                mb: 2,
                fontWeight: 500,
              }}
            >
              Select a CSV file
            </Typography>

            <CommonButton
              
              variant="outlined"
              fullWidth={false}
              size="medium"
              disabled={loading}
              component="label"
              startIcon={<UploadFileIcon />}
              sx={{
                px: 3,
              }}
            >Choose CSV File
              <input
                type="file"
                hidden
                accept=".csv"
                onChange={handleFileChange}
              />
            </CommonButton>
          </Box>

          {/* Selected File */}

          {selectedFile && (
            <Box
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                backgroundColor: "action.hover",
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Selected file
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  wordBreak: "break-word",
                }}
              >
                {selectedFile.name}
              </Typography>
            </Box>
          )}

          {/* Compare + Create Buttons */}

          <Box
            sx={{
              display: "flex",
              justifyContent: {
                xs: "stretch",
                sm : "center",
                md: "flex-end",
              },
              gap: 2,
              flexDirection: {
                xs: "column",
                sm: "row",
              },
            }}
          >
            {/* Compare */}

            <CommonButton
              text={
                loading && resultType === "compare"
                  ? "Comparing..."
                  : "Compare"
              }
              variant="outlined"
              fullWidth={true}
              disabled={!selectedFile || loading}
              onClick={handleCompare}
              startIcon={
                loading && resultType === "compare" ? (
                  <CircularProgress
                    size={20}
                    color="inherit"
                  />
                ) : (
                  <CompareArrowsIcon />
                )
              }
              sx={{
                maxWidth: {
                  xs: "100%",
                  sm: 200,
                },
              }}
            />

            {/* Create */}

            <CommonButton
              text={
                loading && resultType === "create"
                  ? "Creating..."
                  : "Create"
              }
              variant="contained"
              fullWidth={true}
              disabled={!selectedFile || loading}
              onClick={handleCreate}
              startIcon={
                loading && resultType === "create" ? (
                  <CircularProgress
                    size={20}
                    color="inherit"
                  />
                ) : (
                  <UploadFileIcon />
                )
              }
              sx={{
                maxWidth: {
                  xs: "100%",
                  sm: 200,
                },
              }}
            />
          </Box>

          {/* ====================================================
              RESULT SECTION
              ==================================================== */}

          {importResult && (
            <>
              <Divider
                sx={{
                  my: 4,
                }}
              />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                {resultType === "compare"
                  ? "Comparison Result"
                  : "Import Result"}
              </Typography>

              {/* ==================================================
                  COMPARE RESULT
                  ================================================== */}

              {resultType === "compare" && (
                <>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                      },
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    {/* Total Records */}

                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        textAlign: "center",
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Total Records
                      </Typography>

                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          mt: 0.5,
                        }}
                      >
                        {importResult.totalRecords}
                      </Typography>
                    </Paper>

                    {/* Matching Records */}

                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        textAlign: "center",
                        borderRadius: 2,
                      }}
                    >
                      <CheckCircleIcon
                        sx={{
                          color: "info.main",
                        }}
                      />

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Matching Records
                      </Typography>

                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: "info.main",
                        }}
                      >
                        {importResult.matchingRecords}
                      </Typography>
                    </Paper>

                    {/* Ready To Create */}

                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        textAlign: "center",
                        borderRadius: 2,
                      }}
                    >
                      <CheckCircleIcon
                        sx={{
                          color: "success.main",
                        }}
                      />

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Ready to Create
                      </Typography>

                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: "success.main",
                        }}
                      >
                        {importResult.readyToCreateRecords}
                      </Typography>
                    </Paper>

                    {/* Failed Records */}

                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        textAlign: "center",
                        borderRadius: 2,
                       
                      }}
                    >
                      <ErrorIcon
                        sx={{
                          color: "error.main",
                        }}
                      />

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Failed Records
                      </Typography>

                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: "error.main",
                          
                        }}
                      >
                        {importResult.failedRecords}
                      </Typography>
                    </Paper>
                  </Box>

                  <Alert
                    severity="info"
                    sx={{
                      mb: 3,
                    }}
                  >
                    Comparison only checks the CSV against
                    existing users. No users were created or
                    modified.
                  </Alert>
                </>
              )}

              {/* ==================================================
                  CREATE RESULT
                  ================================================== */}

              {resultType === "create" && (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(3, 1fr)",
                    },
                    gap: 2,
                    mb: 3,
                  }}
                >
                  {/* Total Records */}

                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      textAlign: "center",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Total Records
                    </Typography>

                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mt: 0.5,
                      }}
                    >
                      {importResult.totalRecords}
                    </Typography>
                  </Paper>

                  {/* Successful */}

                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      textAlign: "center",
                      borderRadius: 2,
                    }}
                  >
                    <CheckCircleIcon
                      sx={{
                        color: "success.main",
                      }}
                    />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Successful
                    </Typography>

                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "success.main",
                      }}
                    >
                      {importResult.successfulRecords}
                    </Typography>
                  </Paper>

                  {/* Failed */}

                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      textAlign: "center",
                      borderRadius: 2,
                    }}
                  >
                    <ErrorIcon
                      sx={{
                        color: "error.main",
                      }}
                    />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Failed
                    </Typography>

                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "error.main",
                      }}
                    >
                      {importResult.failedRecords}
                    </Typography>
                  </Paper>
                </Box>
              )}

              {/* ==================================================
                  FAILED RECORDS TABLE
                  ================================================== */}

              {importResult.errors?.length > 0 && (
                <>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    Failed Records
                  </Typography>

                  <Box sx={{ display: { xs: "none", sm: "block" } }}>
                    <CommonTable
                      columns={errorColumns}
                      rows={errorRows}
                      rowKey="id"
                      emptyMessage="No failed records"
                      compact
                    />
                  </Box>

                  <Box
                    sx={{
                      display: { xs: "grid", sm: "none" },
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(2, minmax(0, 1fr))",
                      },
                      gap: 1.25,
                    }}
                  >
                    {errorRows.map((row) => (
                      <Paper
                        key={row.id}
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
                            mb: 1,
                            fontWeight: 700,
                          }}
                        >
                          Row {row.rowNumber}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          Email
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            overflowWrap: "anywhere",
                            mb: 1,
                          }}
                        >
                          {row.email}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          Errors
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ overflowWrap: "anywhere" }}
                        >
                          {row.errors}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                </>
              )}

              {/* ==================================================
                  CREATE SUCCESS
                  ================================================== */}

              {resultType === "create" &&
                importResult.failedRecords === 0 && (
                  <Alert
                    severity="success"
                    sx={{
                      mt: 3,
                    }}
                  >
                    All users were created successfully.
                  </Alert>
                )}

              {/* ==================================================
                  COMPARE SUCCESS
                  ================================================== */}

              {resultType === "compare" &&
                importResult.failedRecords === 0 &&
                importResult.readyToCreateRecords > 0 && (
                  <Alert
                    severity="success"
                    sx={{
                      mt: 3,
                    }}
                  >
                    Comparison completed successfully.{" "}
                    {importResult.readyToCreateRecords} user
                    {importResult.readyToCreateRecords !== 1
                      ? "s"
                      : ""}{" "}
                    are ready to be created.
                  </Alert>
                )}

              {resultType === "compare" &&
                importResult.failedRecords === 0 &&
                importResult.readyToCreateRecords === 0 && (
                  <Alert
                    severity="info"
                    sx={{
                      mt: 3,
                    }}
                  >
                    All valid users from the CSV already exist
                    in the database.
                  </Alert>
                )}
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default UploadUsers;