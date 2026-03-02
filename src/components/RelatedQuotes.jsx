import { Box } from "@mui/material";
import TableComponent from "./TableComponent";
import CreateQuotes from "./CreateQuotes";

const RelatedQuotes = ({ relatedQuotes, moduleName, recordId,  getQuotes }) => {
  
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
        <CreateQuotes recordId={recordId} getQuotes={getQuotes} />
      </Box>

      <TableComponent
        relatedQuotes={relatedQuotes}
        moduleName={moduleName}
        recordId={recordId}
        getQuotes={getQuotes}
      />
    </div>
  );
};

export default RelatedQuotes;
