import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useState } from "react";
import EditQuote from "./EditQuote";
import DeleteQuote from "./DeleteQuote";

const stageConfig = {
  Draft:               { color: "default",  variant: "filled" },
  "Negotiation/Review":{ color: "warning",  variant: "filled" },
  Delivered:           { color: "info",     variant: "filled" },
  "On Hold":           { color: "warning",  variant: "filled" },
  Confirmed:           { color: "success",  variant: "filled" },
  "Closed Won":        { color: "success",  variant: "filled" },
  "Closed Lost":       { color: "error",    variant: "filled" },
};

const QuotesTable = ({ relatedQuotes, getQuotes }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editQuoteId, setEditQuoteId] = useState(null);

  const quotes = relatedQuotes?.data ?? [];

  return (
    <Paper sx={{ border: "1px solid #e2e8f0", overflow: "hidden" }}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Subject</TableCell>
              <TableCell>Quote Stage</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Carrier</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quotes.length > 0 ? (
              quotes
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {quote.Subject}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={quote.Quote_Stage}
                        size="small"
                        color={stageConfig[quote.Quote_Stage]?.color ?? "default"}
                        variant={stageConfig[quote.Quote_Stage]?.variant ?? "filled"}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600} color="text.primary">
                        {quote.Grand_Total != null
                          ? `$${Number(quote.Grand_Total).toLocaleString()}`
                          : "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {quote.Carrier || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <EditQuote
                        editQuoteId={editQuoteId}
                        quote={quote}
                        onClick={() => setEditQuoteId(quote.id)}
                        getQuotes={getQuotes}
                      />
                      <DeleteQuote quote={quote} getQuotes={getQuotes} />
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} sx={{ border: 0 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      py: 5,
                      gap: 1,
                    }}
                  >
                    <ReceiptIcon sx={{ fontSize: 40, color: "#cbd5e1" }} />
                    <Typography variant="body2" color="text.secondary">
                      No quotes yet
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      Click "Create Quote" to add one
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={quotes.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(+e.target.value);
          setPage(0);
        }}
      />
    </Paper>
  );
};

export default QuotesTable;
