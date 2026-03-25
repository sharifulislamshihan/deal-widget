import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import RelatedQuotes from "./RelatedQuotes";
import DataTransaction from "./DataTransaction";

const DealDetails = ({ moduleName, recordId }) => {
  console.log(moduleName);
  console.log(recordId);

  const [isLoading, setIsLoading] = useState(false);
  const [dealName, setDealName] = useState("");
  const [dealId, setDealId] = useState("");
  const [contactName, setContactName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [Amount, setAmount] = useState("");
  const [relatedQuotes, setRelatedQuotes] = useState({ data: [] });
  const [dataTransaction, setDataTransaction] = useState([]);

  const getQuotes = async () => {
    if (!moduleName || !recordId) return;

    const quotes = await window.ZOHO.CRM.API.getRelatedRecords({
      Entity: moduleName,
      RecordID: recordId,
      RelatedList: "Quotes",
    }).catch(() => {
      console.error("Error in get related records");
    });
    //console.log("Quotes checking", quotes);

    setRelatedQuotes(quotes);
  };

  useEffect(() => {
    if (moduleName && recordId) {
      window.ZOHO.CRM.API.getRecord({
        Entity: moduleName,
        RecordID: recordId,
      }).then(function (recordData) {
        console.log("Sub form", recordData.data[0]);

        setDealName(recordData.data[0]?.Deal_Name);
        setDealId(recordData.data[0]?.id);
        setContactName(recordData.data[0]?.Contact_Name?.name);
        setAccountName(recordData.data[0]?.Account_Name?.name);
        setAmount(recordData.data[0]?.Amount);
        setDataTransaction(recordData.data[0].Subform_1);
      });

      getQuotes();
    }
  }, [moduleName, recordId]);

  console.log("Data", dataTransaction);

  const handleDealSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    var configDeal = {
      Entity: "Deals",
      APIData: {
        id: dealId,
        Deal_Name: dealName,
        Amount: Amount,
      },
      Trigger: [],
    };

    await window.ZOHO.CRM.API.updateRecord(configDeal).then(
      function (dealData) {
        // console.log(dealData?.data[0]?.code);
        if (dealData?.data[0]?.code === "SUCCESS") {
          alert("Deal updated successfully");
        } else {
          alert("Error in updating deal");
        }
      },
    );

    handleClose();
  };

  const handleClose = () => {
    window.ZOHO.CRM.UI.Popup.closeReload().then(function (data) {
      console.log(data);
    });
  };

  return (
    <div>
      <h3>Deal Details</h3>

      <form onSubmit={handleDealSubmit} id="deal-form">
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
            disabled
            label="Contact Name"
            type="text"
            value={contactName}
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <TextField
            disabled
            value={accountName}
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
      </form>

      <RelatedQuotes
        moduleName={moduleName}
        recordId={recordId}
        relatedQuotes={relatedQuotes}
        getQuotes={getQuotes}
      />
      <form></form>
      <DataTransaction dataTransaction={dataTransaction} dealId={dealId} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 3,
        }}
      >
        <Button
          sx={{
            mr: 2,
          }}
          variant="outlined"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          type="submit"
          form="deal-form"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </Box>
    </div>
  );
};

export default DealDetails;
