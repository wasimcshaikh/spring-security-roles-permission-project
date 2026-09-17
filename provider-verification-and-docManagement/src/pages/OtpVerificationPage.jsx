import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import axios from "axios";

import CommonButton from "../components/CommonButton";

function OtpVerificationPage() {

  const navigate = useNavigate();

  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  const pageSx = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    px: { xs: 2, sm: 3 },
    py: { xs: 4, sm: 6 },
    background: "linear-gradient(135deg, #67c8f6 0%, #f8fbff 52%, #e9f7f3 100%)",
  };

  const cardSx = {
    width: "100%",
    maxWidth: 460,
    p: { xs: 3, sm: 5 },
    border: "1px solid rgba(24, 91, 117, 0.1)",
    borderRadius: 4,
    boxShadow: "0 24px 70px rgba(30, 67, 88, 0.14)",
  };

  /*
   * Get email stored during signup
   */
  const email =
    sessionStorage.getItem("registrationEmail");

  const handleChange = (event) => {

    const value = event.target.value;

    /*
     * Allow only digits
     * Maximum 6 digits
     */
    if (/^\d{0,6}$/.test(value)) {

      setOtp(value);

      setError("");
    }
  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");

    if (otp.length !== 6) {

      setError("OTP must be 6 digits");

      return;
    }

    try {

      setLoading(true);

      await axios.post(
        "http://localhost:8080/api/providers/verify-otp",
        {
          email: email,
          otp: otp,
        }
      );

      setSuccess(
        "OTP verified successfully. Your account has been created."
      );

      /*
       * Remove temporary email
       */
      sessionStorage.removeItem(
        "registrationEmail"
      );

      /*
       * Navigate back to login
       */
      setTimeout(() => {

        navigate("/");

      }, 1500);

    } catch (error) {

      if (error.response) {

        setError(error.response.data);

      } else {

        setError("Unable to connect to server");

      }

    } finally {

      setLoading(false);
    }
  };

  return (
    <Box sx={pageSx}>

      <Paper
        elevation={0}
        sx={cardSx}
      >

        {/* Heading */}

        <Typography
          variant="h4"
          align="center"
          fontWeight={800}
          color="#123b4a"
          gutterBottom
        >
          Verify Email
        </Typography>

        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          mb={1}
        >
          Enter the OTP sent to
        </Typography>

        <Typography
          variant="body2"
          align="center"
          fontWeight={700}
          mb={3}
        >
          {email}
        </Typography>

        {/* Error */}

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        {/* Success */}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
          >
            {success}
          </Alert>
        )}

        {/* OTP Form */}

        <Box
          component="form"
          onSubmit={handleSubmit}
        >

          <TextField
            fullWidth
            label="Enter OTP"
            value={otp}
            onChange={handleChange}
            placeholder="6 digit OTP"
            inputProps={{
              maxLength: 6,
              inputMode: "numeric",
            }}
          />

          <CommonButton
            text={
              loading
                ? "Verifying..."
                : "Verify OTP"
            }
            type="submit"
            disabled={loading}
            sx={{ mt: 2, py: 1.4, borderRadius: 2, fontWeight: 700 }}
          />

        </Box>

        {/* Back to Signup */}

        <CommonButton
          text="Back to Sign Up"
          variant="text"
          onClick={() => navigate("/signup")}
          sx={{ mt: 1 }}
        />

      </Paper>

    </Box>
  );
}

export default OtpVerificationPage;