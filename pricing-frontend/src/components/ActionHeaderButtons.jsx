import { Button, Stack, Typography } from "@mui/material";
import { Calculator, PlusCircle } from "lucide-react";
import React, { memo } from "react";
import { COLOR } from "../constants/Constants";
import { useDispatch, useSelector } from "react-redux";
import {
  openCreateProductModal,
  openDemandForecastModal,
} from "../store/slices/modalsSlice";

const ActionHeaderButtons = () => {
  const dispatch = useDispatch();

  const selectedRows = useSelector((store) => store.product.selectedIds);

  const handleModalOpen = () => dispatch(openCreateProductModal());
  const productDataLoading = useSelector(
    (store) => store.product.productDataLoading
  );

  const handleForecastClick = () => {
    dispatch(openDemandForecastModal());
  };

  return (
    <Stack direction={"row"} spacing={"8px"} alignItems={"center"}>
      <Button
        disabled={productDataLoading}
        disableRipple
        sx={{
          bgcolor: COLOR.neon_green,
          height: "36px",
          borderRadius: "4px",
          textTransform: "none",
        }}
        onClick={handleModalOpen}
      >
        <PlusCircle
          size={"16px"}
          style={{ marginRight: "8px" }}
          fill={COLOR.grey_003}
          color={COLOR.neon_green}
        />
        <Typography color={COLOR.grey_003} fontSize={"14px"} fontWeight={500}>
          Add New Products
        </Typography>
      </Button>
      <Button
        disableRipple
        sx={{
          bgcolor: COLOR.neon_green,
          height: "36px",
          borderRadius: "4px",
          textTransform: "none",
          opacity: selectedRows.length === 0 ? 0.5 : 1,
        }}
        onClick={handleForecastClick}
        disabled={selectedRows.length === 0} // disable if nothing selected
      >
        <Calculator
          size={"16px"}
          style={{ marginRight: "8px" }}
          fill={COLOR.grey_003}
          color={COLOR.neon_green}
        />
        <Typography color={COLOR.grey_003} fontSize={"14px"} fontWeight={500}>
          Demand Forecast
        </Typography>
      </Button>
    </Stack>
  );
};

export default memo(ActionHeaderButtons);
