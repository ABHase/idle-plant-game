import React from "react";
import mainImage from "../assets/main.png"; // Adjust the path to point to your image within the src directory

const Splash = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={mainImage}
        alt="Main"
        style={{
          maxWidth: "100%", // Ensures the image doesn't exceed the width of its container
          height: "auto", // Keeps the aspect ratio of the image
        }}
      />
    </div>
  );
};

export default Splash;
