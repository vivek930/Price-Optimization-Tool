// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiFilledInput: {
      styleOverrides: {
        root: {
          display: "flex",
          alignItems: "center", // center text vertically
          backgroundColor: "#222",
          color: "#fff",
          fontSize: "18px",
          "&:hover": { backgroundColor: "#222" },
          "&.Mui-focused": { backgroundColor: "#222" },

          // remove underline globally
          "&:before, &:after": {
            display: "none",
          },

          // input field inside
          "& input": {
            padding: "14px",
            height: "100%",
            display: "flex",
            alignItems: "center",
          },

          // applied when it's a Select
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            padding: "10px 8px",
            height: "100%",
          },
        },
      },
    },
  },
});

export default theme;
