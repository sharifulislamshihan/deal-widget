import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

const emptyRow = {
  Transaction_Name: "",
  Transaction_Email: "",
  Transaction_Amount: "",
  Transaction_Date: "",
};

const DataTransaction = ({ dataTransaction, dealId }) => {
  const [rows, setRows] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedRowData, setEditedRowData] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newRowData, setNewRowData] = useState(emptyRow);
  const [saving, setSaving] = useState(false);

  // Sync rows when parent data loads
  useEffect(() => {
    if (dataTransaction?.length) {
      setRows(dataTransaction);
    }
  }, [dataTransaction]);

  // ── Persist subform to Zoho ──
  const saveSubformToZoho = async (updatedRows) => {
    setSaving(true);
    try {
      const result = await window.ZOHO.CRM.API.updateRecord({
        Entity: "Deals",
        APIData: {
          id: dealId,
          Subform_1: updatedRows.map((r) => ({
            ...(r.id ? { id: r.id } : {}),
            Transaction_Name: r.Transaction_Name,
            Transaction_Email: r.Transaction_Email,
            Transaction_Amount: r.Transaction_Amount,
            Transaction_Date: r.Transaction_Date,
          })),
        },
        Trigger: [],
      });

      if (result?.data?.[0]?.code === "SUCCESS") {
        alert("Transaction saved successfully!");
      } else {
        alert("Failed to save transaction.");
      }
    } catch {
      alert("Error saving transaction.");
    } finally {
      setSaving(false);
    }
  };

  // ── Add Row ──
  const handleOpenAddDialog = () => {
    setNewRowData(emptyRow);
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => setOpenAddDialog(false);

  const handleNewRowChange = (e) => {
    const { name, value } = e.target;
    setNewRowData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNewRow = () => {
    const updatedRows = [...rows, { ...newRowData }];
    setRows(updatedRows);
    saveSubformToZoho(updatedRows);
    handleCloseAddDialog();
  };

  // ── Inline Edit ──
  const handleEditClick = (index) => {
    setEditingRowId(index);
    setEditedRowData({ ...rows[index] });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedRowData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = (index) => {
    const updatedRows = rows.map((r, i) => (i === index ? editedRowData : r));
    setRows(updatedRows);
    saveSubformToZoho(updatedRows);
    setEditingRowId(null);
    setEditedRowData(null);
  };

  const handleCancelClick = () => {
    setEditingRowId(null);
    setEditedRowData(null);
  };

  // ── Delete ──
  const handleDeleteClick = (index) => {
    if (!window.confirm("Delete this transaction?")) return;
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    saveSubformToZoho(updatedRows);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <h3>Data Transaction</h3>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          disabled={saving}
          size="small"
        >
          Add Row
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="transaction table">
          <TableHead
            sx={{
              backgroundColor: "#494343",
              "& .MuiTableCell-root": {
                color: "white",
                fontWeight: "medium",
              },
            }}
          >
            <TableRow>
              <TableCell>Transaction Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Transaction Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row, index) => (
                <TableRow
                  key={row.id || index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {editingRowId === index && editedRowData ? (
                    <>
                      <TableCell>
                        <TextField
                          name="Transaction_Name"
                          value={editedRowData.Transaction_Name}
                          onChange={handleEditChange}
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="Transaction_Email"
                          value={editedRowData.Transaction_Email}
                          onChange={handleEditChange}
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          name="Transaction_Amount"
                          value={editedRowData.Transaction_Amount}
                          onChange={handleEditChange}
                          type="number"
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="Transaction_Date"
                          value={editedRowData.Transaction_Date || ""}
                          onChange={handleEditChange}
                          type="date"
                          size="small"
                          fullWidth
                          slotProps={{ inputLabel: { shrink: true } }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          aria-label="save"
                          onClick={() => handleSaveClick(index)}
                          color="primary"
                          disabled={saving}
                        >
                          <SaveIcon />
                        </IconButton>
                        <IconButton
                          aria-label="cancel"
                          onClick={handleCancelClick}
                          color="inherit"
                        >
                          <CancelIcon />
                        </IconButton>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{row.Transaction_Name}</TableCell>
                      <TableCell>{row.Transaction_Email}</TableCell>
                      <TableCell align="right">
                        {row.Transaction_Amount}
                      </TableCell>
                      <TableCell>
                        {row.Transaction_Date || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          aria-label="edit"
                          onClick={() => handleEditClick(index)}
                          color="info"
                          disabled={saving}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleDeleteClick(index)}
                          color="error"
                          disabled={saving}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={5}>
                  No transactions available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add New Transaction Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Transaction</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
          >
            <TextField
              name="Transaction_Name"
              label="Transaction Name"
              value={newRowData.Transaction_Name}
              onChange={handleNewRowChange}
              fullWidth
              size="small"
            />
            <TextField
              name="Transaction_Email"
              label="Email"
              value={newRowData.Transaction_Email}
              onChange={handleNewRowChange}
              fullWidth
              size="small"
            />
            <TextField
              name="Transaction_Amount"
              label="Amount"
              type="number"
              value={newRowData.Transaction_Amount}
              onChange={handleNewRowChange}
              fullWidth
              size="small"
            />
            <TextField
              name="Transaction_Date"
              label="Transaction Date"
              type="date"
              value={newRowData.Transaction_Date}
              onChange={handleNewRowChange}
              fullWidth
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSaveNewRow}
            color="primary"
            variant="contained"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataTransaction;
