import {
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signupRequested } from "../store/slices/authSlice";
import { COLOR } from "../constants/Constants";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local form state for controlled inputs
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });

  // Local state for field-level errors
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Selector to check if signup is loading (to disable button)
  const signupRequestedLoading = useSelector(
    (store) => store.auth.signupRequestedLoading
  );

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) {
      return "Name is required";
    }
    if (name.trim().length > 30) {
      return "Name must be less than 30 characters";
    }
    return "";
  };

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

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase and one lowercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  // Handle field changes with real-time error clearing
  const onChange = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));

    // Clear error when user starts typing
    if (errors[key] && value) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  // Handle field blur events for validation
  const handleFieldBlur = (field, value) => {
    let fieldError = "";

    switch (field) {
      case "name":
        fieldError = validateName(value);
        break;
      case "email":
        fieldError = validateEmail(value);
        break;
      case "password":
        fieldError = validatePassword(value);
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: fieldError }));
  };

  // Handle form submission with full validation
  const onSubmit = (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const nameError = validateName(form.name);
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);

    setErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
    });

    // Only submit if there are no validation errors
    if (!nameError && !emailError && !passwordError) {
      dispatch(signupRequested({ navigate, form }));
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

        {/* Signup form wrapper */}
        <Stack spacing={"16px"}>
          <Paper sx={{ p: 3, width: "400px", mx: "auto", mt: 6 }}>
            <Typography variant="h6" gutterBottom>
              Signup
            </Typography>
            <form onSubmit={onSubmit}>
              <Stack spacing={2}>
                <TextField
                  placeholder="Name"
                  autoComplete="off"
                  value={form.name}
                  onChange={onChange("name")}
                  onBlur={() => handleFieldBlur("name", form.name)}
                  error={!!errors.name}
                  helperText={errors.name}
                />
                <TextField
                  placeholder="Email"
                  autoComplete="off"
                  value={form.email}
                  onChange={onChange("email")}
                  onBlur={() => handleFieldBlur("email", form.email)}
                  error={!!errors.email}
                  helperText={errors.email}
                />
                <TextField
                  placeholder="Password"
                  type="password"
                  value={form.password}
                  onChange={onChange("password")}
                  onBlur={() => handleFieldBlur("password", form.password)}
                  error={!!errors.password}
                  helperText={errors.password}
                />
                <TextField
                  select
                  value={form.role}
                  onChange={onChange("role")}
                  onBlur={() => handleFieldBlur("role", form.role)}
                  label="Role"
                >
                  <MenuItem value="buyer">Buyer</MenuItem>
                  <MenuItem value="supplier">Supplier</MenuItem>
                </TextField>

                {/* Submit button disables when loading */}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={signupRequestedLoading}
                >
                  Create Account
                </Button>
                <Typography variant="body2">
                  Already have an account? <Link to="/">Login</Link>
                </Typography>
              </Stack>
            </form>
          </Paper>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Signup;
