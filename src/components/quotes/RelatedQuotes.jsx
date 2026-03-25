import { Box, Typography } from "@mui/material";
import QuotesTable from "./QuotesTable";
import CreateQuote from "./CreateQuote";

const RelatedQuotes = ({ relatedQuotes, moduleName, recordId, getQuotes }) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {relatedQuotes?.data?.length ?? 0}{" "}
          {relatedQuotes?.data?.length === 1 ? "quote" : "quotes"}
        </Typography>
        <CreateQuote recordId={recordId} getQuotes={getQuotes} />
      </Box>
      <QuotesTable
        relatedQuotes={relatedQuotes}
        moduleName={moduleName}
        recordId={recordId}
        getQuotes={getQuotes}
      />
    </Box>
  );
};

export default RelatedQuotes;
