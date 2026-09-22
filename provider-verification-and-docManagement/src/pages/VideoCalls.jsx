import React, { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

import VideoCallIcon from "@mui/icons-material/VideoCall";
import VideoCallRoom from "../components/VideoCall/VideoCallRoom";

import { getAllVideoCalls, joinVideoCall } from "../services/videoCallService";

function VideoCalls() {
  const [videoCalls, setVideoCalls] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [joiningCallId, setJoiningCallId] = useState(null);

  const [session, setSession] = useState(null);

  useEffect(() => {
    loadVideoCalls();
  }, []);

  const loadVideoCalls = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllVideoCalls();

      setVideoCalls(data);
    } catch (error) {
      console.error("Failed to load video calls:", error);

      setError(error.response?.data?.message || "Failed to load video calls");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCall = async (videoCallId) => {
    try {
      setJoiningCallId(videoCallId);

      setError("");

      const data = await joinVideoCall(videoCallId);

      console.log("Video session response:", data);

      setSession(data);
    } catch (error) {
      console.error("Failed to join video call:", error);

      setError(error.response?.data?.message || "Failed to join video call");
    } finally {
      setJoiningCallId(null);
    }
  };

  return (
    <Box
      sx={{
        p: {
          xs: 2,
          md: 4,
        },
      }}
    >
      {/* Page Title */}

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 3,
        }}
      >
        Video Calls
      </Typography>

      {/* Loading */}

      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 5,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* Error */}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* No Calls */}

      {!loading && !error && videoCalls.length === 0 && (
        <Alert severity="info">No video calls are scheduled.</Alert>
      )}

      {/* Video Calls */}

      {!loading && !error && videoCalls.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {videoCalls.map((videoCall) => (
            <Card
              key={videoCall.id}
              sx={{
                borderRadius: 3,
              }}
            >
              <CardContent>
                {/* Header */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <VideoCallIcon />

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    Video Call #{videoCall.id}
                  </Typography>
                </Box>

                {/* Provider */}

                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Provider:</strong> {videoCall.providerId}
                </Typography>

                {/* Client */}

                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Client:</strong> {videoCall.clientId}
                </Typography>

                {/* Scheduled Time */}

                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Scheduled:</strong>{" "}
                  {new Date(videoCall.scheduledAt).toLocaleString()}
                </Typography>

                {/* Duration */}

                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Duration:</strong> {videoCall.durationMinutes} minutes
                </Typography>

                {/* Status */}

                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Status:</strong> {videoCall.status}
                </Typography>

                {/* Join Button */}

                <Button
                  variant="contained"
                  startIcon={<VideoCallIcon />}
                  fullWidth
                  onClick={() => handleJoinCall(videoCall.id)}
                  disabled={joiningCallId === videoCall.id}
                >
                  {joiningCallId === videoCall.id ? "Joining..." : "Join Call"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Temporary Session Information */}

      {session && (
        <VideoCallRoom session={session} onLeave={() => setSession(null)} />
      )}
    </Box>
  );
}

export default VideoCalls;
