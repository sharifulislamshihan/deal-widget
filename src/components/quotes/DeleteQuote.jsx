import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useState } from "react";
import useSnackbar from "../../hooks/useSnackbar";

const DeleteQuote = ({ quote, getQuotes }) => {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();

  const handleDelete = async () => {
    if (!quote?.id) return;
    setDeleting(true);
    try {
      const data = await window.ZOHO.CRM.API.deleteRecord({
        Entity: "Quotes",
        RecordID: quote.id,
      });
      if (data.data[0].code === "SUCCESS") {
        showSnackbar("Quote deleted successfully");
        getQuotes();
        setOpen(false);
      } else {
        showSnackbar("Failed to delete quote", "error");
      }
    } catch {
      showSnackbar("Error deleting quote", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Tooltip title="Delete quote">
        <IconButton
          size="small"
          onClick={() => setOpen(true)}
          sx={{ color: "#6b7280", "&:hover": { bgcolor: "#f3f4f6", color: "#dc2626" } }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => !deleting && setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                bgcolor: "#fef2f2",
                color: "#ef4444",
                borderRadius: "8px",
                p: 0.75,
                display: "flex",
              }}
            >
              <WarningAmberIcon fontSize="small" />
            </Box>
            Delete Quote?
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to permanently delete{" "}
            <Typography component="span" fontWeight={600} color="text.primary">
              {quote?.Subject}
            </Typography>
            . This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            color="inherit"
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={
              deleting ? <CircularProgress size={16} color="inherit" /> : null
            }
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DeleteQuote;
