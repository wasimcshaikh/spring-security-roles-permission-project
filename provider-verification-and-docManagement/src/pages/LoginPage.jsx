import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Paper, Typography } from "@mui/material";

import axios from "axios";

import CommonButton from "../components/CommonButton";
import CommonForm from "../components/CommonForm";

import loginFields from "../config/loginFields";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

      const response = await axios.post(
        "http://localhost:8080/api/providers/login",
        formData,
      );

      console.log(response.data);

      /*
       * Store JWT token
       */

      sessionStorage.setItem("token", response.data.token);

      /*
       * Store logged-in provider information
       */

      sessionStorage.setItem("provider", JSON.stringify(response.data));

       alert("Login successful");
        navigate("/home");
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
          Provider Login
        </Typography>

        {/* Sign In / Sign Up */}

        <Box sx={tabsSx}>
          <CommonButton text="Sign In" />

          <CommonButton
            text="Sign Up"
            variant="outlined"
            onClick={() => navigate("/signup")}
          />
        </Box>

        {/* Dynamic Login Form */}

        <CommonForm
          fields={loginFields}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          error={error}
          loading={loading}
          submitText="Sign In"
          loadingText="Signing In..."
        />
      </Paper>
    </Box>
  );
}

export default LoginPage;
