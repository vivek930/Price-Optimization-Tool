import {
  Box,
  Button,
  Stack,
  Typography,
  ClickAwayListener,
} from "@mui/material";
import React, { memo, useState } from "react";
import { COLOR } from "../constants/Constants";
import { useNavigate } from "react-router-dom";
import { clearAuthData } from "../api/axiosInstance";

const Header = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("user_name");
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => {
    clearAuthData(); // Clear stored user info
    navigate("/"); // Redirect to login
  };

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      px={"20px"}
      py={"18px"}
      bgcolor={COLOR.grey_001}
      position="relative"
    >
      <Box flex={1}>
        <Button
          disableRipple
          onClick={() => {
            navigate("/dashboard");
          }}
          sx={{
            textTransform: "none",
          }}
        >
          <Typography
            fontSize={"16px"}
            fontWeight={600}
            color={COLOR.neon_green}
          >
            Price Optimization Tool
          </Typography>
        </Button>
      </Box>

      <Stack direction={"row"} spacing={"16px"} alignItems={"center"}>
        <Stack direction={"row"} spacing={"4px"}>
          <Typography color="#929494" fontSize={"14px"} fontWeight={400}>
            Welcome,
          </Typography>
          <Typography
            color={COLOR.neon_green}
            fontSize={"14px"}
            fontWeight={400}
          >
            {userName}
          </Typography>
        </Stack>

        {/* ClickAwayListener to close menu if clicked outside */}
        <ClickAwayListener onClickAway={() => setLogoutOpen(false)}>
          <Box position="relative">
            <Stack
              direction={"row"}
              width={"30px"}
              height={"30px"}
              borderRadius={"50%"}
              alignItems={"center"}
              justifyContent={"center"}
              bgcolor={COLOR.grey_002}
              sx={{ cursor: "pointer" }}
              onClick={() => setLogoutOpen((prev) => !prev)}
            >
              <Typography color="white">
                {userName?.[0]?.toUpperCase()}
              </Typography>
            </Stack>

            {/* Logout button, slide down */}
            {logoutOpen && (
              <Box
                position="absolute"
                top={"40px"}
                right={0}
                bgcolor={COLOR.grey_002}
                borderRadius="4px"
                boxShadow="0px 4px 12px rgba(0,0,0,0.2)"
                zIndex={10}
              >
                <Button
                  onClick={handleLogout}
                  sx={{
                    textTransform: "none",
                    bgcolor: "white",
                    width: "100%",
                    py: "8px",
                    color: "black",
                    fontWeight: 550,
                  }}
                >
                  Logout
                </Button>
              </Box>
            )}
          </Box>
        </ClickAwayListener>
      </Stack>
    </Stack>
  );
};

export default memo(Header);
