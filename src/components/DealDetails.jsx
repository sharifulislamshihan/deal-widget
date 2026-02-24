import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RelatedQuotes from "./RelatedQuotes";

const DealDetails = ({ moduleName, recordId }) => {
  const [dealName, setDealName] = useState("");
  const [contactName, setContactName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [Amount, setAmount] = useState("");
  console.log(moduleName);
  console.log(recordId);

  useEffect(() => {
    if (moduleName && recordId) {
      window.ZOHO.CRM.API.getRecord({
        Entity: moduleName,
        RecordID: recordId,
      }).then(function (recordData) {
        console.log(recordData.data[0]);

        setDealName(recordData.data[0]?.Deal_Name);
        setContactName(recordData.data[0]?.Contact_Name?.name);
        setAccountName(recordData.data[0]?.Account_Name?.name);
        setAmount(recordData.data[0]?.Amount);
      });
    }
  }, [moduleName, recordId]);

  return (
    <div>
      <h3>Deal Details</h3>
      <Box
        sx={{
          mb: 2,
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)", // Create 2 equal columns
          gap: 2, // Spacing between boxes
        }}
      >
        <TextField
          value={dealName}
          onChange={(e) => setDealName(e.target.value)}
          label="Deal Name"
          type="text"
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <TextField
          label="Contact Name"
          type="text"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <TextField
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          label="Account Name"
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <TextField
          id="Amount"
          value={Amount}
          onChange={(e) => setAmount(e.target.value)}
          label="Total amount of Deals"
          type="text"
          variant="outlined"
          sx={{ mb: 2 }}
        />
      </Box>

      <RelatedQuotes moduleName={moduleName} recordId={recordId} />
    </div>
  );
};

export default DealDetails;
