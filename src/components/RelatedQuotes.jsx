import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import TableComponent from "./TableComponent";
import CreateQuotes from "./CreateQuotes";

const RelatedQuotes = ({ moduleName, recordId }) => {
  const [relatedQuotes, setRelatedQuotes] = useState([]);
  console.log(moduleName);
  console.log("related quotes recordId:", recordId);

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
          mb: 3,
        }}
      >
        <h3>Related Quotes</h3>

        {/* Create Quotes button */}
        <CreateQuotes recordId={recordId} />
      </Box>

      <TableComponent relatedQuotes={relatedQuotes} />
    </div>
  );
};

export default RelatedQuotes;
