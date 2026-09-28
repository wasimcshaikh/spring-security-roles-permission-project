import React from "react";

import Navbar from "../components/Navbar";
import QuickActions from "../components/QuickActions";
import { Box } from "@mui/material";



function Home() {
  return (
    <Box
    sx={{
      width : "100%" ,
      height: "100vh"
    }}>
      <Navbar />

      <QuickActions />
    </Box>
  );
}

export default Home;