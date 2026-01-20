"use client";

import { createTheme, alpha } from "@mui/material/styles";

// Material Design 3 Neutral Tonal Palette
// Using a sophisticated gray scale with subtle warmth
const neutralPalette = {
  0: "#000000",
  4: "#0D0D0E",
  6: "#121213",
  10: "#1A1A1B",
  12: "#1E1E1F",
  17: "#282829",
  20: "#2F2F30",
  22: "#333334",
  24: "#373738",
  25: "#3A3A3B",
  30: "#464647",
  35: "#525253",
  40: "#5E5E5F",
  50: "#77777A",
  60: "#919194",
  70: "#ABABAE",
  80: "#C7C6C9",
  87: "#DAD9DC",
  90: "#E3E2E5",
  92: "#E9E8EB",
  94: "#EFEEF1",
  95: "#F2F1F4",
  96: "#F5F4F7",
  98: "#FAF9FC",
  99: "#FDFCFF",
  100: "#FFFFFF",
};

// MD3 Neutral Variant (with subtle blue undertone for modern feel)
const neutralVariantPalette = {
  0: "#000000",
  10: "#191C1E",
  20: "#2E3133",
  30: "#444749",
  40: "#5C5F61",
  50: "#75787A",
  60: "#8F9193",
  70: "#A9ABAD",
  80: "#C5C6C8",
  90: "#E1E2E4",
  95: "#EFF0F2",
  99: "#FBFCFE",
  100: "#FFFFFF",
};

