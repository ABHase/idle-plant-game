import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#81b85c", // A more vibrant forest green for buttons and highlights
    },
    secondary: {
      main: "#0a0d08", // Bluish-grey, reminiscent of a night sky or moonlit water
    },
    background: {
      default: "#1f1107", // A very dark brown, almost black, like deep woods at night
      paper: "#162e13", // A slightly lighter green, like forest undergrowth in moonlight
    },
    text: {
      primary: "#FFFFFF", // Pure white for text to ensure good contrast against the dark background
      secondary: "#B0BEC5", // A lighter grey, used for secondary text elements
    },
  },
  typography: {
    fontFamily: "'YOUR_FONT_NAME', lato", // Remember to replace 'YOUR_FONT_NAME'
  },
  // Add any other theme customizations here
});
