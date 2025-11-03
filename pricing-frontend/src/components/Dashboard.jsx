import { Button, Stack, Typography } from "@mui/material";
import {
  ArrowRight,
  ChartColumnBig,
  DollarSign,
  ShoppingCart,
} from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { COLOR } from "../constants/Constants";
import { useDispatch } from "react-redux";
import { getProductRequested } from "../store/slices/productsSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    // throw Error;

    const userId = localStorage.getItem("user_id");
    dispatch(
      getProductRequested({
        userId,
        search: "",
        category: "",
      })
    );
  }, []);

  return (
    <Stack
      spacing={"40px"}
      height={"100%"}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{
        background: "linear-gradient(to bottom, #212121, #151515)",
      }}
    >
      {/* Branding / Logo */}
      {/* <Stack direction={"row"} spacing={"8px"} alignItems={"center"}>
        <Typography
          color={COLOR.white_001}
          fontSize={"50px"}
          fontWeight={600}
          lineHeight={"70px"}
        >
          Vivek
        </Typography>
        <Typography
          color={COLOR.neon_green}
          fontSize={"70px"}
          fontWeight={600}
          lineHeight={"70px"}
        >
          Parihar
        </Typography>
      </Stack> */}

      {/* Title & description */}
      <Stack spacing={"16px"} alignItems={"center"} justifyContent={"center"}>
        <Typography
          color={COLOR.white_001}
          fontSize={"50px"}
          fontWeight={600}
          lineHeight={"50px"}
        >
          Price Optimization Tool
        </Typography>
        <Typography
          color={COLOR.white_001}
          fontSize={"16px"}
          fontWeight={400}
          lineHeight={"24px"}
        >
          Unlock the power of data with the Price Optimization Tool. Monitor
          pricing trends, identify opportunities for revenue growth, and
          implement optimal pricing strategies.
        </Typography>
      </Stack>

      {/* Cards section */}
      <Stack direction={"row"} spacing={"32px"} alignItems={"center"}>
        {/* Supplier/Admin cards */}
        {(userRole === "supplier" || userRole === "admin") && (
          <>
            <Stack
              spacing={"24px"}
              width={"250px"}
              height={"400px"}
              border={"1px solid black"}
              borderRadius={"5px"}
              padding={"20px"}
              justifyContent={"space-between"}
              bgcolor="white"
            >
              <ChartColumnBig strokeWidth={2} size={"70px"} />
              <Stack spacing={"8px"}>
                <Typography
                  fontSize={"24px"}
                  fontWeight={700}
                  lineHeight={"32px"}
                >
                  Create and Manage Product
                </Typography>
                <Typography
                  fontSize={"12px"}
                  fontWeight={400}
                  lineHeight={"24px"}
                >
                  Easily create, update, and manage your products in one place.
                  Add new items, edit details, set pricing, and keep your
                  catalog organized and up to date.
                </Typography>
              </Stack>
              <Button
                component={Link}
                to={"/manage-products"}
                disableRipple
                disableElevation
                sx={{
                  padding: 0,
                  minWidth: 0,
                  background: "none",
                  "&:hover": { background: "none" },
                  color: "black",
                  display: "flex",
                  justifyContent: "flex-start",
                  width: "32px",
                }}
              >
                <ArrowRight size={"32px"} />
              </Button>
            </Stack>
            <Stack
              spacing={"24px"}
              width={"250px"}
              height={"400px"}
              border={"1px solid black"}
              borderRadius={"5px"}
              padding={"20px"}
              justifyContent={"space-between"}
              bgcolor="white"
            >
              <DollarSign strokeWidth={2} size={"70px"} />

              <Stack spacing={"8px"}>
                <Typography
                  fontSize={"24px"}
                  fontWeight={700}
                  lineHeight={"32px"}
                >
                  Pricing Optimization
                </Typography>
                <Typography
                  fontSize={"12px"}
                  fontWeight={400}
                  lineHeight={"24px"}
                >
                  Optimize your product prices to maximize revenue and stay
                  competitive. Get actionable insights and automated
                  recommendations for smarter pricing decisions.
                </Typography>
              </Stack>
              <Button
                component={Link}
                to={"/price-optimization"}
                disableRipple
                disableElevation
                sx={{
                  padding: 0,
                  minWidth: 0,
                  background: "none",
                  "&:hover": { background: "none" },
                  color: "black",
                  display: "flex",
                  justifyContent: "flex-start",
                  width: "32px",
                }}
              >
                <ArrowRight size={"32px"} />
              </Button>
            </Stack>
          </>
        )}

        {/* Buyer/Admin card */}
        {(userRole === "buyer" || userRole === "admin") && (
          <Stack
            spacing={"24px"}
            width={"250px"}
            height={"400px"}
            border={"1px solid black"}
            borderRadius={"5px"}
            padding={"20px"}
            justifyContent={"space-between"}
            bgcolor="white"
          >
            <ShoppingCart strokeWidth={2} size={"70px"} />

            <Stack spacing={"8px"}>
              <Typography
                fontSize={"24px"}
                fontWeight={700}
                lineHeight={"32px"}
              >
                Product Listing
              </Typography>
              <Typography
                fontSize={"12px"}
                fontWeight={400}
                lineHeight={"24px"}
              >
                Explore the List of Products.
              </Typography>
            </Stack>
            <Button
              component={Link}
              to={"/product-listing"}
              disableRipple
              disableElevation
              sx={{
                padding: 0,
                minWidth: 0,
                background: "none",
                "&:hover": { background: "none" },
                color: "black",
                display: "flex",
                justifyContent: "flex-start",
                width: "32px",
              }}
            >
              <ArrowRight size={"32px"} />
            </Button>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default Dashboard;
