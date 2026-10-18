import React, { useEffect } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { homeCarouselData } from "./HomeCaroselData";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getImageUrl } from "../../../utils/getImageUrl";
import { prefetchCategoryProducts } from "../../../Redux/Customers/Product/Action";

const handleDragStart = (e) => e.preventDefault();

const HomeCarousel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Helper to extract category & level from path (e.g. /women/clothing/saree)
  const extractCategoryInfo = (path) => {
    if (!path) return { category: "", lavelOne: "" };
    const segments = path.replace(/^\/+/, "").split("/");
    return {
      lavelOne: segments[0] || "",
      category: segments[segments.length - 1] || "",
    };
  };

  // Pre-warm all carousel category destinations so clicking any banner is instant
  useEffect(() => {
    homeCarouselData.forEach((item) => {
      const { category, lavelOne } = extractCategoryInfo(item.path);
      if (category) {
        dispatch(prefetchCategoryProducts(category, lavelOne));
      }
    });
  }, [dispatch]);

  const handleBannerHover = (path) => {
    const { category, lavelOne } = extractCategoryInfo(path);
    if (category) {
      dispatch(prefetchCategoryProducts(category, lavelOne));
    }
  };

  const item = homeCarouselData.map((item, index) => (
    <img
      key={index}
      className="cursor-pointer rounded-md w-full object-cover"
      onClick={() => navigate(item.path)}
      onMouseEnter={() => handleBannerHover(item.path)}
      onTouchStart={() => handleBannerHover(item.path)}
      src={getImageUrl(item.image)}
      alt="Festive Banner"
      onDragStart={handleDragStart}
      role="presentation"
      referrerPolicy="no-referrer"
      loading="eager"
    />
  ));

  return (
    <AliceCarousel
      mouseTracking
      items={item}
      autoPlay
      infinite
      autoPlayInterval={3000}
      disableButtonsControls
    />
  );
};

export default HomeCarousel;
