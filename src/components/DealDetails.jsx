import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import RelatedQuotes from "./RelatedQuotes";

const DealDetails = ({ moduleName, recordId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dealName, setDealName] = useState("");
  const [dealId, setDealId] = useState("");
  const [contactFirstName, setContactFirstName] = useState("");
  const [contactLastName, setContactLastName] = useState("");
  const [contactNameId, setContactNameId] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountId, setAccountId] = useState();
  const [Amount, setAmount] = useState("");
  const [relatedQuotes, setRelatedQuotes] = useState([]);
  const [dealCode, setDealCode] = useState("");
  const [accountCode, setAccountCode] = useState("");
  const [contactCode, setContactCode] = useState("");

  useEffect(() => {
    if (moduleName && recordId) {
      window.ZOHO.CRM.API.getRecord({
        Entity: moduleName,
        RecordID: recordId,
      }).then(function (recordData) {
        console.log(recordData.data[0]);

        setDealName(recordData.data[0]?.Deal_Name);
        setDealId(recordData.data[0]?.id);
        setContactNameId(recordData.data[0]?.Contact_Name?.id);
        setAccountName(recordData.data[0]?.Account_Name?.name);
        setAccountId(recordData.data[0]?.Account_Name?.id);
        setAmount(recordData.data[0]?.Amount);
      });

      window.ZOHO.CRM.API.getRecord({
        Entity: "Contacts",
        RecordID: contactNameId,
      }).then(function (contactRecordData) {
        console.log(contactRecordData.data[0]);
        setContactFirstName(contactRecordData.data[0]?.First_Name);
        setContactLastName(contactRecordData?.data[0]?.Last_Name);
      });
    }
  }, [contactNameId, moduleName, recordId]);

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

  const handleDealSubmit = async(event) => {
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

    var configAccount = {
      Entity: "Accounts",
      APIData: {
        id: accountId,
        Account_Name: accountName,
      },
      Trigger: [],
    };

    var configContact = {
      Entity: "Contacts",
      APIData: {
        id: contactNameId,
        First_Name: contactFirstName,
        Last_Name: contactLastName,
      },
      Trigger: [],
    };

    await window.ZOHO.CRM.API.updateRecord(configDeal).then(function (dealData) {
      console.log(dealData?.data[0]?.code);
      setDealCode(dealData?.data[0]?.code);
    });
    await window.ZOHO.CRM.API.updateRecord(configAccount).then(
      function (accountData) {
        console.log(accountData?.data[0]?.code);
        setAccountCode(accountData?.data[0]?.code);
      },
    );
    await window.ZOHO.CRM.API.updateRecord(configContact).then(
      function (contactData) {
        console.log(contactData?.data[0]?.code);
        setContactCode(contactData?.data[0]?.code);
      },
    );


    if (
      dealCode === "SUCCESS" &&
      accountCode === "SUCCESS" &&
      contactCode === "SUCCESS"
    ) {
      alert("Deal updated successfully");
    }
    else{
      alert("Failed to update Deal information");
    }
    setIsLoading(false);
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

          {/* Contact name section */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <TextField
              label="Contact First Name"
              type="text"
              value={contactFirstName}
              onChange={(e) => setContactFirstName(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Contact Last Name"
              type="text"
              value={contactLastName}
              onChange={(e) => setContactLastName(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Box>
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
        <Button variant="contained" type="submit" form="deal-form" disabled={isLoading}>
           {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
    </div>
  );
};

export default DealDetails;
