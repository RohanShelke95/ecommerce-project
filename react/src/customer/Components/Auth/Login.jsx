import * as React from "react";
import { Grid, TextField, Button, Snackbar, Alert, InputAdornment, IconButton, CircularProgress } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser, login } from "../../../Redux/Auth/Action";
import { useEffect, useState } from "react";

export default function LoginUserForm({ handleNext }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { auth } = useSelector((store) => store);





  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    let valid = true;

    if (!email || !validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password || password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) return;

    const userData = { email, password };
    console.log("login user", userData);
    dispatch(login(userData));
  };

  return (
    <div className="w-full">
      <form className="w-full" onSubmit={handleSubmit}>
        <Grid container spacing={2.5}>
          {auth.error && (
            <Grid item xs={12}>
              <Alert severity="error">{auth.error}</Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              required
              id="email"
              name="email"
              label="Email"
              type="email"
              fullWidth
              autoComplete="email"
              error={!!emailError}
              helperText={emailError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="password"
              name="password"
              label="Password"
              fullWidth
              autoComplete="current-password"
              type={showPassword ? "text" : "password"}
              error={!!passwordError}
              helperText={passwordError}
              inputProps={{ minLength: 6 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "6px" }}>
              <Button
                size="small"
                onClick={() => navigate("/forgot-password")}
                sx={{
                  textTransform: "none",
                  fontSize: { xs: "0.75rem", sm: "0.8rem" },
                  color: "#4f46e5",
                  fontWeight: "bold",
                  p: 0,
                  minWidth: 0,
                }}
              >
                Forgot Password?
              </Button>
            </div>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              sx={{
                padding: ".8rem 0",
                backgroundColor: "#4f46e5",
                fontWeight: "bold",
                fontSize: { xs: "0.875rem", sm: "1rem" },
                "&:hover": { backgroundColor: "#4338ca" },
              }}
              disabled={auth.isLoading}
              startIcon={auth.isLoading ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {auth.isLoading ? "Logging in..." : "Login"}
            </Button>
          </Grid>
        </Grid>
      </form>
      <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", marginTop: "12px" }}>
        <div style={{ paddingTop: "8px", paddingBottom: "8px", display: "flex", alignItems: "center", flexWrap: "wrap", justifyContent: "center", gap: "4px" }}>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "#4b5563" }}>Don't have an account?</p>
          <Button
            onClick={() => navigate("/register")}
            size="small"
            sx={{ textTransform: "none", fontWeight: "bold", color: "#4f46e5", fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
          >
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}
