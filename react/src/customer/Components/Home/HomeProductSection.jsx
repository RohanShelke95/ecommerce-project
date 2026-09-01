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
              right: { xs: "2px", sm: "-18px" },
              bgcolor: "white",
              color: "#4f46e5",
              border: "1.5px solid #e0e0e0",
              "&.MuiButton-root": { bgcolor: "white" },
              "&:hover": {
                bgcolor: "#4f46e5",
                color: "white",
                borderColor: "#4f46e5",
                "& .MuiSvgIcon-root": { color: "white" },
              },
              minWidth: "0px",
              width: { xs: "2rem", sm: "2.4rem" },
              height: { xs: "3.2rem", sm: "4.2rem" },
              borderRadius: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(79,70,229,0.18)",
              padding: 0,
              transition: "all 0.22s ease",
            }}
            aria-label="next"
          >
            <ArrowForwardIosIcon
              sx={{ color: "#4f46e5", fontSize: { xs: "0.8rem", sm: "1rem" } }}
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
              left: { xs: "2px", sm: "-18px" },
              bgcolor: "white",
              color: "#4f46e5",
              border: "1.5px solid #e0e0e0",
              "&.MuiButton-root": { bgcolor: "white" },
              "&:hover": {
                bgcolor: "#4f46e5",
                color: "white",
                borderColor: "#4f46e5",
                "& .MuiSvgIcon-root": { color: "white" },
              },
              minWidth: "0px",
              width: { xs: "2rem", sm: "2.4rem" },
              height: { xs: "3.2rem", sm: "4.2rem" },
              borderRadius: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(79,70,229,0.18)",
              padding: 0,
              transition: "all 0.22s ease",
            }}
            aria-label="prev"
          >
            <ArrowBackIosIcon
              sx={{
                color: "#4f46e5",
                fontSize: { xs: "0.8rem", sm: "1rem" },
                ml: { xs: "4px", sm: "5px" },
              }}
            />
          </Button>
        )}
      </div>
    </div>
  );
};

export default HomeProductSection;
