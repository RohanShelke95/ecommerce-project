import { useState, useEffect } from "react";
import { RadioGroup } from "@headlessui/react";
import { useNavigate, useParams } from "react-router-dom";
import ProductReviewCard from "./ProductReviewCard";
import { Button, Grid, Rating, Alert } from "@mui/material";
import HomeProductCard from "../../Home/HomeProductCard";
import { useDispatch, useSelector } from "react-redux";
import { findProductById, findProducts } from "../../../../Redux/Customers/Product/Action";
import { addItemToCart } from "../../../../Redux/Customers/Cart/Action";
import { getAllReviews } from "../../../../Redux/Customers/Review/Action";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDetails() {
  const [selectedSize, setSelectedSize] = useState();
  const [activeImage, setActiveImage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customersProduct } = useSelector((store) => store);
  const { productId } = useParams();
  const jwt = localStorage.getItem("jwt");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!jwt) {
      setErrorMsg("Please login first to add products to your cart.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }
    if (!selectedSize) {
      setErrorMsg("Please select a size before adding to cart.");
      return;
    }
    setErrorMsg("");
    const data = { productId, size: selectedSize.name };
    dispatch(addItemToCart({ data, jwt }));
    navigate("/cart");
  };

  useEffect(() => {
    const data = { productId: Number(productId), jwt };
    dispatch(findProductById(data));
    dispatch(getAllReviews(productId));
  }, [productId, dispatch, jwt]);

  useEffect(() => {
    if (customersProduct.product) {
      setActiveImage(customersProduct.product.imageUrl);
    }
  }, [customersProduct.product]);

  useEffect(() => {
    if (customersProduct.product) {
      const data = {
        category: customersProduct.product.category?.name || "",
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
  }, [customersProduct.product, dispatch]);

  const totalRatings = customersProduct.product?.ratings?.length || 0;
  const averageRating = totalRatings > 0 
    ? customersProduct.product.ratings.reduce((acc, rating) => acc + rating.rating, 0) / totalRatings 
    : 0;


  const allImages = customersProduct.product ? [customersProduct.product.imageUrl, ...(customersProduct.product.images || [])].filter(Boolean) : [];

  return (
    <div className="bg-white lg:px-20">
      <div className="pt-6">
        <nav aria-label="Breadcrumb">
          <ol
            role="list"
            className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
          >
            <li>
              <div className="flex items-center">
                <a
                  href={"/"}
                  className="mr-2 text-sm font-medium text-gray-900"
                >
                  {customersProduct.product?.category?.parentCategory?.name}
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
                <a
                  href={"/"}
                  className="mr-2 text-sm font-medium text-gray-900"
                >
                  {customersProduct.product?.category?.name}
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
            <li className="text-sm">
              <a
                href={"#"}
                aria-current="page"
                className="font-medium text-gray-500 hover:text-gray-600"
              >
                {customersProduct.product?.title}
              </a>
            </li>
          </ol>
        </nav>

        {/* product details */}
        <section className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2 px-4 pt-10">
          {/* Image gallery */}
          <div className="flex flex-col items-center ">
            <div className="overflow-hidden rounded-lg max-w-[30rem] max-h-[35rem] w-full">
              <img
                src={activeImage || customersProduct.product?.imageUrl}
                alt={customersProduct.product?.title}
                className="h-full w-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>
            {allImages.length > 1 && (
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {allImages.map((img, index) => (
                  <div 
                    key={index} 
                    className={`cursor-pointer overflow-hidden rounded-lg border-2 ${activeImage === img ? 'border-indigo-600' : 'border-transparent'} w-[5rem] h-[5rem] hover:opacity-80 transition-all`}
                    onClick={() => setActiveImage(img)}
                  >
                    <img src={img} className="h-full w-full object-cover object-center" alt={`product-thumbnail-${index}`} referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="lg:col-span-1 mx-auto max-w-2xl px-4 pb-16 sm:px-6  lg:max-w-7xl  lg:px-8 lg:pb-24">
            <div className="lg:col-span-2">
              <h1 className="text-lg lg:text-xl font-semibold tracking-tight text-gray-900  ">
                {customersProduct.product?.brand}
              </h1>
              <h1 className="text-lg lg:text-xl tracking-tight text-gray-900 opacity-60 pt-1">
                {customersProduct.product?.title}
              </h1>
            </div>

            {/* Options */}
            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <h2 className="sr-only">Product information</h2>
              <div className="flex space-x-5 items-center text-lg lg:text-xl tracking-tight text-gray-900 mt-6">
                <p className="font-semibold">
                  ₹{customersProduct.product?.discountedPrice}
                </p>
                <p className="opacity-50 line-through">
                  ₹{customersProduct.product?.price}
                </p>
                <p className="text-green-600 font-semibold">
                  {customersProduct.product?.discountPersent}% Off
                </p>
              </div>

              {/* Reviews */}
              <div className="mt-6">
                <h3 className="sr-only">Reviews</h3>

                <div className="flex items-center space-x-3">
                  <Rating
                    name="read-only"
                    value={averageRating}
                    precision={0.5}
                    readOnly
                  />

                  <p className="opacity-60 text-sm">{totalRatings} Ratings</p>
                  <p className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    {customersProduct.product?.reviews?.length || 0} reviews
                  </p>
                </div>
              </div>

              <form className="mt-10" onSubmit={handleSubmit}>
                {/* Sizes */}
                <div className="mt-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                  </div>

                  <RadioGroup
                    value={selectedSize}
                    onChange={setSelectedSize}
                    className="mt-4"
                  >
                    <RadioGroup.Label className="sr-only">
                      Choose a size
                    </RadioGroup.Label>
                    <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-10">
                      {[...(customersProduct.product?.sizes || [])]
                        .sort((a, b) => {
                          const order = ["S", "M", "L", "XL", "XXL", "XXXL", "Free Size"];
                          const idxA = order.indexOf(a.name);
                          const idxB = order.indexOf(b.name);
                          if (idxA !== -1 && idxB !== -1) {
                            return idxA - idxB;
                          }
                          if (idxA !== -1) return 1;
                          if (idxB !== -1) return -1;

                          const parseFirstNumber = (name) => {
                            const match = name.match(/^(\d+)/);
                            return match ? parseInt(match[1], 10) : NaN;
                          };
                          
                          const numA = parseFirstNumber(a.name);
                          const numB = parseFirstNumber(b.name);
                          if (!isNaN(numA) && !isNaN(numB)) {
                            return numA - numB;
                          }
                          return a.name.localeCompare(b.name);
                        })
                        .map((size) => (
                        <RadioGroup.Option
                          key={size.name}
                          value={size}
                          disabled={size.quantity === 0}
                          className={({ active }) =>
                            classNames(
                              size.quantity > 0
                                ? "cursor-pointer bg-white text-gray-900 shadow-sm"
                                : "cursor-not-allowed bg-gray-50 text-gray-200",
                              active ? "ring-1 ring-indigo-500" : "",
                              "group relative flex items-center justify-center rounded-md border py-1 px-1 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6"
                            )
                          }
                        >
                          {({ active, checked }) => (
                            <>
                              <RadioGroup.Label as="span">
                                {size.name}
                              </RadioGroup.Label>
                              {size.quantity > 0 ? (
                                <span
                                  className={classNames(
                                    active ? "border" : "border-2",
                                    checked
                                      ? "border-indigo-500"
                                      : "border-transparent",
                                    "pointer-events-none absolute -inset-px rounded-md"
                                  )}
                                  aria-hidden="true"
                                />
                              ) : (
                                <span
                                  aria-hidden="true"
                                  className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                                >
                                  <svg
                                    className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                    viewBox="0 0 100 100"
                                    preserveAspectRatio="none"
                                    stroke="currentColor"
                                  >
                                    <line
                                      x1={0}
                                      y1={100}
                                      x2={100}
                                      y2={0}
                                      vectorEffect="non-scaling-stroke"
                                    />
                                  </svg>
                                </span>
                              )}
                            </>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                  {errorMsg && (
                    <div className="mt-4">
                      <Alert severity="warning">{errorMsg}</Alert>
                    </div>
                  )}
                </div>

                <Button
                  variant="contained"
                  type="submit"
                  sx={{ padding: ".8rem 2rem", marginTop: "2rem" }}
                >
                  Add To Cart
                </Button>
              </form>
            </div>

            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
              {/* Description and details */}
              <div>
                <h3 className="sr-only">Description</h3>

                <div className="space-y-6">
                  <p className="text-base text-gray-900">
                    {customersProduct.product?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* rating and review section */}
        <section className="">
          <h1 className="font-semibold text-lg pb-4">
            Recent Review & Ratings
          </h1>

          <div className="border p-5">
            <Grid container spacing={{ xs: 4, md: 7 }}>
              <Grid item xs={12} md={7}>
                <div className="space-y-5">
                  {customersProduct.product?.reviews?.length > 0 ? (
                    customersProduct.product.reviews.map((item, i) => (
                      <ProductReviewCard key={i} item={item} />
                    ))
                  ) : (
                    <p className="opacity-60">No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              </Grid>

              <Grid item xs={12} md={5}>
                <div className="flex justify-between items-center pb-2">
                  <h1 className="text-xl font-semibold">Product Ratings</h1>
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate(`/account/rate/${productId}`)}
                  >
                    Rate Product
                  </Button>
                </div>
                <div className="flex items-center space-x-3 pb-10">
                  <Rating
                    name="read-only"
                    value={averageRating}
                    precision={0.5}
                    readOnly
                  />

                  <p className="opacity-60">{totalRatings} Ratings</p>
                </div>

              </Grid>
            </Grid>
          </div>
        </section>

        {/* similer product */}
        <section className=" pt-10">
          <h1 className="py-5 text-xl font-bold">Similar Products</h1>
          <div className="flex flex-wrap space-y-5 gap-5">
            {customersProduct.products?.content?.map((item, i) => (
              <HomeProductCard key={i} product={item} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
