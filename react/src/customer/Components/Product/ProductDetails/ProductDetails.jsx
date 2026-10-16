import { useState, useEffect } from "react";
import { RadioGroup } from "@headlessui/react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ProductReviewCard from "./ProductReviewCard";
import { Button, Grid, Rating, Alert } from "@mui/material";
import HomeProductCard from "../../Home/HomeProductCard";
import ProductCardSkeleton from "../../Skeletons/ProductCardSkeleton";
import ProductDetailsSkeleton from "../../Skeletons/ProductDetailsSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { findProductById, findProducts } from "../../../../Redux/Customers/Product/Action";
import { addItemToCart } from "../../../../Redux/Customers/Cart/Action";
import { getAllReviews } from "../../../../Redux/Customers/Review/Action";
import { getImageUrl } from "../../../../utils/getImageUrl";
import { showToast } from "../../Toast/ToastNotification";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDetails() {
  const [selectedSize, setSelectedSize] = useState();
  const [activeImage, setActiveImage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { customersProduct } = useSelector((store) => store);
  const { productId } = useParams();
  const targetId = Number(productId);
  const jwt = localStorage.getItem("jwt");

  // Instant render: use passed product state if available, or store product if matching current ID
  const passedProduct =
    location.state?.product &&
    (location.state.product.id === targetId || location.state.product._id === targetId)
      ? location.state.product
      : null;

  const storeProduct =
    customersProduct.product?.id === targetId ? customersProduct.product : null;

  const product = storeProduct || passedProduct;

  // Scroll to top when product ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  // Sync activeImage whenever product imageUrl changes
  useEffect(() => {
    if (product?.imageUrl) {
      setActiveImage(getImageUrl(product.imageUrl));
    }
  }, [product?.imageUrl]);

  // Fetch product and reviews
  useEffect(() => {
    const data = { productId: targetId, jwt };
    dispatch(findProductById(data));
    dispatch(getAllReviews(productId));
  }, [productId, targetId, dispatch, jwt]);

  // Handle Similar Products
  const categoryName = product?.category?.name || product?.thirdLavelCategory || "";

  useEffect(() => {
    // Only query if we don't already have this category's products in Redux
    if (categoryName && (!customersProduct.categoryProducts?.[categoryName] || customersProduct.categoryProducts[categoryName].length === 0)) {
      const data = {
        category: categoryName,
        colors: [],
        sizes: [],
        minPrice: 0,
        maxPrice: 100000,
        minDiscount: 0,
        sort: "price_low",
        pageNumber: 0,
        pageSize: 10,
        stock: "",
      };
      dispatch(findProducts(data));
    }
  }, [categoryName, customersProduct.categoryProducts, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!jwt) {
      showToast("Please login first to add products to your cart", "warning");
      navigate("/login");
      return;
    }
    if (!selectedSize) {
      setErrorMsg("Please select a size before adding to cart.");
      showToast("Please select a size first", "warning");
      return;
    }
    setErrorMsg("");
    const effectiveProductId = product?.id || product?._id || targetId || productId;
    const data = { productId: effectiveProductId, size: selectedSize.name, quantity: 1 };
    dispatch(addItemToCart({ data, jwt, product }));
    showToast("Product added to cart!", "success");
    navigate("/cart");
  };

  // If no product is loaded yet (e.g. hard reload / direct link), show skeleton
  if (!product) {
    return <ProductDetailsSkeleton />;
  }

  const totalRatings = product?.ratings?.length || 0;
  const averageRating =
    totalRatings > 0
      ? product.ratings.reduce((acc, rating) => acc + rating.rating, 0) / totalRatings
      : 0;

  const allImages = [product.imageUrl, ...(product.images || [])]
    .filter(Boolean)
    .map(getImageUrl);

  // Filter similar items: ONLY products matching the exact same category, excluding current product
  const rawCategoryItems =
    customersProduct.categoryProducts?.[categoryName] ||
    (customersProduct.products?.content?.some((p) => p.category?.name === categoryName)
      ? customersProduct.products.content
      : []);

  const similarProducts = rawCategoryItems
    .filter((item) => (item.id || item._id) !== targetId)
    .slice(0, 10);

  return (
    <div className="bg-white lg:px-20 min-h-screen">
      <div className="pt-6">
        <nav aria-label="Breadcrumb">
          <ol
            role="list"
            className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
          >
            <li>
              <div className="flex items-center">
                <a href={"/"} className="mr-2 text-sm font-medium text-gray-900">
                  {product?.category?.parentCategory?.name || "Home"}
                </a>
                <svg
                  width={16}
                  height={20}
                  viewBox="0 0 16 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="h-5 w-4 text-gray-300"
                >
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mr-2 text-sm font-medium text-gray-900 capitalize">
                  {categoryName.replace(/_/g, " ")}
                </span>
                <svg
                  width={16}
                  height={20}
                  viewBox="0 0 16 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="h-5 w-4 text-gray-300"
                >
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>
            <li className="text-sm">
              <span className="font-medium text-gray-500 truncate max-w-xs block">
                {product?.title}
              </span>
            </li>
          </ol>
        </nav>

        {/* Product details */}
        <section className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2 px-4 pt-10">
          {/* Image gallery */}
          <div className="flex flex-col items-center">
            <div className="overflow-hidden rounded-lg max-w-[30rem] max-h-[35rem] w-full bg-gray-50 border border-gray-100 flex items-center justify-center">
              <img
                src={activeImage || getImageUrl(product?.imageUrl)}
                alt={product?.title || "Product"}
                className="h-full w-full object-cover object-center transition-all duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            {allImages.length > 1 && (
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {allImages.map((img, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer overflow-hidden rounded-lg border-2 ${
                      activeImage === img ? "border-indigo-600" : "border-transparent"
                    } w-[4.5rem] h-[4.5rem] sm:w-[5rem] sm:h-[5rem] hover:opacity-80 transition-all`}
                    onClick={() => setActiveImage(img)}
                  >
                    <img
                      src={img}
                      className="h-full w-full object-cover object-center"
                      alt={`product-thumbnail-${index}`}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="lg:col-span-1 mx-auto max-w-2xl px-4 pb-16 sm:px-6 lg:max-w-7xl lg:px-8 lg:pb-24">
            <div className="lg:col-span-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                {product?.brand}
              </h1>
              <h2 className="text-base sm:text-lg tracking-tight text-gray-600 pt-1">
                {product?.title}
              </h2>
            </div>

            {/* Pricing & Offer */}
            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <div className="flex space-x-5 items-center text-lg lg:text-2xl tracking-tight text-gray-900 mt-6">
                <p className="font-bold text-gray-900">
                  ₹{product?.discountedPrice || product?.price}
                </p>
                {product?.discountedPrice && product?.discountedPrice < product?.price && (
                  <>
                    <p className="opacity-50 line-through text-base">₹{product?.price}</p>
                    <p className="text-green-600 font-semibold text-base">
                      {product?.discountPersent}% Off
                    </p>
                  </>
                )}
              </div>

              {/* Reviews & Ratings */}
              <div className="mt-4">
                <div className="flex items-center space-x-3">
                  <Rating name="read-only" value={averageRating} precision={0.5} readOnly />
                  <p className="opacity-60 text-sm">{totalRatings} Ratings</p>
                  <p className="ml-3 text-sm font-medium text-indigo-600">
                    {product?.reviews?.length || 0} reviews
                  </p>
                </div>
              </div>

              <form className="mt-8" onSubmit={handleSubmit}>
                {/* Sizes */}
                {product?.sizes && product.sizes.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">Select Size</h3>
                    </div>

                    <RadioGroup
                      value={selectedSize}
                      onChange={setSelectedSize}
                      className="mt-3"
                    >
                      <RadioGroup.Label className="sr-only">Choose a size</RadioGroup.Label>
                      <div className="flex flex-wrap gap-2.5">
                        {[...(product.sizes || [])]
                          .sort((a, b) => {
                            const order = ["S", "M", "L", "XL", "XXL", "XXXL", "Free Size"];
                            const idxA = order.indexOf(a.name);
                            const idxB = order.indexOf(b.name);
                            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                            if (idxA !== -1) return 1;
                            if (idxB !== -1) return -1;
                            return a.name.localeCompare(b.name);
                          })
                          .map((size) => (
                            <RadioGroup.Option
                              key={size.name}
                              value={size}
                              disabled={size.quantity === 0}
                              className={({ active, checked }) =>
                                classNames(
                                  size.quantity > 0
                                    ? "cursor-pointer bg-white text-gray-900 shadow-sm"
                                    : "cursor-not-allowed bg-gray-50 text-gray-300",
                                  checked ? "ring-2 ring-indigo-600 border-indigo-600" : "border-gray-200",
                                  "group relative flex items-center justify-center rounded-md border py-2.5 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none transition-all"
                                )
                              }
                            >
                              {({ checked }) => (
                                <RadioGroup.Label as="span" className={checked ? "font-bold text-indigo-600" : ""}>
                                  {size.name}
                                </RadioGroup.Label>
                              )}
                            </RadioGroup.Option>
                          ))}
                      </div>
                    </RadioGroup>
                    {errorMsg && (
                      <div className="mt-3">
                        <Alert severity="warning" size="small">{errorMsg}</Alert>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    padding: ".8rem 2.5rem",
                    marginTop: "2rem",
                    backgroundColor: "#4f46e5",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "8px",
                    "&:hover": { backgroundColor: "#4338ca" },
                  }}
                >
                  Add To Cart
                </Button>
              </form>
            </div>

            {/* Description */}
            <div className="py-8 border-t border-gray-100 mt-8">
              <h3 className="font-semibold text-gray-900 text-sm mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product?.description || "No description available for this product."}
              </p>
            </div>
          </div>
        </section>

        {/* Rating and review section */}
        <section className="px-4 py-8 border-t border-gray-100">
          <h2 className="font-bold text-xl text-gray-900 pb-4">Recent Review & Ratings</h2>

          <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
            <Grid container spacing={{ xs: 4, md: 7 }}>
              <Grid item xs={12} md={7}>
                <div className="space-y-4">
                  {product?.reviews?.length > 0 ? (
                    product.reviews.map((item, i) => (
                      <ProductReviewCard key={i} item={item} />
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No reviews yet. Be the first to review this product!
                    </p>
                  )}
                </div>
              </Grid>

              <Grid item xs={12} md={5}>
                <div className="flex justify-between items-center pb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Product Ratings</h3>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/account/rate/${productId}`)}
                    sx={{ textTransform: "none" }}
                  >
                    Rate Product
                  </Button>
                </div>
                <div className="flex items-center space-x-3 pb-6">
                  <Rating name="read-only" value={averageRating} precision={0.5} readOnly />
                  <p className="text-gray-500 text-sm">{totalRatings} Ratings</p>
                </div>
              </Grid>
            </Grid>
          </div>
        </section>

        {/* Similar Products */}
        <section className="px-4 pt-8 pb-16">
          <h2 className="text-xl font-bold text-gray-900 pb-5">Similar Products</h2>
          {similarProducts.length > 0 ? (
            <div className="flex flex-wrap gap-4 justify-start">
              {similarProducts.map((item, i) => (
                <HomeProductCard key={item.id || i} product={item} />
              ))}
            </div>
          ) : (
            <div className="flex space-x-4 overflow-hidden py-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex-shrink-0">
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
