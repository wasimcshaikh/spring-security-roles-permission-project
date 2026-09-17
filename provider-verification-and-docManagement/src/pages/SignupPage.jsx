import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Paper, Typography } from "@mui/material";

import axios from "axios";

import CommonButton from "../components/CommonButton";
import CommonForm from "../components/CommonForm";

import signupFields from "../config/signupFields";

function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const pageSx = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    px: { xs: 2, sm: 3 },
    py: { xs: 4, sm: 6 },
    background: "#123b4a",
    //   "linear-gradient(135deg, #67c8f6 0%, #f8fbff 52%, #e9f7f3 100%)",
  };

  const cardSx = {
    width: "100%",
    maxWidth: 460,
    p: { xs: 3, sm: 5 },
    border: "1px solid rgba(24, 91, 117, 0.1)",
    borderRadius: 4,
    boxShadow: "0 24px 70px rgba(24, 67, 88, 0.14)",
  };

  const tabsSx = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 1.5,
    mb: 3,
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:8080/api/providers/register",
        formData,
      );

      /*
       * Store email temporarily.
       * OTP page will use this email.
       */

      sessionStorage.setItem("registrationEmail", formData.email);

      navigate("/verify-otp");
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
      <Paper elevation={0} sx={cardSx}>
        {/* Heading */}

        <Typography
          variant="h4"
          align="center"
          fontWeight={800}
          color="#123b4a"
          gutterBottom
        >
          MediSlot
        </Typography>

        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          mb={4}
        >
          Create Provider Account
        </Typography>

        {/* Sign In / Sign Up */}

        <Box sx={tabsSx}>
          <CommonButton
            text="Sign In"
            variant="outlined"
            onClick={() => navigate("/")}
          />

          <CommonButton text="Sign Up" />
        </Box>

        {/* Dynamic Signup Form */}

        <CommonForm
          fields={signupFields}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          error={error}
          loading={loading}
          submitText="Sign Up"
          loadingText="Creating Account..."
        />
      </Paper>
    </Box>
  );
}

export default SignupPage;
