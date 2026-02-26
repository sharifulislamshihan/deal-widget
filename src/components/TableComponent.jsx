import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import { Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import EditQuotes from "./EditQuotes";
import { Edit } from "@mui/icons-material";

const TableComponent = ({ relatedQuotes }) => {
  console.log("Related Quotes in table", relatedQuotes);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editQuoteId, setEditQuoteId] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEditQuotes = (id) => {
    console.log("Edit quote with ID:", id);
    setEditQuoteId(id);
  };
  console.log("Checking edit id", editQuoteId);

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
            {relatedQuotes && relatedQuotes.length > 0 ? (
              relatedQuotes
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((relatedQuote) => (
                  <TableRow
                    key={relatedQuote.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {relatedQuote.Subject}
                    </TableCell>
                    <TableCell align="center">
                      {relatedQuote.Quote_Stage}
                    </TableCell>
                    <TableCell align="center">
                      {relatedQuote.Grand_Total}
                    </TableCell>
                    <TableCell align="center">{relatedQuote.Carrier}</TableCell>
                    <TableCell align="center">
                      <EditQuotes 
                      editQuoteId={editQuoteId}
                      quote={relatedQuote}
                      onClick={() => handleEditQuotes(relatedQuote.id)} />
                      

                    
                     <IconButton color="error" size="small">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={5}>
                  No quotes available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={relatedQuotes ? relatedQuotes.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TableComponent;
