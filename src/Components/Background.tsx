import React from "react";
import mainImage from "../assets/background.png"; // Adjust the path to point to your image within the src directory

const Background = () => {
  return (
    <div
      style={{
        position: "absolute", // Changed to absolute
        top: 0, // Aligns to the top of the page
        left: 0, // Aligns to the left of the page
        width: "100%",
        height: "100vh",
        zIndex: -1, // Ensures it's behind other content
      }}
    >
      <img
        src={mainImage}
        alt="Main"
        style={{
          width: "100%", // Covers the full width
          height: "100%", // Covers the full height
          objectFit: "cover", // Ensures the image covers the area without distorting aspect ratio
        }}
      />
    </div>
  );
};

export default Background;
