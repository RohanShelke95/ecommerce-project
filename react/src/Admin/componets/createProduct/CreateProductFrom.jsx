import { useEffect, useState, Fragment } from "react";
import { Typography, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import "./CreateProductForm.css";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../../../Redux/Customers/Product/Action";
import { getCategories } from "../../../Redux/Admin/Category/Action";
import { navigation } from "../../../config/navigationMenu";
import api from "../../../config/api";

const initialSizes = [
  { name: "S", quantity: 0 },
  { name: "M", quantity: 0 },
  { name: "L", quantity: 0 },
  { name: "X", quantity: 0 },
  { name: "XL", quantity: 0 },
  { name: "XXL", quantity: 0 }
];

const CreateProductForm = () => {

  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { categories } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const [productData, setProductData] = useState({

    imageUrl: "",
    images: [""],
    brand: "",
    title: "",
    color: "",
    discountedPrice: "",
    price: "",
    discountPersent: "",
    size: initialSizes,
    quantity: "",
    topLavelCategory: "",
    secondLavelCategory: "",
    thirdLavelCategory: "",
    description: "",
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevState) => {
      let newState = { ...prevState, [name]: value };

      // Reset child categories if parent changes
      if (name === "topLavelCategory") {
        newState.secondLavelCategory = "";
        newState.thirdLavelCategory = "";
      } else if (name === "secondLavelCategory") {
        newState.thirdLavelCategory = "";
      }

      // Dynamically update sizes based on category selection
      if (name === "thirdLavelCategory" || name === "secondLavelCategory" || name === "topLavelCategory") {
        const topCat = (newState.topLavelCategory || "").toLowerCase();
        const secondCat = (newState.secondLavelCategory || "").toLowerCase();
        const thirdCat = (newState.thirdLavelCategory || "").toLowerCase();

        // 1. Check if it's shoes
        const isShoes =
          topCat.includes("shoe") ||
          secondCat.includes("shoe") ||
          thirdCat.includes("shoe") ||
          thirdCat === "sneakers" ||
          thirdCat === "boots" ||
          thirdCat === "heels" ||
          thirdCat === "flats" ||
          thirdCat === "oxfords" ||
          thirdCat === "loafers" ||
          thirdCat === "sandals" ||
          thirdCat === "school_shoes";

        // 2. Check if it's Free Size (Accessories, Sarees, Lenghas, Gowns, Watches, Wallets, Bags, Sunglasses, Hats, Belts)
        const isFreeSize =
          topCat.includes("saree") ||
          secondCat.includes("saree") ||
          thirdCat.includes("saree") ||
          secondCat === "accessories" ||
          thirdCat.includes("watch") ||
          thirdCat.includes("wallet") ||
          thirdCat.includes("bag") ||
          thirdCat.includes("sunglass") ||
          thirdCat.includes("hat") ||
          thirdCat.includes("belt");

        // 3. Check if it's Jeans / Pants
        const isJeansOrPant =
          topCat.includes("jeans") || topCat.includes("pant") ||
          secondCat.includes("jeans") || secondCat.includes("pant") ||
          thirdCat.includes("jeans") || thirdCat.includes("pant");

        if (isFreeSize) {
          newState.size = [{ name: "Free Size", quantity: 0 }];
        } else if (isShoes) {
          if (topCat === "kids") {
            newState.size = [
              { name: "1", quantity: 0 },
              { name: "2", quantity: 0 },
              { name: "3", quantity: 0 },
              { name: "4", quantity: 0 },
              { name: "5", quantity: 0 }
            ];
          } else {
            newState.size = [
              { name: "6", quantity: 0 },
              { name: "7", quantity: 0 },
              { name: "8", quantity: 0 },
              { name: "9", quantity: 0 },
              { name: "10", quantity: 0 },
              { name: "11", quantity: 0 }
            ];
          }
        } else if (isJeansOrPant) {
          if (topCat === "kids") {
            newState.size = [
              { name: "22", quantity: 0 },
              { name: "24", quantity: 0 },
              { name: "26", quantity: 0 },
              { name: "28", quantity: 0 },
              { name: "30", quantity: 0 }
            ];
          } else {
            newState.size = [
              { name: "28", quantity: 0 },
              { name: "30", quantity: 0 },
              { name: "32", quantity: 0 },
              { name: "34", quantity: 0 },
              { name: "36", quantity: 0 },
              { name: "38", quantity: 0 }
            ];
          }
        } else {
          // Default clothing sizes
          if (topCat === "kids") {
            newState.size = [
              { name: "5-6Y", quantity: 0 },
              { name: "7-8Y", quantity: 0 },
              { name: "9-10Y", quantity: 0 },
              { name: "11-12Y", quantity: 0 },
              { name: "13-14Y", quantity: 0 }
            ];
          } else {
            newState.size = [
              { name: "S", quantity: 0 },
              { name: "M", quantity: 0 },
              { name: "L", quantity: 0 },
              { name: "XL", quantity: 0 },
              { name: "XXL", quantity: 0 }
            ];
          }
        }
      }

      return newState;
    });
  };

  const handleSizeChange = (e, index) => {
    let { name, value } = e.target;
    name === "size_quantity" ? name = "quantity" : name = e.target.name;

    const sizes = [...productData.size];
    sizes[index][name] = value;
    setProductData((prevState) => ({
      ...prevState,
      size: sizes,
    }));
  };




  const handleImageChange = async (e, index, isPrimary = false) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await api.post("/api/admin/products/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (isPrimary) {
        setProductData((prev) => ({ ...prev, imageUrl: data.imageUrl }));
      } else {
        const newImages = [...productData.images];
        newImages[index] = data.imageUrl;
        setProductData({ ...productData, images: newImages });
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const addImageField = () => {
    setProductData({ ...productData, images: [...productData.images, ""] });
  };

  const removeImageField = (index) => {
    const newImages = productData.images.filter((_, i) => i !== index);
    setProductData({ ...productData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalData = {
      ...productData,
      images: productData.images.filter(img => img.trim() !== ""),
      imageUrl: productData.imageUrl || productData.images[0] || "",
      price: Number(productData.price),
      discountedPrice: Number(productData.discountedPrice),
      discountPersent: Number(productData.discountPersent),
      quantity: Number(productData.quantity),
      size: productData.size.map(s => ({
        name: s.name,
        quantity: Number(s.quantity || 0)
      }))
    };

    setIsUploading(true);
    try {
      const { data } = await api.post("/api/admin/products/", finalData);

      // Dispatch success to update Redux store
      dispatch({
        type: "CREATE_PRODUCT_SUCCESS",
        payload: data,
      });

      if (data && (data.id || data.title)) {
        alert("Product added successfully!");
        window.location.reload();
      } else {
        throw new Error("No product data returned from server.");
      }
    } catch (error) {
      console.error("Failed to create product:", error);
      const errMsg = error.response?.data?.error || error.response?.data?.message || error.message;
      alert("Failed to add product: " + errMsg);
    } finally {
      setIsUploading(false);
    }
  };

  // Helper functions to get dynamic categories
  const topCategory = navigation.categories.find(c => c.id === productData.topLavelCategory);
  const secondCategory = topCategory?.sections.find(s => s.id === productData.secondLavelCategory);

  return (
    <div className="createProductContainer py-5">
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontSize: { xs: "1.75rem", sm: "2.25rem", md: "3rem" },
          fontWeight: "bold",
          color: "white"
        }}
        className="py-5 text-center"
      >
        Add New Product
      </Typography>
      <form
        onSubmit={handleSubmit}
        className="min-h-screen"
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className="flex items-center gap-4">
              <Button
                variant="contained"
                component="label"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload Primary Image"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 0, true)}
                />
              </Button>
              {productData.imageUrl && (
                <img src={productData.imageUrl} alt="Primary preview" className="w-16 h-16 object-cover rounded shadow" />
              )}
            </div>
          </Grid>
          {productData.images.map((image, index) => (
            <Fragment key={index}>
              <Grid item xs={10}>
                <div className="flex items-center gap-4 mt-2">
                  <Button
                    variant="outlined"
                    component="label"
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : `Upload Additional Image ${index + 1}`}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, index, false)}
                    />
                  </Button>
                  {image && (
                    <img src={image} alt={`Additional ${index + 1}`} className="w-16 h-16 object-cover rounded shadow" />
                  )}
                </div>
              </Grid>
              <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
                <Button onClick={() => removeImageField(index)} color="error" className="mt-2">Remove</Button>
              </Grid>
            </Fragment>
          ))}
          <Grid item xs={12}>
            <Button onClick={addImageField} variant="outlined">Add Another Image</Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Brand"
              name="brand"
              value={productData.brand}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={productData.title}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Color"
              name="color"
              value={productData.color}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              value={productData.quantity}
              onChange={handleChange}
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              value={productData.price}
              onChange={handleChange}
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Discounted Price"
              name="discountedPrice"
              value={productData.discountedPrice}
              onChange={handleChange}
              type="number"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Discount Percentage"
              name="discountPersent"
              value={productData.discountPersent}
              onChange={handleChange}
              type="number"
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Top Level Category</InputLabel>
              <Select
                name="topLavelCategory"
                value={productData.topLavelCategory}
                onChange={handleChange}
                label="Top Level Category"
              >
                {navigation.categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                ))}

                {/* Fallback for db categories not in navigation */}
                {categories.categories
                  ?.filter((c) => c.level === 1 && !navigation.categories.some(navCat => navCat.id === c.name.toLowerCase()))
                  .map((cat) => (
                    <MenuItem key={cat.id} value={cat.name.toLowerCase()}>
                      {cat.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth disabled={!productData.topLavelCategory}>
              <InputLabel>Second Level Category</InputLabel>
              <Select
                name="secondLavelCategory"
                value={productData.secondLavelCategory}
                onChange={handleChange}
                label="Second Level Category"
              >
                {topCategory?.sections.map((section) => (
                  <MenuItem key={section.id} value={section.id}>{section.name}</MenuItem>
                ))}

                {/* Fallback for db categories */}
                {categories.categories
                  ?.filter(
                    (c) =>
                      c.level === 2 &&
                      c.parentCategory?.name.toLowerCase() === productData.topLavelCategory &&
                      !topCategory?.sections.some(s => s.id === c.name.toLowerCase())
                  )
                  .map((cat) => (
                    <MenuItem key={cat.id} value={cat.name.toLowerCase()}>
                      {cat.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth disabled={!productData.secondLavelCategory}>
              <InputLabel>Third Level Category</InputLabel>
              <Select
                name="thirdLavelCategory"
                value={productData.thirdLavelCategory}
                onChange={handleChange}
                label="Third Level Category"
              >
                {secondCategory?.items.map((item) => (
                  <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                ))}

                {/* Fallback for db categories */}
                {categories.categories
                  ?.filter(
                    (c) =>
                      c.level === 3 &&
                      c.parentCategory?.name.toLowerCase() === productData.secondLavelCategory &&
                      c.parentCategory?.parentCategory?.name.toLowerCase() === productData.topLavelCategory &&
                      !secondCategory?.items.some(i => i.id === c.name.toLowerCase())
                  )
                  .map((cat) => (
                    <MenuItem key={cat.id} value={cat.name.toLowerCase()}>
                      {cat.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>


          <Grid item xs={12}>
            <TextField
              fullWidth
              id="outlined-multiline-static"
              label="Description"
              multiline
              name="description"
              rows={3}
              onChange={handleChange}
              value={productData.description}
            />
          </Grid>
          {productData.size.map((size, index) => (
            <Grid container item spacing={3} >
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Size Name"
                  name="name"
                  value={size.name}
                  onChange={(event) => handleSizeChange(event, index)}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Quantity"
                  name="size_quantity"
                  type="number"
                  onChange={(event) => handleSizeChange(event, index)}
                  required
                  fullWidth
                />
              </Grid> </Grid>

          ))}
          <Grid item xs={12} >
            <Button
              variant="contained"
              sx={{ p: 0.7 }}
              color="primary"
              size="large"
              type="submit"
            >
              Add New Product
            </Button>

          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default CreateProductForm;
