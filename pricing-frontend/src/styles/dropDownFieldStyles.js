import { COLOR } from "../constants/Constants";

// In dropDownFieldStyles.js
export const dropDownFieldStyles = {
  "& .MuiOutlinedInput-root": {
    height: "36px",
    width: "200px",
    "& fieldset": {
      borderColor: COLOR.neon_green,
    },
    "&:hover fieldset": {
      borderColor: COLOR.neon_green,
    },
    "&.Mui-focused fieldset": {
      borderColor: COLOR.neon_green,
    },
    "&.Mui-disabled fieldset": {
      borderColor: COLOR.neon_green, // Keep same border when disabled
    },
    "& .MuiSelect-select": {
      py: "8px",
      px: "15px",
      fontSize: "14px",
      color: "white",
    },
    "& .MuiSelect-select.Mui-disabled": {
      color: "white", // Keep text color when disabled
      WebkitTextFillColor: "white",
    },
  },
  "& .MuiSelect-icon": {
    right: "8px",
    "&.Mui-disabled": {
      color: COLOR.neon_green, // Keep icon color when disabled
    },
  },
};
