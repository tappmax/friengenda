import { createMuiTheme } from "@material-ui/core";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";
import { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";

export const variables = {
  brandColors: {
    frenOrange: "#f28a29",
    frenPrimary: "#f28a29",
    frenDkOrange: "#e57b1d",
    frenLtOrange: "#f5b273",
    frenBlue: "#456fb5",
    frenSecondary: "#456fb5",
    frenSecondaryMuted: "rgba(41,44,56, 0.2)",
    frenDkBlue: "#292C38",
    frenLtBlue: "#618fdd",
    frenGreen: "#81d742",
    frenDkGreen: "#80ce40"
  },
  solidColors: {
    // solid colors
    dkOrange: "#f57423",
    dkRed: "#e64839",
    mdRed: "#ff574f",
    dkBlue: "#004b87",
    dkGray: "#3e3e3e",
    ltGray: "rgb(179, 179, 179)",
    highlighterYellow: "rgb(250, 237, 39)",
    extraLtGray: "rgb(237, 237, 237)",
    offWhite: "rgb(229, 229, 229)",
    white: "#fff"
  },
  alphaColors: {
    // alpha colors
    frenPrimary80: "rgba(242, 138, 41, 80)",
    frenPrimary50: "rgba(242, 137, 38, 0.5)",
    frenSecondary50: "rgba(69, 111, 181, 0.5)",
    frenSecondary80: "rgba(69, 111, 181, 0.8)",
    frenGreen50: "rgba(129, 215, 66, 0.5)",
    frenGreen20: "rgba(129, 215, 66, 0.2)",
    frenGreen10: "rgba(129, 215, 66, 0.1)",
    highlighterYellow45: "rgba(250, 237, 39, 0.45)",
    mdRed50: "rgba(255,87,79, 0.1)",
    white80: "rgba(255, 255, 255, 0.8)",
    white50: "rgba(255, 255, 255, 0.5)",
    white10: "rgba(255, 255, 255, 0.1)",
    black10: "rgba(0, 0, 0, 0.1)",
    gray30: "rgba(255, 255, 255, 0.3)",
    gray50: "rgba(255, 255, 255, 0.5)",
    dkGray20: "rgba(25, 25, 25, 0.2)",
    black30: "rgba(0, 0, 0, 0.3)"
  },
  typography: {
    // typography
    frenDefaultTypeface: "'Open Sans', 'sans-serif'",
    frenDefaultTextColor: "#4c4c4c",
    frenHeadingColor: "#222222",
    frenHeadingWeight: 700,
    frenTextBlue: "#2ea3f2",
    defaultFontWeight: 400,
    headingFontSize: 24,
    defaultFontSize: 13,
    tableTextColor: "rgb(25, 25, 25)"
  },
  dimensions: {
    // dimensions
    maxWidth: 1234,
    sidebarWidth: 225,
    drawerWidth: 240,
    topHeight: 96,
    minPaperHeight: 600,
    listRowHeight: 34
  },
  common: {
    // common
    tableRadius: 4,
    boxBorderRadius: 24
  },
  transitions: {
    // transitions
    shortFade: "0.15s easeOut"
  },
  loader : {
    wait: 250
  }
};

export const theme = createMuiTheme({
  palette: {
    background: {
      default: variables.brandColors.frenDkBlue
    },
    primary: {
      main: variables.brandColors.frenPrimary,
      contrastText: variables.solidColors.white,
      dark: variables.brandColors.frenDkOrange,
      light: variables.brandColors.frenLtOrange
    },
    secondary: {
      contrastText: variables.solidColors.white,
      main: variables.brandColors.frenSecondary,
      dark: variables.brandColors.frenDkBlue,
      light: variables.brandColors.frenLtBlue
    }
  } as PaletteOptions
} as ThemeOptions);
