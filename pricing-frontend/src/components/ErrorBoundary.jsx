import React from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { Stack, Typography, Button } from "@mui/material";
import { COLOR } from "../constants/Constants";

const ErrorFallback = ({ resetErrorBoundary, fallbackMessage }) => {
  return (
    <Stack
      spacing={3}
      alignItems="center"
      justifyContent="center"
      minHeight="100%" // This ensures minimum full height
      p={3}
      sx={{
        background: "linear-gradient(to bottom, #212121, #151515)",
      }}
    >
      <Typography variant="h3" color="white">
        Oops! Something went wrong
      </Typography>
      <Typography variant="h5" color="white">
        {fallbackMessage || "An unexpected error occurred. Please try again."}
      </Typography>

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          onClick={resetErrorBoundary}
          sx={{
            backgroundColor: COLOR.neon_green,
            color: COLOR.grey_003,
            fontWeight: 600,
          }}
        >
          Try Again
        </Button>
        <Button
          variant="outlined"
          onClick={() => window.location.reload()}
          sx={{ borderColor: COLOR.neon_green, color: COLOR.neon_green }}
        >
          Refresh Page
        </Button>
      </Stack>
    </Stack>
  );
};

const ErrorBoundary = ({ children, fallbackMessage }) => {
  const handleError = (error, errorInfo) => {
    // Log error in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={(props) => (
        <ErrorFallback {...props} fallbackMessage={fallbackMessage} />
      )}
      onError={handleError}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
