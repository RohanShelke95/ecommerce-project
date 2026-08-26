
import { Grid, TextField, Button, Alert, InputAdornment, IconButton, CircularProgress } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser, register } from "../../../Redux/Auth/Action";
import { Fragment, useEffect, useState } from "react";


export default function RegisterUserForm({ handleNext }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { auth } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");

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
    const firstName = data.get("firstName");
    const lastName = data.get("lastName");
    const email = data.get("email");
    const password = data.get("password");

    const newErrors = {};

    if (!firstName || firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters.";
    }
    if (!lastName || lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters.";
    }
    if (!email || !validateEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const userData = { firstName, lastName, email, password, role: "ROLE_CUSTOMER" };
    console.log("user data", userData);
    dispatch(register(userData)).then(() => {
      navigate("/");
    });
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {auth.error && (
            <Grid item xs={12}>
              <Alert severity="error">{auth.error}</Alert>
            </Grid>
          )}
          {auth.successMessage && (
            <Grid item xs={12}>
              <Alert severity="success">{auth.successMessage}</Alert>
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="firstName"
              name="firstName"
              label="First Name"
              fullWidth
              autoComplete="given-name"
              error={!!errors.firstName}
              helperText={errors.firstName}
              inputProps={{ minLength: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="lastName"
              name="lastName"
              label="Last Name"
              fullWidth
              autoComplete="family-name"
              error={!!errors.lastName}
              helperText={errors.lastName}
              inputProps={{ minLength: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="email"
              name="email"
              label="Email"
              type="email"
              fullWidth
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              id="password"
              name="password"
              label="Password"
              fullWidth
              autoComplete="new-password"
              type={showPassword ? "text" : "password"}
              error={!!errors.password}
              helperText={errors.password || "Minimum 6 characters"}
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
              {auth.isLoading ? "Registering..." : "Register"}
            </Button>
          </Grid>
        </Grid>
      </form>

<div className="flex justify-center flex-col items-center">
     <div className="py-3 flex items-center ">
        <p className="m-0 p-0">if you have already account ?</p>
        <Button onClick={() => navigate("/login")} className="ml-5" size="small">
          Login
        </Button>
      </div>
</div>
    </div>
  );
}
