import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";

/**
 * Amazon / Flipkart style Forgot Password — 3-step flow:
 *  Step 1: Enter registered email
 *  Step 2: Enter 6-digit OTP sent to email
 *  Step 3: Set new password
 */
export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Step 1: Request OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
      setStep(2);
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Could not send reset code. Please check your email and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    setError("");
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length < 6) {
      setError("Please enter the 6-digit verification code from your email.");
      return;
    }
    setError("");
    setStep(3);
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        email,
        otp: otp.trim(),
        newPassword,
      });
      setStep(4);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid or expired verification code. Please start again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)" }}
    >
      <div className="w-full max-w-md mx-4">
        {/* Card */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(79, 70, 229, 0.12)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              padding: "28px 32px",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{ color: "#fff", fontWeight: "bold", letterSpacing: 1 }}
            >
              ShopWithUs
            </Typography>
            <Typography sx={{ color: "#e0e7ff", fontSize: "14px", mt: 0.5 }}>
              {step === 4 ? "Password Reset Successful ✅" : "Forgot your password?"}
            </Typography>
          </div>

          {/* Body */}
          <div style={{ padding: "32px" }}>

            {/* Step 1 — Email */}
            {step === 1 && (
              <Box component="form" onSubmit={handleSendOtp}>
                <div className="flex items-center gap-2 mb-4">
                  <LockResetIcon sx={{ color: "#4f46e5" }} />
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#111827" }}>
                    Reset Your Password
                  </Typography>
                </div>
                <Typography sx={{ fontSize: "14px", color: "#4b5563", mb: 3, lineHeight: 1.6 }}>
                  Enter the email address associated with your ShopWithUs account
                  and we'll send you a 6-digit verification code.
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <TextField
                  label="Registered Email Address"
                  type="email"
                  fullWidth
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 3 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                  sx={{
                    py: 1.5,
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                    fontWeight: "bold",
                    "&:hover": { background: "linear-gradient(135deg, #4338ca, #6d28d9)" },
                  }}
                >
                  {loading ? "Sending Code..." : "Send Verification Code"}
                </Button>
                <Button
                  fullWidth
                  size="small"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate("/login")}
                  sx={{ mt: 2, textTransform: "none", color: "#6b7280" }}
                >
                  Back to Login
                </Button>
              </Box>
            )}

            {/* Step 2 — OTP */}
            {step === 2 && (
              <Box component="form" onSubmit={handleVerifyOtp}>
                <div className="flex items-center gap-2 mb-4">
                  <MarkEmailReadOutlinedIcon sx={{ color: "#4f46e5" }} />
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#111827" }}>
                    Check Your Email
                  </Typography>
                </div>
                <Alert icon={false} severity="info" sx={{ mb: 2, fontSize: "13px" }}>
                  We sent a 6-digit verification code to{" "}
                  <strong>{email}</strong>. Check your inbox (and spam folder).
                </Alert>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <TextField
                  label="6-Digit Verification Code"
                  fullWidth
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="e.g. 482915"
                  inputProps={{
                    maxLength: 6,
                    style: {
                      fontSize: "1.4rem",
                      letterSpacing: "0.4em",
                      textAlign: "center",
                    },
                  }}
                  sx={{ mb: 2 }}
                />

                <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                  <span>
                    {canResend ? "Didn't receive the code?" : `Resend code in ${timer}s`}
                  </span>
                  <Button
                    size="small"
                    disabled={!canResend || loading}
                    onClick={handleResendOtp}
                    sx={{ fontSize: "0.75rem", textTransform: "none", fontWeight: "bold", color: "#4f46e5" }}
                  >
                    Resend Code
                  </Button>
                </div>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={otp.length < 6}
                  sx={{
                    py: 1.5,
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                    fontWeight: "bold",
                    "&:hover": { background: "linear-gradient(135deg, #4338ca, #6d28d9)" },
                  }}
                >
                  Verify Code
                </Button>

                <Button
                  fullWidth
                  size="small"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => { setStep(1); setOtp(""); setError(""); }}
                  sx={{ mt: 2, textTransform: "none", color: "#6b7280" }}
                >
                  Change Email
                </Button>
              </Box>
            )}

            {/* Step 3 — New Password */}
            {step === 3 && (
              <Box component="form" onSubmit={handleResetPassword}>
                <div className="flex items-center gap-2 mb-4">
                  <LockResetIcon sx={{ color: "#4f46e5" }} />
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#111827" }}>
                    Create New Password
                  </Typography>
                </div>
                <Typography sx={{ fontSize: "14px", color: "#4b5563", mb: 3 }}>
                  Your identity has been verified. Please enter your new password below.
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <TextField
                  label="New Password"
                  fullWidth
                  required
                  autoFocus
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  helperText="Minimum 6 characters"
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((p) => !p)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Confirm New Password"
                  fullWidth
                  required
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  sx={{ mb: 3 }}
                  error={confirmPassword.length > 0 && newPassword !== confirmPassword}
                  helperText={
                    confirmPassword.length > 0 && newPassword !== confirmPassword
                      ? "Passwords do not match"
                      : ""
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirm((p) => !p)} edge="end">
                          {showConfirm ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading || newPassword !== confirmPassword || newPassword.length < 6}
                  startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                  sx={{
                    py: 1.5,
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                    fontWeight: "bold",
                    "&:hover": { background: "linear-gradient(135deg, #4338ca, #6d28d9)" },
                  }}
                >
                  {loading ? "Resetting Password..." : "Reset Password"}
                </Button>
              </Box>
            )}

            {/* Step 4 — Success */}
            {step === 4 && (
              <div className="text-center py-4">
                <CheckCircleOutlineIcon
                  sx={{ fontSize: 64, color: "#059669", mb: 2 }}
                />
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#111827", mb: 1 }}>
                  Password Reset Successfully!
                </Typography>
                <Typography sx={{ fontSize: "14px", color: "#4b5563", mb: 3, lineHeight: 1.6 }}>
                  Your password has been updated. A confirmation email has been sent to{" "}
                  <strong>{email}</strong>. You can now log in with your new password.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => navigate("/login")}
                  sx={{
                    py: 1.5,
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                    fontWeight: "bold",
                    "&:hover": { background: "linear-gradient(135deg, #4338ca, #6d28d9)" },
                  }}
                >
                  Log In Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
