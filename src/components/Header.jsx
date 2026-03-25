import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import HandshakeIcon from "@mui/icons-material/Handshake";

const Header = () => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ backgroundColor: "#111827", mb: 3 }}
    >
      <Toolbar sx={{ py: 0.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(255,255,255,0.08)",
            borderRadius: "8px",
            p: 0.75,
            mr: 1.5,
          }}
        >
          <HandshakeIcon fontSize="small" sx={{ color: "#f9fafb" }} />
        </Box>
        <Box>
          <Typography
            variant="h6"
            fontWeight={700}
            lineHeight={1.15}
            color="#f9fafb"
          >
            Deal Widget
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "#9ca3af", lineHeight: 1, display: "block" }}
          >
            Zoho CRM
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
