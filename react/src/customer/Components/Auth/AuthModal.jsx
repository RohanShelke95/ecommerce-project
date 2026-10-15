import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import RegisterUserForm from "./Register";
import { useEffect } from "react";
import LoginUserForm from "./Login";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95vw", sm: 480 },
  maxWidth: 480,
  bgcolor: "background.paper",
  boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
  borderRadius: { xs: 2, sm: 3 },
  overflow: "hidden",
  maxHeight: "92vh",
  display: "flex",
  flexDirection: "column",
};

export default function AuthModal({ handleClose, open }) {
  const location = useLocation();
  const { auth } = useSelector((store) => store);
  const isLogin = location.pathname === "/login";

  useEffect(() => {
    if (auth.user) handleClose();
  }, [auth.user, handleClose]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="auth-modal-title"
      aria-describedby="auth-modal-description"
    >
      <Box sx={style}>
        {/* ── Branded Header ── */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            px: { xs: 2.5, sm: 4 },
            py: { xs: 2, sm: 2.5 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <Box>
            <Typography
              id="auth-modal-title"
              variant="h6"
              sx={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: { xs: "1rem", sm: "1.125rem" },
                lineHeight: 1.2,
              }}
            >
              ShopWithUs
            </Typography>
            <Typography
              sx={{
                color: "#e0e7ff",
                fontSize: { xs: "0.72rem", sm: "0.8rem" },
                mt: 0.25,
              }}
            >
              {isLogin ? "Welcome back! Please sign in." : "Create your free account"}
            </Typography>
          </Box>
          <IconButton
            aria-label="close auth modal"
            onClick={handleClose}
            size="small"
            sx={{
              color: "#fff",
              bgcolor: "rgba(255,255,255,0.15)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* ── Form Body ── */}
        <Box
          id="auth-modal-description"
          sx={{
            px: { xs: 2.5, sm: 4 },
            py: { xs: 2.5, sm: 3 },
            overflowY: "auto",
            flexGrow: 1,
          }}
        >
          {isLogin ? <LoginUserForm /> : <RegisterUserForm />}
        </Box>
      </Box>
    </Modal>
  );
}
