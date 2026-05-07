// Re-export shared design primitives. Tokens are CSS-only at the moment;
// see ./styles/tokens.css for variables. Component primitives ported from
// apps/driver-prototype/ get added here as they're extracted.

export const tokens = {
  brand: {
    50: "#EAF1FF",
    100: "#D2E0FF",
    500: "#3777FF",
    600: "#2C5FD9",
    700: "#1E47A6",
    900: "#0A1A3F",
  },
  status: {
    success: "#1F9A41",
    warning: "#C76C04",
    error: "#DA2A20",
  },
} as const;
