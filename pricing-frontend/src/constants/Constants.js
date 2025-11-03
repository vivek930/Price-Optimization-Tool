import { Stack, Tooltip } from "@mui/material";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  openDeleteProductModal,
  openUpdateProductModal,
} from "../store/slices/modalsSlice";

export const COLOR = {
  neon_green: "#05e1b5",
  grey_001: "#323434",
  grey_002: "#929494",
  grey_003: "#191a19",
  grey_004: "#dedede",
  white_001: "#e4e4e4",
};

export const columns = (dispatch) => [
  { field: "name", headerName: "Product Name", flex: 1 },
  {
    field: "category",
    headerName: "Product Category",
    flex: 1,
  },
  {
    field: "cost_price",
    headerName: "Cost Price",
    flex: 1,
    renderCell: (params) => {
      const cost_price = params.value;

      return (
        <Stack
          sx={{ width: "100%", px: 1 }} // full cell width
        >
          $ {cost_price}
        </Stack>
      );
    },
  },
  {
    field: "selling_price",
    headerName: "Selling Price",
    flex: 1,
    renderCell: (params) => {
      const selling_price = params.value;

      return (
        <Stack
          sx={{ width: "100%", px: 1 }} // full cell width
        >
          $ {selling_price}
        </Stack>
      );
    },
  },
  {
    field: "description",
    headerName: "Description",
    sortable: false,
    flex: 1,
  },
  {
    field: "stock_available",
    headerName: "Available Stock",
    flex: 1,
  },
  {
    field: "units_sold",
    headerName: "Units Sold",
    flex: 1,
  },
  {
    field: "demand",
    headerName: "Calculated Demand",
    flex: 1,
    renderCell: (params) => (
      <span style={{ color: COLOR.neon_green, fontWeight: 600 }}>
        {params.value}
      </span>
    ),
  },
  {
    field: "actions",
    headerName: "Action",
    flex: 1,
    align: "center", // horizontal centering
    headerAlign: "center", // header alignment
    renderCell: (params) => (
      <Stack
        direction="row"
        spacing={"16px"}
        alignItems="center"
        justifyContent="center"
        sx={{ width: "100%", height: "100%" }} // force full cell size
      >
        <Tooltip title="View">
          <Eye size={18} strokeWidth={3} />
        </Tooltip>
        <Tooltip title="Edit">
          <Pencil
            fill={COLOR.grey_003}
            size={18}
            onClick={() => {
              dispatch(openUpdateProductModal(params.row));
            }}
          />
        </Tooltip>
        <Tooltip title="Delete">
          <Trash2
            size={18}
            color="red"
            onClick={() => {
              dispatch(openDeleteProductModal(params.row));
            }}
          />
        </Tooltip>
      </Stack>
    ),
  },
];

export const demandForecastColumns = [
  { field: "name", headerName: "Product Name", flex: 1 },
  {
    field: "category",
    headerName: "Product Category",
    flex: 1,
  },
  {
    field: "cost_price",
    headerName: "Cost Price",
    flex: 1,
    renderCell: (params) => {
      const cost_price = params.value;

      return (
        <Stack
          sx={{ width: "100%", px: 1 }} // full cell width
        >
          $ {cost_price}
        </Stack>
      );
    },
  },
  {
    field: "selling_price",
    headerName: "Selling Price",
    flex: 1,
    renderCell: (params) => {
      const selling_price = params.value;

      return (
        <Stack
          sx={{ width: "100%", px: 1 }} // full cell width
        >
          $ {selling_price}
        </Stack>
      );
    },
  },
  {
    field: "stock_available",
    headerName: "Available Stock",
    flex: 1,
  },
  {
    field: "units_sold",
    headerName: "Units Sold",
    flex: 1,
  },
  {
    field: "demand",
    headerName: "Calculated Demand",
    flex: 1,
    renderCell: (params) => {
      return (
        <div
          style={{
            fontWeight: 600,
          }}
        >
          {params.value}
        </div>
      );
    },
  },
];

export const pricingColumns = [
  { field: "name", headerName: "Product Name", flex: 1 },
  {
    field: "category",
    headerName: "Product Category",
    flex: 1,
  },
  {
    field: "description",
    headerName: "Description",
    sortable: false,
    flex: 1,
  },
  {
    field: "cost_price",
    headerName: "Cost Price",
    flex: 1,
    renderCell: (params) => {
      const cost_price = params.value;

      return (
        <Stack
          sx={{ width: "100%", px: 1 }} // full cell width
        >
          $ {cost_price}
        </Stack>
      );
    },
  },
  {
    field: "selling_price",
    headerName: "Selling Price",
    flex: 1,
    renderCell: (params) => {
      const selling_price = params.value;

      return (
        <Stack
          sx={{ width: "100%", px: 1 }} // full cell width
        >
          $ {selling_price}
        </Stack>
      );
    },
  },
  {
    field: "optimize_price",
    headerName: "Optimized Price",
    flex: 1,
    renderCell: (params) => {
      const cost = params.row.cost_price;
      const optimized = params.value;

      return (
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ width: "100%", px: 1 }} // full cell width
        >
          <span style={{ color: COLOR.grey_002, fontWeight: 600 }}>
            $ {cost}
          </span>
          <span
            style={{
              color: COLOR.neon_green,
              fontWeight: 600,
              marginRight: "16px",
            }}
          >
            $ {optimized}
          </span>
        </Stack>
      );
    },
  },
];

export const CATEGORY = [
  "Electronics",
  "Furniture",
  "Home Decor",
  "Fashion",
  "Beauty",
  "Groceries",
  "Books",
  "Sports",
];

export const INITIAL_PRODUCT_DETAIL_FORM = {
  name: "",
  description: "",
  category: "",
  cost_price: "",
  selling_price: "",
  stock_available: "",
  units_sold: "",
};
