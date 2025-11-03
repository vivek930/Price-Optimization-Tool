import { COLOR } from "../constants/Constants";

export const darkDataGridStyles = {
  border: "none",
  backgroundColor: COLOR.grey_001, // entire grid background black
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: COLOR.grey_003,
    color: "#FFFFFF",
    borderBottom: "none",
    borderRight: `1px solid ${COLOR.grey_001}`,
  },
  "& .MuiDataGrid-row": {
    backgroundColor: "#f2f2f2", // row cells white
    "&:nth-of-type(odd)": { backgroundColor: "#FFFFFF" },
    "&:hover": { backgroundColor: "#F0F0F0" }, // subtle hover effect
  },
  "& .MuiDataGrid-cell:last-of-type, & .MuiDataGrid-columnHeader:last-of-type":
    {
      borderRight: "none",
    },
  "& .MuiDataGrid-cellCheckbox .MuiCheckbox-root": {
    color: "#00A99D",
  },
  "& .MuiDataGrid-selectedRowCount": {
    visibility: "hidden",
  },
  "& .MuiDataGrid-virtualScroller": {
    backgroundColor: COLOR.grey_001, // background for empty area
  },
  "& .MuiDataGrid-columnSeparator": {
    color: "transparent",
  },
  "& .MuiDataGrid-cell": {
    borderRight: `1px solid ${COLOR.grey_001}`, // remove border
  },
  "& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root": {
    color: "#FFFFFF", // border color for unchecked
    "&.Mui-checked": {
      color: "white", // checkbox fill when checked (grey shade)
      borderRadius: "2px", // optional: keep square-ish style
    },
  },
};
