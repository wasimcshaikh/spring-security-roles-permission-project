import React from "react";
import { Box, Typography } from "@mui/material";

function Unauthorized() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                p: 3,
            }}
        >
            <Typography
                variant="h1"
                fontWeight="bold"
            >
                403
            </Typography>

            <Typography
                variant="h5"
                fontWeight="600"
                sx={{ mt: 1 }}
            >
                Access Denied
            </Typography>

            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mt: 1 }}
            >
                You don't have permission to access this page.
            </Typography>
        </Box>
    );
}

export default Unauthorized;