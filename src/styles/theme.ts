import { inter } from "@/pages/_app";
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#FFFFFF",
      100: "#FFFFFF",
      200: "#FFFFFF",
      300: "#FFFFFF",
      400: "#DEFFEE",
      // 500: "#B5FFD9",
      500: "#000000",
      600: "#7DFFBC",
      700: "#45FF9F",
      800: "#0DFF83",
      900: "#00D467",
    },
    beige: {
      50: "#D7D5D4",
      100: "#CDCACA",
      200: "#B9B6B5",
      300: "#A5A1A0",
      400: "#918D8B",
      500: "#7D7876",
      600: "#605C5B",
      700: "#434140",
      800: "#262524",
      900: "#0A0909",
    },
  },
  styles: {
    global: {
      body: {
        bg: "#FFFFFF",
      },
    },
  },
  fonts: {
    heading: `'${inter.style.fontFamily}', sans-serif`,
    body: `'${inter.style.fontFamily}', sans-serif`,
  },
  components: {
    Button: {
      variants: {
        brand: {
          transition: "all 0.2s",
          bg: "#FF6534",
          color: "#FFFFFF",
          shadow: "lg",
          borderWidth: "1px",
          borderRadius:"10px",
          borderColor: "FF6534",
          _hover: {
            shadow: "md",
          },
        },
      },
    },
    Link: {
      variants: {
        brand: {
          transition: "all 0.2s",
          bg: "brand.500",
          color: "blackAlpha.700",
          shadow: "lg",
          borderWidth: "1px",
          borderColor: "blackAlpha.100",
          _hover: {
            shadow: "md",
          },
        },
      },
    },
  },
});

export default theme;
