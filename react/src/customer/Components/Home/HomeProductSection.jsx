import AliceCarousel from "react-alice-carousel";
import HomeProductCard from "./HomeProductCard";
import "./HomeProductSection.css";
import { Button } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useState, useEffect } from "react";

const HomeProductSection = ({ section, data }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(2);

  // Dynamic visible items calculation based on window width
  useEffect(() => {
    const updateVisibleItems = () => {
      if (window.innerWidth >= 1024) {
        setVisibleItems(5);
      } else if (window.innerWidth >= 568) {
        setVisibleItems(3);
      } else {
        setVisibleItems(2);
      }
    };
    
    updateVisibleItems(); // run initially
    window.addEventListener("resize", updateVisibleItems);
    return () => window.removeEventListener("resize", updateVisibleItems);
  }, []);

  const slidePrev = () => setActiveIndex(activeIndex - 1);
  const slideNext = () => setActiveIndex(activeIndex + 1);
  const syncActiveIndex = ({ item }) => setActiveIndex(item);

  const responsive = {
    0: {
      items: 2,
      itemsFit: "contain",
    },
    568: {
      items: 3,
      itemsFit: "contain",
    },
    1024: {
      items: 5.5,
      itemsFit: "contain",
    },
  };

  const items = (data || []).slice(0, 10).map((item) => (
    <div key={item.id} className="">
      <HomeProductCard product={item} />
    </div>
  ));

  return (
    <div className="relative px-2 sm:px-6 lg:px-8">
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 py-3 sm:py-5">
        {section}
      </h2>
      <div className="relative border p-3 sm:p-5 rounded-md bg-white">
        <AliceCarousel
          disableButtonsControls
          disableDotsControls
          mouseTracking
          items={items}
          activeIndex={activeIndex}
          responsive={responsive}
          onSlideChanged={syncActiveIndex}
          animationType="fadeout"
          animationDuration={2000}
        />
        
        {/* Next Button */}
        {items.length > 0 && activeIndex < items.length - visibleItems && (
          <Button
            onClick={slideNext}
            variant="contained"
            className="z-40"
            sx={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              right: { xs: "4px", sm: "-15px" },
              bgcolor: "#9155FD",
              color: "white",
              "&.MuiButton-root": { bgcolor: "#9155FD" }, // enforce primary color override
              "&:hover": { bgcolor: "#7a3beb" },
              minWidth: "0rem",
              width: { xs: "2rem", sm: "2.2rem" },
              height: { xs: "3rem", sm: "4rem" },
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
              padding: 0
            }}
            aria-label="next"
          >
            <ArrowForwardIosIcon
              sx={{ color: "white", fontSize: { xs: "0.8rem", sm: "1.1rem" } }}
            />
          </Button>
        )}

        {/* Prev Button */}
        {activeIndex !== 0 && (
          <Button
            onClick={slidePrev}
            variant="contained"
            className="z-40"
            sx={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: { xs: "4px", sm: "-15px" },
              bgcolor: "#9155FD",
              color: "white",
              "&.MuiButton-root": { bgcolor: "#9155FD" }, // enforce primary color override
              "&:hover": { bgcolor: "#7a3beb" },
              minWidth: "0rem",
              width: { xs: "2rem", sm: "2.2rem" },
              height: { xs: "3rem", sm: "4rem" },
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
              padding: 0
            }}
            aria-label="prev"
          >
            <ArrowBackIosIcon
              sx={{ 
                color: "white", 
                fontSize: { xs: "0.8rem", sm: "1.1rem" },
                ml: { xs: "4px", sm: "6px" } // centering correction for back chevron
              }}
            />
          </Button>
        )}
      </div>
    </div>
  );
};

export default HomeProductSection;
