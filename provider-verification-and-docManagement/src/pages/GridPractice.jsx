import { Box, Typography } from "@mui/material";
import React from "react";

const GridPractice = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "primary.main",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          height: "15%",
          width: "90%",
          padding: 4,
          border: "2px solid #ffffff",
          m: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: "2rem", fontWeight: 600 }}>
          Grid Practice
        </Typography>
      </Box>
      <Box
        sx={{
          height: "80%",
          width: "90%",
          border: "2px solid #ffffff",
          padding: 4,
          m: 2,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        <Box
          sx={{
            border: "2px solid rgba(7, 7, 7, 0.45)",
            bgcolor: "lightcoral",
            gridColumn: {
              xs: "1 / -1",
              md: "1 / -1",
            },
            gridRow: "span 2",
          }}
        >
          first
        </Box>
        <Box
          sx={{
            border: "2px solid rgba(7, 7, 7, 0.45)",
            bgcolor: "lightcoral",
            gridColumn: {
              xs: "1 / -1",
              md: "1 / 3",
            },
          }}
        >
          second
        </Box>
        <Box
          sx={{
            border: "2px solid rgba(7, 7, 7, 0.45)",
            bgcolor: "lightcoral",
            gridColumn: {
              xs: "1 / -1",
              md: "3 / 5",
            }
          }}
        >
          third
        </Box>
        <Box
          sx={{
            border: "2px solid rgba(7, 7, 7, 0.45)",
            bgcolor: "lightcoral",
            gridColumn: {
              xs: "1 / -1",
              md: "1 / 5",
            },
          }}
        >
          fourth
        </Box>
        <Box
          sx={{
            border: "2px solid rgba(7, 7, 7, 0.45)",
            bgcolor: "lightcoral",
            gridColumn: {
              xs: "1 / -1",
              md: "2 / 4",
            },
          }}
        >
          fifth
        </Box>
      </Box>
    </Box>
  );
};

export default GridPractice;
