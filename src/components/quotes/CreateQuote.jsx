import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import useQuoteOptions from "../../hooks/useQuoteOptions";
import useSnackbar from "../../hooks/useSnackbar";

const CreateQuote = ({ recordId, getQuotes }) => {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [quotesStage, setQuotesStage] = useState("");
  const [carrier, setCarrier] = useState("");
  const [products, setProducts] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { stageOptions, carrierOptions, loadingOptions, fetchOptions } =
    useQuoteOptions();
  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();

  const handleOpen = () => {
    setOpen(true);
    fetchOptions();
    setLoadingProducts(true);
    window.ZOHO.CRM.API.getAllRecords({
      Entity: "Products",
      sort_order: "asc",
    }).then((data) => {
      setProductsData(data.data);
      setLoadingProducts(false);
    });
  };

  const handleClose = () => {
    setOpen(false);
    setSubject("");
    setQuotesStage("");
    setCarrier("");
    setProducts([]);
  };

  const handleAddProduct = () =>
    setProducts((prev) => [
      ...prev,
      { id: Date.now(), productId: "", quantity: 1 },
    ]);

  const handleProductChange = (id, field, value) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );

  const handleRemoveProduct = (id) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const recordData = {
      Deal_Name: { id: recordId },
      Carrier: carrier,
      Quote_Stage: quotesStage,
      Subject: subject,
      Product_Details: products.map((p) => ({
        product: { id: p.productId },
        quantity: p.quantity,
      })),
    };

    try {
      const data = await window.ZOHO.CRM.API.insertRecord({
        Entity: "Quotes",
        APIData: recordData,
        Trigger: [],
      });
      if (data.data[0].code === "SUCCESS") {
        showSnackbar("Quote created successfully");
        getQuotes();
        handleClose();
      } else {
        showSnackbar("Failed to create quote", "error");
      }
    } catch {
      showSnackbar("Error creating quote", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleOpen}
        size="small"
        sx={{ px: 2 }}
      >
        Create Quote
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Quote</DialogTitle>

        <DialogContent>
          <form onSubmit={handleSubmit} id="create-quote-form">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 0.5 }}>
              <TextField
                required
                autoFocus
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                fullWidth
              />

              <Stack direction="row" spacing={2}>
                <FormControl size="small" fullWidth required>
                  <InputLabel>Quote Stage</InputLabel>
                  <Select
                    value={quotesStage}
                    label="Quote Stage"
                    onChange={(e) => setQuotesStage(e.target.value)}
                    disabled={loadingOptions}
                  >
                    {stageOptions.map((s) => (
                      <MenuItem key={s.id} value={s.display_value}>
                        {s.display_value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth required>
                  <InputLabel>Carrier</InputLabel>
                  <Select
                    value={carrier}
                    label="Carrier"
                    onChange={(e) => setCarrier(e.target.value)}
                    disabled={loadingOptions}
                  >
                    {carrierOptions.map((c) => (
                      <MenuItem key={c.id} value={c.display_value}>
                        {c.display_value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              <Divider />

              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1.5,
                  }}
                >
                  <Typography variant="subtitle2">
                    Products{" "}
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                    >
                      ({products.length})
                    </Typography>
                  </Typography>
                  <Tooltip title="Add product">
                    <IconButton
                      onClick={handleAddProduct}
                      size="small"
                      sx={{ bgcolor: "#f3f4f6", color: "#374151" }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                {products.length === 0 && (
                  <Typography
                    variant="body2"
                    color="text.disabled"
                    sx={{ textAlign: "center", py: 1.5 }}
                  >
                    No products added yet
                  </Typography>
                )}

                {products.map((product, idx) => (
                  <Stack
                    key={product.id}
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ minWidth: 20 }}
                    >
                      {idx + 1}.
                    </Typography>
                    <FormControl size="small" fullWidth required>
                      <InputLabel>Product</InputLabel>
                      <Select
                        value={product.productId}
                        label="Product"
                        onChange={(e) =>
                          handleProductChange(product.id, "productId", e.target.value)
                        }
                        disabled={loadingProducts}
                      >
                        {productsData.map((p) => (
                          <MenuItem key={p.id} value={p.id}>
                            {p.Product_Name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      required
                      label="Qty"
                      type="number"
                      value={product.quantity}
                      onChange={(e) =>
                        handleProductChange(
                          product.id,
                          "quantity",
                          Number(e.target.value),
                        )
                      }
                      size="small"
                      sx={{ width: 80 }}
                      inputProps={{ min: 1 }}
                    />
                    <Tooltip title="Remove">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleRemoveProduct(product.id)}
                        sx={{ "&:hover": { bgcolor: "#fef2f2" } }}
                      >
                        <RemoveCircleOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                ))}
              </Box>
            </Box>
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-quote-form"
            variant="contained"
            disabled={submitting}
            startIcon={
              submitting ? <CircularProgress size={16} color="inherit" /> : null
            }
          >
            {submitting ? "Creating..." : "Create Quote"}
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

export default CreateQuote;
