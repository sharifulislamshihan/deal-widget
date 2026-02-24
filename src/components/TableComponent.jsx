import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const TableComponent = ({ relatedQuotes }) => {
  console.log("Related Quotes in table", relatedQuotes);

  return (
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
          {relatedQuotes.map((relatedQuote) => (
            <TableRow
              key={relatedQuote.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {relatedQuote.Subject}
              </TableCell>
              <TableCell align="center">{relatedQuote.Quote_Stage}</TableCell>
              <TableCell align="center">{relatedQuote.Grand_Total}</TableCell>
              <TableCell align="center">{relatedQuote.Carrier}</TableCell>
              <TableCell align="center">
                <Button size="small">
                  <EditIcon />
                </Button>

                <Button color="error" size="small">
                  <DeleteIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
