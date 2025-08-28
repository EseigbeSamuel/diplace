export const colors = {
  white: "#FFFFFF",
  "white-200": "rgba(255, 255, 255, 0.2)",
  "white-300": "rgba(255, 255, 255, 0.3)",
  black: "#1C2024",
  "slate-900": "#8B8D98",
};

export interface ColorScheme {
  background: string;
  slate: {
    100: string;
    150: string;
    200: string;
    250: string;
    300: string;
    350: string;
    400: string;
    450: string;
    500: string;
    550: string;
    600: string;
    650: string;
  };
  success: {
    100: string;
    200: string;
    300: string;
  };
  warning: {
    100: string;
    200: string;
    300: string;
  };
  error: {
    100: string;
    200: string;
    300: string;
  };
  info: {
    100: string;
    200: string;
    300: string;
  };
}

export const lightTheme: ColorScheme = {
  background: "#FCFCFC",
  slate: {
    100: "#FCFCFD",
    150: "#F9F9FB",
    200: "#F2F2F5",
    250: "#EBEBEF",
    300: "#E4E4E9",
    350: "#DDDDE3",
    400: "#D3D4DB",
    450: "#B9BBC6",
    500: "#8B8D98",
    550: "#7E808A",
    600: "#60646C",
    650: "#1C2024",
  },
  success: {
    100: "#D1FAE5",
    200: "#22C55E",
    300: "#16A34A",
  },
  warning: {
    100: "#FEF3C7",
    200: "#F59E0B",
    300: "#D97706",
  },
  error: {
    100: "#FEE2E2",
    200: "#EF4444",
    300: "#DC2626",
  },
  info: {
    100: "#DBEAFE",
    200: "#3B82F6",
    300: "#2563EB",
  },
};

export const darkTheme: ColorScheme = {
  background: "#181818",
  slate: {
    100: "#18181A",
    150: "#1B1B1F",
    200: "#27282D",
    250: "#2E3035",
    300: "#35373C",
    350: "#3C3F44",
    400: "#464B50",
    450: "#5A6165",
    500: "#696E77",
    550: "#787F85",
    600: "#ADB1B8",
    650: "#EDEEF0",
  },
  success: {
    100: "#064E3B",
    200: "#86EFAC",
    300: "#4ADE80",
  },
  warning: {
    100: "#78350F",
    200: "#FACC15",
    300: "#FDE68A",
  },
  error: {
    100: "#7F1D1D",
    200: "#F87171",
    300: "#FCA5A5",
  },
  info: {
    100: "#1E3A8A",
    200: "#93C5FD",
    300: "#60A5FA",
  },
};
