import {
  Grid,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Box,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff, PhoneAndroid, EmailOutlined } from "@mui/icons-material";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, sendMobileOtp, verifyOtpAndSignup } from "../../../Redux/Auth/Action";
import { useEffect, useState } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../../config/firebase";

export default function RegisterUserForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { auth } = useSelector((store) => store);

  // Verification method: 0 = Email OTP, 1 = Mobile SMS OTP
  const [otpMethod, setOtpMethod] = useState(0);

  // Step 1 = Form details, Step 2 = OTP Verification
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Resend OTP countdown timer
  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateMobile = (mobile) => {
    const clean = mobile.replace(/[^0-9]/g, "");
    return clean.length >= 10;
  };

  // Step 1: Send OTP code to Email or Mobile
  const handleSendOtp = async (event) => {
    event.preventDefault();
    const newErrors = {};

    if (!formData.firstName || formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters.";
    }
    if (!formData.lastName || formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters.";
    }
    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (otpMethod === 1 && (!formData.mobile || !validateMobile(formData.mobile))) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number.";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      if (otpMethod === 1) {
        // Format mobile number to E.164 (+91XXXXXXXXXX)
        const clean = formData.mobile.replace(/[^0-9]/g, "");
        const formattedMobile = clean.startsWith("91") && clean.length === 12
          ? `+${clean}`
          : `+91${clean.slice(-10)}`;

        // Clear existing recaptcha if any
        if (!window.recaptchaVerifier) {
          window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
            callback: () => {
              // reCAPTCHA solved
            },
          });
        }

        const confirmationResult = await signInWithPhoneNumber(
          auth,
          formattedMobile,
          window.recaptchaVerifier
        );
        window.confirmationResult = confirmationResult;
      } else {
        await dispatch(sendOtp(formData.email));
      }
      setStep(2);
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      console.error("OTP send error:", err);
      // Reset recaptcha on error so user can retry
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch (e) {}
      }
      setErrors({ form: err.message || "Failed to send OTP code. Please try again." });
    }
  };

  // Resend OTP code
  const handleResendOtp = async () => {
    if (!canResend) return;
    try {
      if (otpMethod === 1) {
        const clean = formData.mobile.replace(/[^0-9]/g, "");
        const formattedMobile = clean.startsWith("91") && clean.length === 12
          ? `+${clean}`
          : `+91${clean.slice(-10)}`;

        if (!window.recaptchaVerifier) {
          window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
          });
        }
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          formattedMobile,
          window.recaptchaVerifier
        );
        window.confirmationResult = confirmationResult;
      } else {
        await dispatch(sendOtp(formData.email));
      }
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      console.error("OTP resend error:", err);
      setErrors({ form: err.message || "Failed to resend OTP code." });
    }
  };

  // Step 2: Verify OTP code and complete signup
  const handleVerifyAndSignup = async (event) => {
    event.preventDefault();
    if (!otp || otp.trim().length < 6) {
      setErrors({ otp: "Please enter the 6-digit OTP verification code." });
      return;
    }

    setErrors({});
    try {
      let isFirebaseVerified = false;
      if (otpMethod === 1 && window.confirmationResult) {
        // Verify code with Firebase
        await window.confirmationResult.confirm(otp.trim());
        isFirebaseVerified = true;
      }

      await dispatch(
        verifyOtpAndSignup({
          email: formData.email,
          mobile: formData.mobile,
          otp: otp.trim(),
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password,
          firebaseVerified: isFirebaseVerified,
        })
      );
      navigate("/");
    } catch (err) {
      console.error("OTP verification error:", err);
      setErrors({ otp: err.message || "Invalid or expired verification code." });
    }
  };

  return (
    <div className="w-full">
      <div id="recaptcha-container"></div>
      {step === 1 ? (
        /* ── STEP 1: Registration & Method Selection ── */
        <form onSubmit={handleSendOtp}>
          <Grid container spacing={2.5}>
            {errors.form && (
              <Grid item xs={12}>
                <Alert severity="error">{errors.form}</Alert>
              </Grid>
            )}
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

            <Grid item xs={12}>
              <Typography variant="body2" className="text-gray-600 mb-1 font-medium">
                Choose Verification Option:
              </Typography>
              <Tabs
                value={otpMethod}
                onChange={(e, val) => setOtpMethod(val)}
                variant="fullWidth"
                sx={{
                  backgroundColor: "#f3f4f6",
                  borderRadius: "8px",
                  padding: "4px",
                  "& .MuiTab-root": {
                    borderRadius: "6px",
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                    textTransform: "none",
                    minHeight: "40px",
                  },
                  "& .Mui-selected": {
                    backgroundColor: "#ffffff",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    color: "#4f46e5",
                  },
                }}
              >
                <Tab icon={<EmailOutlined fontSize="small" />} iconPosition="start" label="Email OTP" />
                <Tab icon={<PhoneAndroid fontSize="small" />} iconPosition="start" label="Mobile SMS OTP" />
              </Tabs>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="firstName"
                name="firstName"
                label="First Name"
                fullWidth
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
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
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
                label="Email Address"
                type="email"
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required={otpMethod === 1}
                id="mobile"
                name="mobile"
                label={otpMethod === 1 ? "Mobile Number (Required for SMS OTP)" : "Mobile Number (Optional)"}
                type="tel"
                fullWidth
                placeholder="e.g. 9876543210"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                error={!!errors.mobile}
                helperText={errors.mobile}
                InputProps={{
                  startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                id="password"
                name="password"
                label="Password"
                fullWidth
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                className="w-full"
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  padding: ".8rem 0",
                  backgroundColor: "#4f46e5",
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#4338ca" },
                }}
                disabled={auth.sendingOtp}
                startIcon={auth.sendingOtp ? <CircularProgress size={18} color="inherit" /> : null}
              >
                {auth.sendingOtp
                  ? "Sending Verification Code..."
                  : otpMethod === 1
                  ? "Verify via Mobile SMS OTP"
                  : "Verify via Email OTP"}
              </Button>
            </Grid>
          </Grid>
        </form>
      ) : (
        /* ── STEP 2: Amazon / Flipkart Style OTP Verification Screen ── */
        <Box component="form" onSubmit={handleVerifyAndSignup} className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <IconButton size="small" onClick={() => setStep(1)} title="Change Details">
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <h2 className="text-xl font-bold text-gray-900">
              {otpMethod === 1 ? "Verify Mobile Number" : "Verify Email Address"}
            </h2>
          </div>

          <Alert
            icon={otpMethod === 1 ? <SmsOutlinedIcon /> : <MarkEmailReadOutlinedIcon />}
            severity="info"
            className="text-xs"
          >
            {otpMethod === 1 ? (
              <>
                To complete registration, we've sent a 6-digit SMS OTP code to{" "}
                <strong>+91 {formData.mobile}</strong>
              </>
            ) : (
              <>
                To complete registration, we've sent a 6-digit OTP code to{" "}
                <strong>{formData.email}</strong>
              </>
            )}
          </Alert>

          {auth.error && <Alert severity="error">{auth.error}</Alert>}
          {errors.otp && <Alert severity="error">{errors.otp}</Alert>}

          <div className="pt-2">
            <TextField
              required
              id="otp"
              name="otp"
              label="Enter 6-Digit OTP Code"
              fullWidth
              autoFocus
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="e.g. 482915"
              inputProps={{ maxLength: 6, style: { fontSize: "1.25rem", letterSpacing: "0.25em", textAlign: "center" } }}
            />
          </div>

          <div className="flex justify-between items-center text-xs text-gray-500 pt-1">
            <span>
              {canResend ? "Didn't receive code?" : `Resend code in ${timer}s`}
            </span>
            <Button
              size="small"
              disabled={!canResend || auth.sendingOtp}
              onClick={handleResendOtp}
              sx={{ fontSize: "0.75rem", textTransform: "none", fontWeight: "bold" }}
            >
              Resend OTP
            </Button>
          </div>

          <Button
            type="submit"
            variant="contained"
            size="large"
            className="w-full"
            disabled={auth.isLoading || otp.length < 6}
            startIcon={auth.isLoading ? <CircularProgress size={18} color="inherit" /> : null}
            sx={{
              padding: ".8rem 0",
              backgroundColor: "#4f46e5",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#4338ca" },
            }}
          >
            {auth.isLoading ? "Verifying & Creating Account..." : "Create Your Account"}
          </Button>
        </Box>
      )}

      <div className="flex justify-center flex-col items-center mt-4">
        <div className="py-2 flex items-center text-sm text-gray-600">
          <span>Already have an account?</span>
          <Button onClick={() => navigate("/login")} className="ml-2" size="small">
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
}
