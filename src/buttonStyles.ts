// Define the style constant
export const buttonStyle = {
  my: 1,
  borderRadius: 12,
  border: "1px solid white",
  backgroundColor: "#090924",
  disabledBackground: "#090924",
  color: "white",
  width: "100%",
  "&:hover": {
    backgroundColor: "#1C1C3A", // Darker shade for hover
    color: "#E0E0E0", // Lighter shade for the text during hover
  },
  "&:disabled": {
    backgroundColor: "#3C3C4D", // or any other suitable shade you prefer
    color: "#black", // or any other suitable shade for text
    cursor: "not-allowed",
  },
};

export const redButtonStyle = {
  my: 1,
  borderRadius: 12,
  border: "1px solid white",
  backgroundColor: "#240000",
  color: "white",
  "&:hover": {
    backgroundColor: "#3E0000", // Darker red shade for hover
    color: "#FFFFFF", // You might keep the text color white or change it if needed
  },
};
