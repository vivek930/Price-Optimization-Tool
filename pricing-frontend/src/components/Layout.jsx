import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { loginRequested } from "../store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { COLOR } from "../constants/Constants";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Local state for field-level errors
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const loginRequestedLoading = useSelector(
    (store) => store.auth.loginRequestedLoading
  );

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  // Password validation function
  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    return "";
  };

  // Handle email change with validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Clear error when user starts typing
    if (errors.email && value) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  // Handle password change with validation
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    // Clear error when user starts typing
    if (errors.password && value) {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  // Handle email blur (validate on focus loss)
  const handleEmailBlur = () => {
    const emailError = validateEmail(email);
    setErrors((prev) => ({ ...prev, email: emailError }));
  };

  // Handle password blur (validate on focus loss)
  const handlePasswordBlur = () => {
    const passwordError = validatePassword(password);
    setErrors((prev) => ({ ...prev, password: passwordError }));
  };

  // Handle login submit
  const onSubmit = (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    // Only submit if there are no validation errors
    if (!emailError && !passwordError) {
      const form = {
        email: email,
        password: password,
      };
      dispatch(loginRequested({ navigate, form }));
    }
  };

  return (
    <Stack
      alignItems={"center"}
      sx={{
        height: "100%",
        background: "linear-gradient(to bottom, #212121, #151515)",
      }}
    >
      <Stack
        spacing={"80px"}
        alignItems={"center"}
        justifyContent={"center"}
        height={"100%"}
      >
        <Typography
          color={COLOR.white_001}
          fontSize={"50px"}
          fontWeight={600}
          lineHeight={"72px"}
        >
          Price Optimization Tool
        </Typography>

        {/* Login card */}
        <Stack spacing={"16px"}>
          <Paper sx={{ p: 3, width: "400px", mx: "auto", mt: 6 }}>
            <Typography variant="h6" gutterBottom>
              Login
            </Typography>
            <form onSubmit={onSubmit}>
              <Stack spacing={2}>
                <TextField
                  placeholder="Email"
                  autoComplete="off"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  error={!!errors.email}
                  helperText={errors.email}
                />
                <TextField
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  error={!!errors.password}
                  helperText={errors.password}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loginRequestedLoading}
                >
                  Login
                </Button>

                <Typography variant="body2">
                  No account? <Link to="/signup">Signup</Link>
                </Typography>
              </Stack>
            </form>
          </Paper>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Layout;
