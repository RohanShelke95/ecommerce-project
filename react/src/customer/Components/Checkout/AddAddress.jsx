import * as React from "react";
import {
  Grid,
  TextField,
  Button,
  Box,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../../Redux/Auth/Action";
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";

export default function AddDeliveryAddressForm({ handleNext }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { auth } = useSelector((store) => store);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingId, setLoadingId] = useState(null); // track which address is loading
  const [formLoading, setFormLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [editingAddressId, setEditingAddressId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // ── helpers ──────────────────────────────────────────────────────────────

  /** Send address to backend → create order → navigate to step 3 */
  const placeOrder = async (address) => {
    setErrorMsg("");
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/orders/`,
        address,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log("Order created:", data);
      if (data && data.id) {
        navigate(`/checkout?step=3&order_id=${data.id}`);
      } else {
        setErrorMsg("Order created but no ID returned. Please try again.");
      }
    } catch (err) {
      console.error("Order creation error:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to create order. Please try again.";
      setErrorMsg(msg);
    }
  };

  // ── Deliver Here (saved address) ────────────────────────────────────────
  const handleCreateOrder = async (item) => {
    setSelectedAddress(item);
    setLoadingId(item.id);
    // Send only the address fields (no id, no user object) so backend creates fresh
    const addressPayload = {
      firstName: item.firstName,
      lastName: item.lastName,
      streetAddress: item.streetAddress,
      city: item.city,
      state: item.state,
      zipCode: item.zipCode,
      mobile: item.mobile,
    };
    await placeOrder(addressPayload);
    setLoadingId(null);
  };

  // ── New address form submit ──────────────────────────────────────────────
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const address = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      streetAddress: data.get("address"),
      city: data.get("city"),
      state: data.get("state"),
      zipCode: data.get("zip"),
      mobile: data.get("phoneNumber"),
    };
    setFormLoading(true);
    await placeOrder(address);
    setFormLoading(false);
  };

  // ── Edit address ─────────────────────────────────────────────────────────
  const handleEditClick = (e, item) => {
    e.stopPropagation();
    setEditingAddressId(item.id);
    setEditError("");
    setEditFormData({
      firstName: item.firstName || "",
      lastName: item.lastName || "",
      streetAddress: item.streetAddress || "",
      city: item.city || "",
      state: item.state || "",
      zipCode: item.zipCode || "",
      mobile: item.mobile || "",
    });
  };

  const handleCancelEdit = (e) => {
    e && e.stopPropagation();
    setEditingAddressId(null);
    setEditFormData({});
    setEditError("");
  };

  const handleSaveEdit = async (e, addressId) => {
    e.stopPropagation();
    setEditLoading(true);
    setEditError("");
    try {
      await axios.put(
        `${API_BASE_URL}/api/users/address/${addressId}`,
        editFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      dispatch(getUser(jwt)); // refresh user data
      setEditingAddressId(null);
      setEditFormData({});
    } catch (error) {
      console.error("Error updating address:", error);
      setEditError("Could not save. Please try again.");
    } finally {
      setEditLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Grid container spacing={4}>
      {/* ── LEFT: Saved Addresses ── */}
      <Grid item xs={12} lg={5}>
        <Box
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            background: "#fff",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              p: "14px 20px",
              color: "#fff",
            }}
          >
            <p
              style={{
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Saved Addresses
            </p>
          </Box>

          {/* Error banner */}
          {errorMsg && (
            <Alert severity="error" sx={{ m: 2 }} onClose={() => setErrorMsg("")}>
              {errorMsg}
            </Alert>
          )}

          {/* Address list */}
          <Box sx={{ maxHeight: "34rem", overflowY: "auto" }}>
            {auth.user?.addresses?.length > 0 ? (
              auth.user.addresses.map((item) => (
                <Box
                  key={item.id}
                  onClick={() =>
                    editingAddressId !== item.id && setSelectedAddress(item)
                  }
                  sx={{
                    p: "16px 20px",
                    borderBottom: "1px solid #f3f4f6",
                    cursor:
                      editingAddressId === item.id ? "default" : "pointer",
                    transition: "background 0.2s",
                    background:
                      selectedAddress?.id === item.id &&
                      editingAddressId !== item.id
                        ? "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)"
                        : "#fff",
                    borderLeft:
                      selectedAddress?.id === item.id &&
                      editingAddressId !== item.id
                        ? "4px solid #7c3aed"
                        : "4px solid transparent",
                    "&:hover": {
                      background:
                        editingAddressId === item.id ? "#fff" : "#fafafa",
                    },
                  }}
                >
                  {editingAddressId !== item.id ? (
                    /* ── Normal view ── */
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 0.5,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <HomeIcon sx={{ fontSize: 16, color: "#7c3aed" }} />
                          <span
                            style={{ fontWeight: 600, fontSize: "0.9rem" }}
                          >
                            {item.firstName} {item.lastName}
                          </span>
                          {selectedAddress?.id === item.id && (
                            <Chip
                              icon={
                                <CheckCircleIcon sx={{ fontSize: 13 }} />
                              }
                              label="Selected"
                              size="small"
                              sx={{
                                background: "#7c3aed",
                                color: "#fff",
                                fontSize: "0.6rem",
                                height: 18,
                                "& .MuiChip-icon": { color: "#fff" },
                              }}
                            />
                          )}
                        </Box>
                        <IconButton
                          size="small"
                          onClick={(e) => handleEditClick(e, item)}
                          title="Edit address"
                          sx={{
                            color: "#7c3aed",
                            "&:hover": { background: "#ede9fe" },
                          }}
                        >
                          <EditIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                      </Box>

                      <p
                        style={{
                          fontSize: "0.82rem",
                          color: "#6b7280",
                          margin: "2px 0",
                        }}
                      >
                        {item.streetAddress}, {item.city}
                      </p>
                      <p
                        style={{
                          fontSize: "0.82rem",
                          color: "#6b7280",
                          margin: "2px 0",
                        }}
                      >
                        {item.state} – {item.zipCode}
                      </p>
                      <p
                        style={{
                          fontSize: "0.82rem",
                          color: "#6b7280",
                          margin: "2px 0 12px",
                        }}
                      >
                        <strong>Mobile:</strong> {item.mobile}
                      </p>

                      <Button
                        size="small"
                        variant="contained"
                        disabled={loadingId !== null}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateOrder(item);
                        }}
                        startIcon={
                          loadingId === item.id ? (
                            <CircularProgress
                              size={14}
                              sx={{ color: "#fff" }}
                            />
                          ) : null
                        }
                        sx={{
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "0.72rem",
                          letterSpacing: "0.06em",
                          borderRadius: "6px",
                          px: 2.5,
                          py: 0.8,
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #5a6fd8 0%, #663d96 100%)",
                          },
                          "&.Mui-disabled": { opacity: 0.65 },
                        }}
                      >
                        {loadingId === item.id
                          ? "Placing Order..."
                          : "DELIVER HERE"}
                      </Button>
                    </>
                  ) : (
                    /* ── Inline edit form ── */
                    <Box onClick={(e) => e.stopPropagation()}>
                      <p
                        style={{
                          fontWeight: 700,
                          color: "#7c3aed",
                          fontSize: "0.85rem",
                          marginBottom: "12px",
                        }}
                      >
                        ✏️ Edit Address
                      </p>
                      {editError && (
                        <Alert severity="error" sx={{ mb: 1.5 }}>
                          {editError}
                        </Alert>
                      )}
                      <Grid container spacing={1.5}>
                        {[
                          { label: "First Name", key: "firstName", xs: 6 },
                          { label: "Last Name", key: "lastName", xs: 6 },
                          { label: "Street Address", key: "streetAddress", xs: 12, multiline: true, rows: 2 },
                          { label: "City", key: "city", xs: 6 },
                          { label: "State", key: "state", xs: 6 },
                          { label: "Zip Code", key: "zipCode", xs: 6 },
                          { label: "Mobile", key: "mobile", xs: 6 },
                        ].map(({ label, key, xs, multiline, rows }) => (
                          <Grid item xs={xs} key={key}>
                            <TextField
                              size="small"
                              label={label}
                              value={editFormData[key] || ""}
                              multiline={multiline}
                              rows={rows}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  [key]: e.target.value,
                                })
                              }
                              fullWidth
                            />
                          </Grid>
                        ))}
                        <Grid item xs={12}>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              size="small"
                              variant="contained"
                              disabled={editLoading}
                              onClick={(e) => handleSaveEdit(e, item.id)}
                              sx={{
                                background: "#7c3aed",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: "0.72rem",
                                "&:hover": { background: "#6d28d9" },
                              }}
                            >
                              {editLoading ? "Saving..." : "Save"}
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={handleCancelEdit}
                              sx={{
                                borderColor: "#7c3aed",
                                color: "#7c3aed",
                                fontWeight: 600,
                                fontSize: "0.72rem",
                                "&:hover": {
                                  borderColor: "#6d28d9",
                                  background: "#f5f3ff",
                                },
                              }}
                            >
                              Cancel
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Box>
              ))
            ) : (
              <Box sx={{ p: 4, textAlign: "center", color: "#9ca3af" }}>
                <p style={{ fontSize: "0.9rem" }}>No saved addresses found.</p>
                <p style={{ fontSize: "0.78rem", marginTop: 4 }}>
                  Add a new address on the right →
                </p>
              </Box>
            )}
          </Box>
        </Box>
      </Grid>

      {/* ── RIGHT: Add New Address form ── */}
      <Grid item xs={12} lg={7}>
        <Box
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            background: "#fff",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              p: "14px 20px",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p
              style={{
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Add New Address
            </p>
            <AddIcon sx={{ fontSize: 20 }} />
          </Box>

          {/* Error banner for new form */}
          {errorMsg && !loadingId && (
            <Alert severity="error" sx={{ m: 2 }} onClose={() => setErrorMsg("")}>
              {errorMsg}
            </Alert>
          )}

          <Box sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    fullWidth
                    autoComplete="given-name"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
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
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    id="address"
                    name="address"
                    label="Street Address"
                    fullWidth
                    autoComplete="street-address"
                    multiline
                    rows={3}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="city"
                    name="city"
                    label="City"
                    fullWidth
                    autoComplete="address-level2"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="state"
                    name="state"
                    label="State / Province / Region"
                    fullWidth
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="zip"
                    name="zip"
                    label="Zip / Postal Code"
                    fullWidth
                    autoComplete="postal-code"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Phone Number"
                    fullWidth
                    autoComplete="tel"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    sx={{
                      padding: "0.85rem 2rem",
                      borderRadius: "8px",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      letterSpacing: "0.05em",
                      width: "100%",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #5a6fd8 0%, #663d96 100%)",
                        boxShadow: "0 4px 15px rgba(102,126,234,0.4)",
                      },
                      "&.Mui-disabled": { opacity: 0.65 },
                    }}
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={formLoading || loadingId !== null}
                    startIcon={
                      formLoading ? (
                        <CircularProgress size={18} sx={{ color: "#fff" }} />
                      ) : null
                    }
                  >
                    {formLoading ? "Placing Order..." : "DELIVER HERE"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
