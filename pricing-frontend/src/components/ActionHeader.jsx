import React, { memo, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProductRequested } from "../store/slices/productsSlice";
import debounce from "lodash/debounce";
import { CATEGORY, COLOR } from "../constants/Constants";
import {
  Button,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  ChevronDown,
  ChevronsLeft,
  ChevronUp,
  Filter,
  RefreshCcw,
  Search,
} from "lucide-react";
import { dropDownFieldStyles } from "../styles/dropDownFieldStyles";

const ActionHeader = ({ title, ActionButtons = null }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [searchText, setSearchText] = useState("");

  const items = useSelector((store) => store.product.productItems);
  const productDataLoading = useSelector(
    (store) => store.product.productDataLoading
  );

  const userId = localStorage.getItem("user_id");

  // Function to fetch products with current filters
  const fetchProducts = (search = searchText, category = selected) => {
    dispatch(
      getProductRequested({
        userId,
        search: search.trim(),
        category: category.trim(),
      })
    );
  };

  // Initial load - fetch all products
  useEffect(() => {
    if (!items.length) fetchProducts("", "");
  }, []);

  // Keep track of the last applied category filter (what was actually sent to server)
  const [appliedCategory, setAppliedCategory] = useState("");

  // Debounced search function - only uses applied category, not selected
  const debouncedSearch = useMemo(
    () =>
      debounce((searchValue) => {
        fetchProducts(searchValue, appliedCategory);
      }, 1500),
    [appliedCategory, userId]
  );

  // Handle search text changes
  useEffect(() => {
    if (searchText.trim() === "") {
      // If search is empty, fetch immediately with applied category
      fetchProducts("", appliedCategory);
    } else {
      // Otherwise use debounced search with applied category
      debouncedSearch(searchText);
    }

    return () => debouncedSearch.cancel();
  }, [searchText, debouncedSearch]);

  // Handle filter button click - apply the selected category
  const handleFilterClick = () => {
    setAppliedCategory(selected); // Update the applied category
    fetchProducts(searchText, selected);
  };

  // Handle refresh button click - reset both search and filter
  const handleRefreshClick = () => {
    setSearchText("");
    setSelected("");
    setAppliedCategory(""); // Reset applied category too
    fetchProducts("", "");
  };

  return (
    <Stack direction={"row"} bgcolor={COLOR.grey_003} px={"20px"} py={"10px"}>
      <Stack spacing={"16px"} direction={"row"} flex={1} alignItems={"center"}>
        <Button
          disableRipple
          sx={{ textTransform: "none", padding: 0 }}
          onClick={() => navigate(-1)}
        >
          <ChevronsLeft
            size={"16px"}
            color={COLOR.neon_green}
            style={{ marginRight: "8px" }}
          />
          <Typography color={COLOR.grey_004} fontSize={"14px"} fontWeight={400}>
            Back
          </Typography>
        </Button>
        <Divider
          orientation="vertical"
          flexItem
          sx={{ backgroundColor: COLOR.grey_002 }}
        />
        <Typography color={COLOR.grey_004} fontSize={"16px"} fontWeight={500}>
          {title}
        </Typography>
      </Stack>
      <Stack direction={"row"} spacing={"24px"} alignItems={"center"}>
        <TextField
          disabled={productDataLoading}
          autoComplete="off"
          variant="outlined"
          placeholder="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: COLOR.neon_green, // default border
              },
              "&:hover fieldset": {
                borderColor: COLOR.neon_green, // hover border
              },
              "&.Mui-focused fieldset": {
                borderColor: COLOR.neon_green, // focused border
              },
              "&.Mui-disabled fieldset": {
                borderColor: COLOR.neon_green, // Keep same border when disabled
              },
              "& input": {
                py: "8px", // inner padding
                px: "15px",
                fontSize: "14px",
                color: "white",
              },
              "& input.Mui-disabled": {
                color: "white", // Keep text color white when disabled
                WebkitTextFillColor: "white", // Override webkit autofill
              },
            },
          }}
          slotProps={{
            input: {
              startAdornment: <Search size={"24px"} color={COLOR.neon_green} />,
            },
          }}
        />
        <Stack spacing={"8px"} direction={"row"} alignItems={"center"}>
          <Typography color={COLOR.grey_004} fontSize={"14px"} fontWeight={500}>
            Category:
          </Typography>
          <TextField
            disabled={productDataLoading}
            select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            slotProps={{
              select: {
                open,
                onOpen: () => setOpen(true),
                onClose: () => setOpen(false),
                IconComponent: () =>
                  open ? (
                    <ChevronUp
                      color={COLOR.neon_green}
                      size="24px"
                      style={{ marginRight: "8px" }}
                    />
                  ) : (
                    <ChevronDown
                      color={COLOR.neon_green}
                      size="24px"
                      style={{ marginRight: "8px" }}
                    />
                  ),
              },
            }}
            sx={dropDownFieldStyles}
          >
            {React.useMemo(
              () =>
                CATEGORY.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                )),
              []
            )}
          </TextField>
          <Button
            disabled={productDataLoading}
            disableRipple
            onClick={handleFilterClick}
            sx={{
              border: `1px solid ${COLOR.neon_green}`,
              borderRadius: "4px",
              height: "36px",
              textTransform: "none",
            }}
          >
            <Filter
              size={"12px"}
              style={{ marginRight: "8px" }}
              fill="white"
              color="white"
            />
            <Typography color="white" fontSize={"14px"} fontWeight={500}>
              Filter
            </Typography>
          </Button>
          <IconButton
            disabled={productDataLoading}
            onClick={handleRefreshClick}
            sx={{
              border: `1px solid ${COLOR.neon_green}`,
              borderRadius: "4px",
              height: "36px",
              width: "36px",
              color: "white",
            }}
          >
            <RefreshCcw size={16} color={COLOR.neon_green} />
          </IconButton>
        </Stack>
        {ActionButtons && (
          <Divider
            orientation="vertical"
            flexItem
            sx={{ backgroundColor: COLOR.grey_002 }}
          />
        )}

        {ActionButtons && <ActionButtons />}
      </Stack>
    </Stack>
  );
};

export default memo(ActionHeader);
