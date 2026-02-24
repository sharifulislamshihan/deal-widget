import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import TableComponent from "./TableComponent";

const RelatedQuotes = ({ moduleName, recordId }) => {
  const [relatedQuotes, setRelatedQuotes] = useState([]);
  console.log(moduleName);
  console.log(recordId);

  useEffect(() => {
    if (moduleName && recordId) {
      window.ZOHO.CRM.API.getRelatedRecords({
        Entity: moduleName,
        RecordID: recordId,
        RelatedList: "Quotes",
      }).then(function (data) {
        const quotes = data.data;
        //console.log("Related Quotes Data:", quotes);
        setRelatedQuotes(quotes);
      });
    }
  }, [moduleName, recordId]);

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Related Quotes</h3>
        <Button variant="outlined" startIcon={<AddIcon />}>
          Create Quote
        </Button>
      </Box>

      <TableComponent relatedQuotes={relatedQuotes} />
    </div>
  );
};

export default RelatedQuotes;
