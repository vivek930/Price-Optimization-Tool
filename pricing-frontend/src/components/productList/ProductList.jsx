import { Stack, Typography } from "@mui/material";
import React from "react";
import { COLOR } from "../../constants/Constants";
import Header from "../Header";

const ProductList = () => {
  const role = localStorage.getItem("role");
  return (
    <Stack height={"100%"} bgcolor={COLOR.grey_003} spacing={"30px"}>
      <Header />
      <Stack alignItems={"center"} justifyContent={"center"}>
        <Typography fontSize={"60px"} fontWeight={600} color="white">
          Coming Soon...
        </Typography>
        {role === "buyer" && (
          <Typography fontSize={"24px"} fontWeight={500} color="white">
            If you are seeing only "Product Listing" module than you have logged
            in as a buyer, please logout and signup as Supplier or Admin to
            access "Create and Manage Product" & "Price Optimization" modules
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default ProductList;
