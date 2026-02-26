import { Button, IconButton } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Box, Stack } from "@mui/material";
const EditQuotes = ({ editQuoteId, onClick, quote }) => {
  //console.log("Quotes", quote?.Subject);

  // console.log("Checking id in edit quotes components", editQuoteId);
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState(quote?.Subject || "");
  const [quotesStage, setQuotesStage] = useState(quote?.Quote_Stage || "");
  const [carrier, setCarrier] = useState(quote?.Carrier || "");
  const [products, setProducts] = useState(quote?.Product_Details || []);
  const [productsData, setProductsData] = useState([]);

  //console.log("Checking products", products);
  const quotesStages = [
    "Draft",
    "Negotiation/Review",
    "Delivered",
    "On Hold",
    "Confirmed",
    "Closed Won",
    "Closed Lost",
  ];
  const carriers = ["FedEX", "UPS", "USPS", "DHL"];

  const handleClickOpen = () => {
    setOpen(true);
    window.ZOHO.CRM.API.getAllRecords({
      Entity: "Products",
      sort_order: "asc",
    }).then(function (data) {
      console.log("Product records:", data.data);
      setProductsData(data.data);
    });
  };

  const handleAddProduct = () => {
    setProducts((prevProducts) => [
      ...prevProducts,
      { id: Date.now(), productId: "", quantity: 1 },
    ]);
  };

  const handleProductChange = (id, field, value) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === id) {
          return { ...product, [field]: value };
        }
        return product;
      }),
    );
  };

  const handleRemoveProduct = (id) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id),
    );
  };

  console.log("checking products state working", products.length);

  const handleClose = () => {
    setOpen(false);
    // Optionally reset form fields on close
    setSubject("");
    setQuotesStage("");
    setCarrier("");
  };

  //   var recordData = {
  //     Deal_Name: {
  //       id: recordId,
  //     },
  //     Carrier: carrier,
  //     Quote_Stage: quotesStage,
  //     Subject: subject,
  //     Product_Details: [],
  //   };

  //   products.forEach((prod, index) => {
  //     recordData.Product_Details[index] = {
  //       product: {
  //         id: prod.productId,
  //       },
  //       quantity: prod.quantity,
  //     };
  //   });

  //console.log("Final record data to submit:", recordData);

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log("Checking submission", subject, quotesStage, carrier, products);

    // window.ZOHO.CRM.API.insertRecord({
    //   Entity: "Quotes",
    //   APIData: recordData,
    //   Trigger: [],
    // }).then(function (data) {
    //   console.log(data.data);
    //   if (data.data[0].code === "SUCCESS") {
    //     alert("Record created successfully!");
    //   } else {
    //     alert("Failed to create record.");
    //   }
    // });
    handleClose();
  };

  return (
    <div>
      <IconButton
        color="primary"
        size="small"
        onClick={() => {
          onClick(editQuoteId);
          handleClickOpen();
        }}
      >
        <EditIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            fontWeight: "bold",
          }}
        >
          Edit Quote
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} id="quote-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="subject"
              name="subject"
              label="Subject"
              type="text"
              fullWidth
              variant="standard"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            {/* Quotes Stage */}
            <FormControl fullWidth margin="dense" variant="standard" required>
              <InputLabel id="quotes-stage-label">Quotes Stage</InputLabel>
              <Select
                labelId="quotes-stage-label"
                id="quotes-stage"
                name="quotesStage"
                value={quotesStage}
                onChange={(e) => setQuotesStage(e.target.value)}
                label="Quotes Stage"
              >
                {quotesStages.map((stage) => (
                  <MenuItem key={stage} value={stage}>
                    {stage}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Carrier */}
            <FormControl fullWidth margin="dense" variant="standard" required>
              <InputLabel id="carrier-label">Carrier</InputLabel>
              <Select
                labelId="carrier-label"
                id="carrier"
                name="carrier"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                label="Carrier"
              >
                {carriers.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mt: 3, mb: 2 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <DialogTitle sx={{ p: 0 }}>Products</DialogTitle>
                <IconButton
                  color="primary"
                  onClick={handleAddProduct}
                  aria-label="Add product"
                >
                  <AddIcon />
                </IconButton>
              </Stack>

              {products.map(
                (product) => (
                  console.log("checking for poe", product),
                  (
                    <Stack
                      key={product.id}
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <FormControl fullWidth required>
                        <InputLabel id={`product-select-label-${product.id}`}>
                          Product Name
                        </InputLabel>
                        <Select
                          labelId={`product-select-label-${product.id}`}
                          value={product.productId}
                          label="Product Name"
                          onChange={(e) =>
                            handleProductChange(
                              product.id,
                              "productId",
                              e.target.value,
                            )
                          }
                        >
                          {productsData.map((prod) => (
                            console.log("prod", prod),
                            
                            <MenuItem key={prod.id} value={prod.id}>
                              {prod.Product_Name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        required
                        label="Quantity"
                        type="number"
                        value={product.quantity}
                        onChange={(e) =>
                          handleProductChange(
                            product.id,
                            "quantity",
                            Number(e.target.value),
                          )
                        }
                        inputProps={{ min: 1 }}
                        sx={{ width: 120 }}
                      />
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveProduct(product.id)}
                        aria-label="Remove product"
                        disabled={products.length === 1}
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    </Stack>
                  )
                ),
              )}
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="quote-form">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditQuotes;
