import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import RelatedQuotes from "./RelatedQuotes";

const DealDetails = ({ moduleName, recordId }) => {
  const [dealName, setDealName] = useState("");
  const [dealId, setDealId] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactNameId, setContactNameId] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountId, setAccountId] = useState();
  const [Amount, setAmount] = useState("");
  const [relatedQuotes, setRelatedQuotes] = useState([]);

  // console.log(moduleName);
  // console.log(recordId);

  useEffect(() => {
    if (moduleName && recordId) {
      window.ZOHO.CRM.API.getRecord({
        Entity: moduleName,
        RecordID: recordId,
      }).then(function (recordData) {
        console.log(recordData.data[0]);

        setDealName(recordData.data[0]?.Deal_Name);
        setDealId(recordData.data[0]?.id);
        setContactName(recordData.data[0]?.Contact_Name?.name);
        setContactNameId(recordData.data[0]?.Contact_Name?.id);
        setAccountName(recordData.data[0]?.Account_Name?.name);
        setAccountId(recordData.data[0]?.Account_Name?.id);
        setAmount(recordData.data[0]?.Amount);

        // window.ZOHO.CRM.API.getAllRecords({
        //   Entity: "Accounts",
        //   sort_order: "asc",
        // }).then(function (data) {
        //   console.log(data);
        // });
      });
    }
  }, [moduleName, recordId]);

  const getQuotes = async () => {
    const quotes = await window.ZOHO.CRM.API.getRelatedRecords({
      Entity: moduleName,
      RecordID: recordId,
      RelatedList: "Quotes",
    }).catch(() => {
      console.error("Error in get related records");
    });
    //console.log(quotes);

    setRelatedQuotes(quotes);
  };

  const handleSubmit = () => {
    var configDeal = {
      Entity: "Deals",
      APIData: {
        id: dealId,
        Deal_Name: dealName,
        Amount: Amount,
        // Account_Name: {
        //   id: accountId,
        //   name: accountName,
        // },
        // Contact_Name: {
        //   name: contactName,
        //   id: contactNameId,
        // },
      },
      Trigger: [],
    };

    // var configAccount = {
    //   Entity: "Accounts",
    //   APIData: {
    //     id: accountId,
    //     Full_Name: accountName,
    //   },
    //   Trigger: [],
    // };

    // var configContact = {
    //   Entity: "Contacts",
    //   APIData: {
    //     id: contactNameId,
    //     Full_Name: contactName,
    //   },
    //   Trigger: [],
    // };

    window.ZOHO.CRM.API.updateRecord(configDeal).then(function (dealData) {
      console.log(dealData);
    });
    // window.ZOHO.CRM.API.updateRecord(configAccount).then(function (accountData) {
    //   console.log(accountData);
    // });
    // window.ZOHO.CRM.API.updateRecord(configContact).then(function (contactData) {
    //   console.log(contactData);
    // });
  };

  const handleClose = () => {
    window.ZOHO.CRM.UI.Popup.closeReload().then(function (data) {
      console.log(data);
    });
  };

  return (
    <div>
      <h3>Deal Details</h3>

      <form onSubmit={handleSubmit} id="deal-form">
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
      </form>

      <RelatedQuotes
        moduleName={moduleName}
        recordId={recordId}
        relatedQuotes={relatedQuotes}
        getQuotes={getQuotes}
      />

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
        <Button variant="contained" type="submit" form="deal-form">
          Submit
        </Button>
      </Box>
    </div>
  );
};

export default DealDetails;
