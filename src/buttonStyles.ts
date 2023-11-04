// Define the style constant
export const buttonStyle = {
  my: 1,
  borderRadius: 12,
  border: "1px solid white",
  backgroundColor: "#090924",
  disabledBackground: "#090924",
  color: "white",
  width: "100%",
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
};
