import { Skeleton, Stack } from "@mui/material";
import React, { useEffect } from "react";
import Header from "../Header";
import { COLOR, pricingColumns } from "../../constants/Constants";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getProductRequested } from "../../store/slices/productsSlice";
import { darkDataGridStyles } from "../../styles/dataGridStyles";
import ActionHeader from "../ActionHeader";

const PriceGrid = () => {
  const dispatch = useDispatch();

  const items = useSelector((store) => store.product.productItems);
  const productDataLoading = useSelector(
    (store) => store.product.productDataLoading
  );

  const userId = localStorage.getItem("user_id");

  // Function to fetch products with current filters
  const fetchProducts = (search, category) => {
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

  return (
    <Stack height={"100%"}>
      <Header />
      <ActionHeader title={"Price Optimization"} />
      <Stack
        bgcolor={COLOR.grey_001}
        padding={"20px"}
        flex={1}
        overflow={"auto"}
      >
        {!productDataLoading ? (
          <DataGrid
            rows={items}
            columns={pricingColumns}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            hideFooter
            sx={darkDataGridStyles}
          />
        ) : (
          <Stack gap={"12px"}>
            <Skeleton variant="rounded" width={"100%"} height={60} />
            <Skeleton variant="rounded" width={"100%"} height={60} />
            <Skeleton variant="rounded" width={"100%"} height={60} />
            <Skeleton variant="rounded" width={"100%"} height={60} />
            <Skeleton variant="rounded" width={"100%"} height={60} />
            <Skeleton variant="rounded" width={"100%"} height={60} />
            <Skeleton variant="rounded" width={"100%"} height={60} />
            <Skeleton variant="rounded" width={"100%"} height={60} />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default PriceGrid;
