import React, { useEffect } from "react";
import HomeCarousel from "../customer/Components/Carousel/HomeCarousel";
import { homeCarouselData } from "../customer/Components/Carousel/HomeCaroselData";
import HomeProductSection from "../customer/Components/Home/HomeProductSection";
import { useDispatch, useSelector } from "react-redux";
import { findProducts } from "../Redux/Customers/Product/Action";

const Homepage = () => {
  const dispatch = useDispatch();
  const { customersProduct } = useSelector((store) => store);

  useEffect(() => {
    const categoryToLavelOne = {
      mens_kurta: "men",
      shoes: "men",
      lengha_choli: "women",
      saree: "women",
      women_dress: "women",
      kurtas: "women",
    };

    const categories = ["mens_kurta", "shoes", "lengha_choli", "saree", "women_dress", "kurtas"];

    categories.forEach((category) => {
      dispatch(
        findProducts({
          category,
          colors: [],
          sizes: [],
          minPrice: 0,
          maxPrice: 10000,
          minDiscount: 0,
          sort: "price_low",
          pageNumber: 0,
          pageSize: 10,
          stock: "",
          lavelOne: categoryToLavelOne[category] || "",
        })
      );
    });
  }, [dispatch]);

  return (
    <div className="">
      <HomeCarousel images={homeCarouselData} />

      <div className="space-y-6 sm:space-y-10 py-10 sm:py-16 lg:py-20">
        {customersProduct.categoryProducts?.mens_kurta?.length > 0 && (
          <HomeProductSection data={customersProduct.categoryProducts?.mens_kurta} section={"Men's Kurta"} />
        )}

        {customersProduct.categoryProducts?.shoes?.length > 0 && (
          <HomeProductSection data={customersProduct.categoryProducts?.shoes} section={"Men's Shoes"} />
        )}

        {customersProduct.categoryProducts?.lengha_choli?.length > 0 && (
          <HomeProductSection data={customersProduct.categoryProducts?.lengha_choli} section={"Lengha Choli"} />
        )}

        {customersProduct.categoryProducts?.saree?.length > 0 && (
          <HomeProductSection data={customersProduct.categoryProducts?.saree} section={"Saree"} />
        )}

        {customersProduct.categoryProducts?.women_dress?.length > 0 && (
          <HomeProductSection data={customersProduct.categoryProducts?.women_dress} section={"Women's Dresses"} />
        )}

        {customersProduct.categoryProducts?.kurtas?.length > 0 && (
          <HomeProductSection data={customersProduct.categoryProducts?.kurtas} section={"Women's Kurtas"} />
        )}
      </div>
    </div>
  );
};

export default Homepage;
