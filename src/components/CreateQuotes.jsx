import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/material";

const CreateQuotes = () => {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [quotesStage, setQuotesStage] = useState("");
  const [carrier, setCarrier] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [products, setProducts] = useState([]);


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
      setProducts(data.data);
    });
  };

  console.log("checking products state working", products);

  const handleClose = () => {
    setOpen(false);
    // Optionally reset form fields on close
    setSubject("");
    setQuotesStage("");
    setCarrier("");
    setProductName("");
    setQuantity("");
  };
  var recordData = {
    Deal_Name: {
      id: "6636267000030388002",
    },
    Carrier: "FedEX",
    Quote_Stage: "Draft",
    Subject: "Testing 6",
    id: "6636267000030515105",
    Product_Details: [
      {
        product: {
          name: "papaya",
          id: "6636267000030324052",
        },

        quantity: 1,
        list_price: 25,
      },
    ],
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    window.ZOHO.CRM.API.insertRecord({
      Entity: "Quotes",
      APIData: recordData,
      Trigger: [],
    }).then(function (data) {
      console.log(data.data);
      if (data.data[0].code === "SUCCESS") {
        alert("Record created successfully!");
        window.ZOHO.CRM.UI.Popup.closeReload().then(function (data) {
          console.log(data);
        });
      } else {
        alert("Failed to create record.");
      }
    });
    handleClose();
  };

  return (
    <div>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleClickOpen}
      >
        Create Quote
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Quote</DialogTitle>
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

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              {/* Quotes Stage */}
              <FormControl fullWidth variant="standard" required>
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
              <FormControl fullWidth variant="standard" required>
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
            </Box>

            {/* Products */}
            <FormControl margin="dense" fullWidth variant="standard" required>
              <InputLabel id="products">Product Name</InputLabel>
              <Select
                labelId="products"
                id="product-name"
                name="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                label="Product Name"
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.Product_Name}>
                    {product.Product_Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              required
              margin="dense"
              id="quantity"
              name="quantity"
              label="Quantity"
              type="number"
              fullWidth
              variant="standard"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
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

export default CreateQuotes;
