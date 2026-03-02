import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import EditQuotes from "./EditQuotes";
import DeleteRecord from "./DeleteRecord";

const TableComponent = ({ relatedQuotes, getQuotes }) => {
  //console.log("Related Quotes in table", relatedQuotes.data);
  // const [quotes, setquotes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editQuoteId, setEditQuoteId] = useState(null);

  // console.log("Related quotes in table content", relatedQuotes);
  // console.log("module name in table content", moduleName);
  // console.log("Record id in table content", recordId);
  // console.log("Delete", deleteQuoteId);

  useEffect(() => {
    getQuotes();
  }, [getQuotes]);

  const quotes = relatedQuotes.data;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEditQuotes = (id) => {
    //console.log("Edit quote with ID:", id);
    setEditQuoteId(id);
    getQuotes();
  };
  //console.log("Checking edit id", editQuoteId);

  const handleDeleteQuote = (id) => {
    console.log("Delete quote with ID:", id);
    
    getQuotes();
  };

  return (
    <Paper>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead
            sx={{
              backgroundColor: "#494343",
              "& .MuiTableCell-root": {
                color: "white",
                fontWeight: "medium",
                fontSize: "15px",
              },
            }}
          >
            <TableRow>
              <TableCell>Subject</TableCell>
              <TableCell align="center">Quote Stage</TableCell>
              <TableCell align="center">Total</TableCell>
              <TableCell align="center">Carrier</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quotes && quotes.length > 0 ? (
              quotes
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((quote) => (
                  <TableRow
                    key={quote.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {quote.Subject}
                    </TableCell>
                    <TableCell align="center">{quote.Quote_Stage}</TableCell>
                    <TableCell align="center">{quote.Grand_Total}</TableCell>
                    <TableCell align="center">{quote.Carrier}</TableCell>
                    <TableCell align="center">
                      {/* Edit a record */}
                      <EditQuotes
                        editQuoteId={editQuoteId}
                        quote={quote}
                        onClick={() => handleEditQuotes(quote.id)}
                      />

                      {/* Delete a record */}
                      <DeleteRecord
                        quote={quote}
                        onClick={() => handleDeleteQuote(quote.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={5}>
                  No quotes available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={quotes ? quotes.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TableComponent;
