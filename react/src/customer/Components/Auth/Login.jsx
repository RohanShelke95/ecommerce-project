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

  useEffect(() => {
    if (jwt) {
      dispatch(getUser(jwt));
    }
  }, [jwt]);



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
     <div className="shadow-lg">
      <form className="w-full" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
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
            <Button
              className="bg-[#9155FD] w-full"
              type="submit"
              variant="contained"
              size="large"
              sx={{ padding: ".8rem 0" }}
              disabled={auth.isLoading}
              startIcon={auth.isLoading ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {auth.isLoading ? "Logging in..." : "Login"}
            </Button>
          </Grid>
        </Grid>
      </form>
      <div className="flex justify-center flex-col items-center">
        <div className="py-3 flex items-center">
          <p className="m-0 p-0">don't have account ?</p>
          <Button onClick={() => navigate("/register")} className="ml-5" size="small">
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}
