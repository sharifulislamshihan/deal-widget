import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#111827",
      light: "#374151",
      dark: "#030712",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#6b7280",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f9fafb",
      paper: "#ffffff",
    },
    text: {
      primary: "#111827",
      secondary: "#6b7280",
    },
    success: { main: "#16a34a", contrastText: "#fff" },
    warning: { main: "#d97706", contrastText: "#fff" },
    error:   { main: "#dc2626", contrastText: "#fff" },
    info:    { main: "#2563eb", contrastText: "#fff" },
    divider: "#e5e7eb",
  },
  shape: { borderRadius: 8 },
  typography: {
    h6:        { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    button:    { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: "#f9fafb" } },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "20px 24px",
          "&:last-child": { paddingBottom: "20px" },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, paddingTop: 7, paddingBottom: 7 },
        contained: {
          boxShadow: "none",
          "&:hover": { boxShadow: "none", backgroundColor: "#374151" },
        },
        outlined: {
          borderColor: "#e5e7eb",
          color: "#374151",
          "&:hover": { borderColor: "#9ca3af", backgroundColor: "#f9fafb" },
        },
      },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 14 } },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: "20px 24px 12px",
          fontWeight: 700,
          fontSize: "1rem",
          color: "#111827",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: { root: { padding: "8px 24px 8px" } },
    },
    MuiDialogActions: {
      styleOverrides: { root: { padding: "12px 24px 20px", gap: 8 } },
    },
    MuiTextField: { defaultProps: { size: "small" } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#9ca3af",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#111827",
            borderWidth: 1.5,
          },
        },
        notchedOutline: { borderColor: "#e5e7eb" },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#6b7280",
          "&.Mui-focused": { color: "#111827" },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 600, fontSize: "0.72rem" },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            backgroundColor: "#111827",
            color: "#f9fafb",
            fontWeight: 600,
            fontSize: "0.75rem",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            borderBottom: "none",
            padding: "12px 16px",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: "1px solid #f3f4f6", padding: "10px 16px" },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(even)": { backgroundColor: "#fafafa" },
          "&:hover": { backgroundColor: "#f3f4f6 !important" },
          "&:last-child td": { border: 0 },
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { borderRadius: 12 } },
    },
    MuiAppBar: {
      styleOverrides: { root: { borderRadius: 12 } },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: "#f3f4f6" } },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: { borderTop: "1px solid #f3f4f6", color: "#6b7280" },
        selectLabel: { color: "#6b7280" },
        displayedRows: { color: "#6b7280" },
      },
    },
    MuiIconButton: {
      styleOverrides: { root: { borderRadius: 8 } },
    },
  },
});

export default theme;
