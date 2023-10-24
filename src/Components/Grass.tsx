import React from "react";
import "../App.css";

const GrassIcon = ({ size = "24px", color = "#000", ...props }) => {
  const styles = {
    fontSize: size,
    color: color,
    fontFamily: "game-icons",
  };

  return (
    <span
      className="game-icon game-icon-grass"
      style={styles}
      {...props}
    ></span>
  );
};

export default GrassIcon;