// Primary color - Modern blue
const primaryPalette = {
  10: "#001F2A",
  20: "#003546",
  30: "#004D65",
  40: "#006686",
  50: "#0080A8",
  60: "#249BC6",
  70: "#4FB6E1",
  80: "#7AD1FC",
  90: "#C2E8FF",
  95: "#E1F3FF",
  99: "#F9FCFF",
};

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: primaryPalette[40],
      light: primaryPalette[80],
      dark: primaryPalette[30],
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: neutralVariantPalette[40],
      light: neutralVariantPalette[80],
      dark: neutralVariantPalette[30],
    },
    background: {
      default: neutralPalette[98],
      paper: neutralPalette[100],
    },
    text: {
      primary: neutralPalette[10],
      secondary: neutralPalette[40],
      disabled: neutralPalette[60],
    },
    divider: neutralPalette[90],
    action: {
      active: neutralPalette[40],
      hover: alpha(neutralPalette[10], 0.04),
      selected: alpha(neutralPalette[10], 0.08),
      disabled: neutralPalette[70],
      disabledBackground: neutralPalette[94],
    },
    grey: {
      50: neutralPalette[98],
      100: neutralPalette[96],
      200: neutralPalette[94],
      300: neutralPalette[90],
      400: neutralPalette[70],
      500: neutralPalette[50],
      600: neutralPalette[40],
      700: neutralPalette[30],
      800: neutralPalette[20],
      900: neutralPalette[10],
    },
    success: {
      main: "#1B8B4B",
      light: "#4ADE80",
      dark: "#166534",
    },
    warning: {
      main: "#D97706",
      light: "#FBBF24",
      dark: "#B45309",
    },
    error: {
      main: "#DC2626",
      light: "#F87171",
      dark: "#B91C1C",
    },
    info: {
      main: primaryPalette[40],
      light: primaryPalette[80],
      dark: primaryPalette[30],
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: "2.25rem",
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "1.875rem",
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: "-0.015em",
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.35,
      letterSpacing: "-0.005em",
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: "0.005em",
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: "0.005em",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      letterSpacing: "0.01em",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.55,
      letterSpacing: "0.01em",
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 500,
      letterSpacing: "0.02em",
      textTransform: "none" as const,
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.5,
      letterSpacing: "0.02em",
    },
    overline: {
      fontSize: "0.6875rem",
      fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase" as const,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0px 1px 2px rgba(0, 0, 0, 0.04)",
    "0px 1px 3px rgba(0, 0, 0, 0.06), 0px 1px 2px rgba(0, 0, 0, 0.04)",
    "0px 2px 4px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.04)",
    "0px 4px 6px rgba(0, 0, 0, 0.06), 0px 2px 4px rgba(0, 0, 0, 0.04)",
    "0px 6px 8px rgba(0, 0, 0, 0.06), 0px 3px 6px rgba(0, 0, 0, 0.04)",
    "0px 8px 12px rgba(0, 0, 0, 0.08), 0px 4px 8px rgba(0, 0, 0, 0.04)",
    "0px 12px 16px rgba(0, 0, 0, 0.08), 0px 6px 12px rgba(0, 0, 0, 0.04)",
    "0px 16px 24px rgba(0, 0, 0, 0.1), 0px 8px 16px rgba(0, 0, 0, 0.04)",
    "0px 20px 32px rgba(0, 0, 0, 0.1), 0px 10px 20px rgba(0, 0, 0, 0.04)",
    "0px 24px 40px rgba(0, 0, 0, 0.12), 0px 12px 24px rgba(0, 0, 0, 0.06)",
    "0px 28px 48px rgba(0, 0, 0, 0.12), 0px 14px 28px rgba(0, 0, 0, 0.06)",
    "0px 32px 56px rgba(0, 0, 0, 0.14), 0px 16px 32px rgba(0, 0, 0, 0.06)",
    "0px 36px 64px rgba(0, 0, 0, 0.14), 0px 18px 36px rgba(0, 0, 0, 0.06)",
    "0px 40px 72px rgba(0, 0, 0, 0.16), 0px 20px 40px rgba(0, 0, 0, 0.08)",
    "0px 44px 80px rgba(0, 0, 0, 0.16), 0px 22px 44px rgba(0, 0, 0, 0.08)",
    "0px 48px 88px rgba(0, 0, 0, 0.18), 0px 24px 48px rgba(0, 0, 0, 0.08)",
    "0px 52px 96px rgba(0, 0, 0, 0.18), 0px 26px 52px rgba(0, 0, 0, 0.08)",
    "0px 56px 104px rgba(0, 0, 0, 0.2), 0px 28px 56px rgba(0, 0, 0, 0.1)",
    "0px 60px 112px rgba(0, 0, 0, 0.2), 0px 30px 60px rgba(0, 0, 0, 0.1)",
    "0px 64px 120px rgba(0, 0, 0, 0.22), 0px 32px 64px rgba(0, 0, 0, 0.1)",
    "0px 68px 128px rgba(0, 0, 0, 0.22), 0px 34px 68px rgba(0, 0, 0, 0.1)",
    "0px 72px 136px rgba(0, 0, 0, 0.24), 0px 36px 72px rgba(0, 0, 0, 0.12)",
    "0px 76px 144px rgba(0, 0, 0, 0.24), 0px 38px 76px rgba(0, 0, 0, 0.12)",
    "0px 80px 152px rgba(0, 0, 0, 0.26), 0px 40px 80px rgba(0, 0, 0, 0.12)",
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: `${neutralPalette[80]} ${neutralPalette[96]}`,
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: 8,
            height: 8,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: neutralPalette[80],
            border: `2px solid ${neutralPalette[96]}`,
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: neutralPalette[70],
          },
          "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
            backgroundColor: neutralPalette[96],
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "10px 20px",
          fontWeight: 500,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.06)",
          },
        },
        contained: {
          "&:hover": {
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${primaryPalette[40]} 0%, ${primaryPalette[50]} 100%)`,
          "&:hover": {
            background: `linear-gradient(135deg, ${primaryPalette[30]} 0%, ${primaryPalette[40]} 100%)`,
          },
        },
        outlined: {
          borderColor: neutralPalette[90],
          "&:hover": {
            borderColor: neutralPalette[80],
            backgroundColor: neutralPalette[98],
          },
        },
        text: {
          "&:hover": {
            backgroundColor: neutralPalette[96],
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          "&:hover": {
            backgroundColor: neutralPalette[96],
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.06), 0px 1px 2px rgba(0, 0, 0, 0.04)",
          border: `1px solid ${neutralPalette[94]}`,
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
          "&:hover": {
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        rounded: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.06), 0px 1px 2px rgba(0, 0, 0, 0.04)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            backgroundColor: neutralPalette[100],
            transition: "box-shadow 0.2s ease",
            "& fieldset": {
              borderColor: neutralPalette[90],
              transition: "border-color 0.2s ease",
            },
            "&:hover fieldset": {
              borderColor: neutralPalette[70],
            },
            "&.Mui-focused fieldset": {
              borderColor: primaryPalette[40],
              borderWidth: 2,
            },
            "&.Mui-focused": {
              boxShadow: `0 0 0 3px ${alpha(primaryPalette[40], 0.12)}`,
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        filled: {
          backgroundColor: neutralPalette[94],
          "&:hover": {
            backgroundColor: neutralPalette[90],
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 44,
        },
        indicator: {
          height: 3,
          borderRadius: "3px 3px 0 0",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 44,
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.875rem",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: neutralPalette[90],
          color: neutralPalette[30],
          fontWeight: 500,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: neutralPalette[94],
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          "&.Mui-selected": {
            backgroundColor: neutralPalette[96],
            "&:hover": {
              backgroundColor: neutralPalette[94],
            },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: "none",
          backgroundColor: neutralPalette[99],
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: neutralPalette[100],
          color: neutralPalette[10],
          boxShadow: "none",
          borderBottom: `1px solid ${neutralPalette[94]}`,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: "0px 24px 48px rgba(0, 0, 0, 0.16)",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
          border: `1px solid ${neutralPalette[94]}`,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: "2px 6px",
          "&:hover": {
            backgroundColor: neutralPalette[96],
          },
          "&.Mui-selected": {
            backgroundColor: neutralPalette[94],
            "&:hover": {
              backgroundColor: neutralPalette[92],
            },
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: neutralPalette[20],
          borderRadius: 8,
          fontSize: "0.75rem",
          fontWeight: 500,
          padding: "8px 12px",
        },
        arrow: {
          color: neutralPalette[20],
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        standardSuccess: {
          backgroundColor: alpha("#1B8B4B", 0.08),
          color: "#166534",
        },
        standardWarning: {
          backgroundColor: alpha("#D97706", 0.08),
          color: "#B45309",
        },
        standardError: {
          backgroundColor: alpha("#DC2626", 0.08),
          color: "#B91C1C",
        },
        standardInfo: {
          backgroundColor: alpha(primaryPalette[40], 0.08),
          color: primaryPalette[30],
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 600,
          fontSize: "0.6875rem",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 44,
          height: 24,
          padding: 0,
        },
        switchBase: {
          padding: 2,
          "&.Mui-checked": {
            transform: "translateX(20px)",
            "& + .MuiSwitch-track": {
              backgroundColor: primaryPalette[40],
              opacity: 1,
            },
          },
        },
        thumb: {
          width: 20,
          height: 20,
          boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.2)",
        },
        track: {
          borderRadius: 12,
          backgroundColor: neutralPalette[80],
          opacity: 1,
        },
      },
    },
  },
});
