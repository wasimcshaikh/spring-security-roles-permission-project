import React, { useEffect, useRef, useState } from "react";

import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";

import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";

import ZoomVideo from "@zoom/videosdk";

function VideoCallRoom({ session, onLeave }) {
  const clientRef = useRef(null);

  const streamRef = useRef(null);

  const videoContainerRef = useRef(null);

  const [joining, setJoining] = useState(true);

  const [joined, setJoined] = useState(false);

  const [error, setError] = useState("");

  const [audioEnabled, setAudioEnabled] = useState(false);

  const [videoEnabled, setVideoEnabled] = useState(false);

  useEffect(() => {
    if (!session) {
      return;
    }

    joinZoomSession();

    return () => {
      leaveZoomSession();
    };
  }, [session]);

  const joinZoomSession = async () => {
    try {
      setJoining(true);
      setError("");

      /*
       * Create Zoom Video SDK client
       */

      console.log("session created");
      
      const client = ZoomVideo.createClient();

      clientRef.current = client;



      /*
       * Initialize Zoom Video SDK
       */
      await client.init("en-US", "Global", {
        patchJsMedia: true,
        leaveOnPageUnload: true,
      });

      /*
       * Get current logged-in user
       */
      const storedUser = sessionStorage.getItem("provider");

      let userName = "MediSlot User";

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);

          userName =
            user.fullName || user.name || user.email || "MediSlot User";
        } catch (error) {
          console.error("Failed to read logged-in user:", error);
        }
      }

      console.log("========== ZOOM JOIN DATA ==========");

      console.log("Session object:", session);

      console.log("Session name:", session.sessionName);

      console.log("Token exists:", Boolean(session.token));

      console.log("Token length:", session.token?.length);

      console.log("User name:", userName);

      console.log("====================================");

      /*
       * Join Zoom session
       */
      console.log("Joining Zoom session...");
      await client.join(session.sessionName, session.token, userName);

      console.log("Successfully joined Zoom session");

      /*
       * Get media stream
       */
      const stream = client.getMediaStream();

      console.log("Zoom media stream:", stream);

      streamRef.current = stream;

      setJoined(true);
      console.log("set Joined to true");
      setJoining(false);
      console.log("set Joining to false");

      console.log("Successfully joined Zoom session");
    } catch (error) {
      console.error("Failed to join Zoom session:", error);

      setError(error?.reason || error?.message || "Failed to join video call");

      setJoining(false);
    }
  };

  const startVideo = async () => {
    try {
      const stream = streamRef.current;

      if (!stream) {
        return;
      }

      await stream.startVideo();

      setVideoEnabled(true);

      /*
       * Get current user
       */
      const currentUser = clientRef.current?.getCurrentUserInfo();

      if (!currentUser) {
        return;
      }

      /*
       * Render current user's video
       */
      const userVideo = await stream.attachVideo(currentUser.userId, 3);

      if (videoContainerRef.current && userVideo) {
        videoContainerRef.current.appendChild(userVideo);
      }
    } catch (error) {
      console.error("Failed to start video:", error);

      setError("Unable to start camera. Please check camera permissions.");
    }
  };

  const stopVideo = async () => {
    try {
      const stream = streamRef.current;

      if (!stream) {
        return;
      }

      const currentUser = clientRef.current?.getCurrentUserInfo();

      if (currentUser) {
        await stream.detachVideo(currentUser.userId);
      }

      await stream.stopVideo();

      setVideoEnabled(false);
    } catch (error) {
      console.error("Failed to stop video:", error);
    }
  };

  const toggleAudio = async () => {
    try {
      const stream = streamRef.current;

      if (!stream) {
        return;
      }

      if (!audioEnabled) {
        await stream.startAudio();

        setAudioEnabled(true);
      } else {
        await stream.muteAudio();

        setAudioEnabled(false);
      }
    } catch (error) {
      console.error("Failed to toggle audio:", error);

      setError(
        "Unable to access microphone. Please check microphone permissions.",
      );
    }
  };

  const leaveZoomSession = async () => {
    try {
      if (clientRef.current) {
        await clientRef.current.leave();
      }
    } catch (error) {
      console.error("Failed to leave Zoom session:", error);
    } finally {
      clientRef.current = null;
      streamRef.current = null;
    }
  };

  const handleLeave = async () => {
    await leaveZoomSession();

    if (onLeave) {
      onLeave();
    }
  };

  /*
   * Loading screen
   */
  if (joining) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress />

        <Typography>Joining video call...</Typography>
      </Box>
    );
  }

  /*
   * Error screen
   */
  if (error && !joined) {
    return (
      <Box
        sx={{
          p: 4,
        }}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>

        <Button variant="outlined" onClick={handleLeave}>
          Back
        </Button>
      </Box>
    );
  }

  /*
   * Video room
   */
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 72px)",
        backgroundColor: "#0f172a",
        color: "#ffffff",
        p: {
          xs: 2,
          md: 3,
        },
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
            }}
          >
            MediSlot Video Call
          </Typography>

          <Typography
            variant="body2"
            sx={{
              opacity: 0.7,
              mt: 0.5,
            }}
          >
            Session: {session.sessionName}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            opacity: 0.8,
          }}
        >
          {videoEnabled ? "Camera On" : "Camera Off"}
        </Typography>
      </Box>

      {/* Error */}

      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Video Area */}

      <Box
        sx={{
          flex: 1,
          minHeight: {
            xs: "400px",
            md: "550px",
          },
          backgroundColor: "#020617",
          borderRadius: 3,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          ref={videoContainerRef}
          sx={{
            width: "100%",
            height: "100%",
            minHeight: "400px",

            "& video": {
              width: "100%",
              height: "100%",
              objectFit: "contain",
            },
          }}
        >
          {!videoEnabled && (
            <Box
              sx={{
                height: "100%",
                minHeight: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  opacity: 0.6,
                }}
              >
                Camera is turned off
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Controls */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          mt: 3,
        }}
      >
        {/* Microphone */}

        <IconButton
          onClick={toggleAudio}
          sx={{
            width: 56,
            height: 56,
            backgroundColor: audioEnabled ? "#ffffff" : "#334155",
            color: audioEnabled ? "#0f172a" : "#ffffff",

            "&:hover": {
              backgroundColor: audioEnabled ? "#e2e8f0" : "#475569",
            },
          }}
        >
          {audioEnabled ? <MicIcon /> : <MicOffIcon />}
        </IconButton>

        {/* Camera */}

        <IconButton
          onClick={videoEnabled ? stopVideo : startVideo}
          sx={{
            width: 56,
            height: 56,
            backgroundColor: videoEnabled ? "#ffffff" : "#334155",
            color: videoEnabled ? "#0f172a" : "#ffffff",

            "&:hover": {
              backgroundColor: videoEnabled ? "#e2e8f0" : "#475569",
            },
          }}
        >
          {videoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
        </IconButton>

        {/* Leave */}

        <IconButton
          onClick={handleLeave}
          sx={{
            width: 56,
            height: 56,
            backgroundColor: "#dc2626",
            color: "#ffffff",

            "&:hover": {
              backgroundColor: "#b91c1c",
            },
          }}
        >
          <CallEndIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default VideoCallRoom;
