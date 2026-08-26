import React, { useEffect } from "react";
import HomeCarousel from "../customer/Components/Carousel/HomeCarousel";
import { homeCarouselData } from "../customer/Components/Carousel/HomeCaroselData";
import HomeProductSection from "../customer/Components/Home/HomeProductSection";
import { useDispatch, useSelector } from "react-redux";
import { findProducts } from "../Redux/Customers/Product/Action";

// Static datasets for instant 0-millisecond initial page rendering
import { kurtaPage1 } from "../Data/Kurta/kurta";
import { mensShoesPage1 } from "../Data/shoes";
import { sareePage1 } from "../Data/Saree/page1";
import { lehngacholiPage2 } from "../Data/Saree/lenghaCholiPage2";
import women_dress from "../Data/Women/women_dress.json";
import { gounsPage1 } from "../Data/Gouns/gouns";

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

  // Instant data fallback: display local dataset immediately so page loads in 0ms, then update with live DB data
  const mensKurtaData =
    customersProduct.categoryProducts?.mens_kurta?.length > 0
      ? customersProduct.categoryProducts?.mens_kurta
      : kurtaPage1;

  const shoesData =
    customersProduct.categoryProducts?.shoes?.length > 0
      ? customersProduct.categoryProducts?.shoes
      : mensShoesPage1;

  const lenghaData =
    customersProduct.categoryProducts?.lengha_choli?.length > 0
      ? customersProduct.categoryProducts?.lengha_choli
      : lehngacholiPage2;

  const sareeData =
    customersProduct.categoryProducts?.saree?.length > 0
      ? customersProduct.categoryProducts?.saree
      : sareePage1;

  const womenDressData =
    customersProduct.categoryProducts?.women_dress?.length > 0
      ? customersProduct.categoryProducts?.women_dress
      : women_dress;

  const kurtasData =
    customersProduct.categoryProducts?.kurtas?.length > 0
      ? customersProduct.categoryProducts?.kurtas
      : gounsPage1;

  return (
    <div className="">
      <HomeCarousel images={homeCarouselData} />

      <div className="space-y-6 sm:space-y-10 py-10 sm:py-16 lg:py-20">
        <HomeProductSection data={mensKurtaData} section={"Men's Kurta"} />
        <HomeProductSection data={shoesData} section={"Men's Shoes"} />
        <HomeProductSection data={lenghaData} section={"Lengha Choli"} />
        <HomeProductSection data={sareeData} section={"Saree"} />
        <HomeProductSection data={womenDressData} section={"Women's Dresses"} />
        <HomeProductSection data={kurtasData} section={"Women's Kurtas"} />
      </div>
    </div>
  );
};

export default Homepage;
