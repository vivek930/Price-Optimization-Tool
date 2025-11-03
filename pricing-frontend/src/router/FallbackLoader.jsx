import { Box, CircularProgress } from "@mui/material";
import React, { memo } from "react";

const FallbackLoader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        background: "linear-gradient(to bottom, #212121, #151515)",
      }}
    >
      <CircularProgress size="6rem" sx={{ color: "white" }} thickness={4} />
    </Box>
  );
};

export default memo(FallbackLoader);
