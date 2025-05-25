// theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: `'Inter', sans-serif`,
    h3: {
      fontFamily: `'Bebas Neue', sans-serif`,
      letterSpacing: "0.05em",
    },
    h4: {
      fontFamily: `'Bebas Neue', sans-serif`,
      letterSpacing: "0.05em",
    },
  },
  palette: {
    background: {
      default: "#f5f5f5",
    },
  },
});

export default theme;
