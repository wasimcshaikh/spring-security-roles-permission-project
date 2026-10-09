import { Box, Typography } from "@mui/material";

const GridPractice = () => (
  <Box
    sx={{
      p: { xs: 2, sm: 3 },
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
      Grid Practice
    </Typography>
    <Box
      sx={{
        display: "grid",
        height: "100%",
        // justifyContent: "center",

        // gridTemplateColumns: {
        //   xs: "1fr",
        //   sm: "repeat(2, minmax(0, 1fr))",
        //   md: "repeat(3, minmax(0, 1fr))",
        // },
        gridTemplateAreas: {
          xs: `
            "first"
            "second"
            "second"
            "third"
            "fourth"
            "fifth"
          `,
          sm: `
            "first first"
            "second third"
            "second fourth"
            " fifth fifth"
          `,
          md: `
            "first first first"
            "second third fourth"
            ". fifth ."
          `,
        },
        gridTemplateRows: {
          xs: "160px 280px 280px 280px 480px 160px",
          sm: "160px 360px 200px 280px",
          md: "160px 280px 160px",
        },
        gap: "10px",
        bgcolor: "rgb(61, 22, 3)",
      }}
    >
      <Box
        sx={{
          minHeight: 160,
          border: "2px solid rgba(7, 7, 7, 0.45)",
          gridArea: "first",
          bgcolor: "lightcoral",
        }}
      >
        {" "}
        first
      </Box>
      <Box
        sx={{
          minWidth: 160,
          minHeight: 160,
          border: "2px solid rgba(7, 7, 7, 0.45)",
          gridArea: "second",
          bgcolor: "lightgray",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
          },
          gap: "10px",
          
        }}
      >
        <Box sx={{m: 1, border: "2px solid rgba(7, 7, 7, 0.45)", p: 2 }}>21</Box>
        <Box sx={{m: 1, border: "2px solid rgba(7, 7, 7, 0.45)", p: 2 }}>22</Box>
        <Box sx={{m: 1, border: "2px solid rgba(7, 7, 7, 0.45)", p: 2 }}>23</Box>
        <Box sx={{m: 1, border: "2px solid rgba(7, 7, 7, 0.45)", p: 2 }}>24</Box>
        <Box sx={{m: 1, border: "2px solid rgba(7, 7, 7, 0.45)", p: 2 }}>25</Box>
        <Box sx={{m: 1, border: "2px solid rgba(7, 7, 7, 0.45)", p: 2 }}>26</Box>
      </Box>
      <Box
        sx={{
          minHeight: 160,
          border: "2px solid rgba(7, 7, 7, 0.45)",
          gridArea: "third",
          bgcolor: "lightblue",
        }}
      >
        third
      </Box>
      <Box
        sx={{
          minHeight: 160,
          border: "2px solid rgba(7, 7, 7, 0.45)",
          gridArea: "fourth",
          bgcolor: "lightgreen",
        }}
      >
        {" "}
        fourth{" "}
      </Box>
      <Box
        sx={{
          minHeight: 160,
          border: "2px solid rgba(7, 7, 7, 0.45)",
          gridArea: "fifth",
          bgcolor: "yellow",
        }}
      >
        {" "}
        fifth{" "}
      </Box>
    </Box>
  </Box>
);

export default GridPractice;
