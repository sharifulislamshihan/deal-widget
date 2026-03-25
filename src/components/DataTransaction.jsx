import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InboxIcon from "@mui/icons-material/Inbox";
import useSnackbar from "../hooks/useSnackbar";

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
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [newRowData, setNewRowData] = useState(emptyRow);
  const [saving, setSaving] = useState(false);

  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (dataTransaction?.length) {
      setRows(dataTransaction);
    }
  }, [dataTransaction]);

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
        showSnackbar("Transaction saved successfully");
      } else {
        showSnackbar("Failed to save transaction", "error");
      }
    } catch {
      showSnackbar("Error saving transaction", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNewRow = () => {
    const updatedRows = [...rows, { ...newRowData }];
    setRows(updatedRows);
    saveSubformToZoho(updatedRows);
    setOpenAddDialog(false);
  };

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

  const handleDeleteConfirm = () => {
    const updatedRows = rows.filter((_, i) => i !== deleteIndex);
    setRows(updatedRows);
    saveSubformToZoho(updatedRows);
    setDeleteIndex(null);
  };

  return (
    <Box>
      {/* Table header row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {rows.length} {rows.length === 1 ? "record" : "records"}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setNewRowData(emptyRow);
            setOpenAddDialog(true);
          }}
          disabled={saving}
          size="small"
          sx={{ px: 2 }}
        >
          Add Row
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ border: "1px solid #e2e8f0", overflow: "hidden" }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Transaction Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row, index) => (
                <TableRow key={row.id || index}>
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
                        <Tooltip title="Save">
                          <IconButton
                            onClick={() => handleSaveClick(index)}
                            disabled={saving}
                            size="small"
                            sx={{ bgcolor: "#111827", color: "white", mr: 0.5,
                              "&:hover": { bgcolor: "#374151" } }}
                          >
                            {saving ? (
                              <CircularProgress size={14} color="inherit" />
                            ) : (
                              <SaveIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <IconButton onClick={handleCancelClick} size="small"
                            sx={{ bgcolor: "#f1f5f9" }}>
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {row.Transaction_Name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {row.Transaction_Email}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {row.Transaction_Amount
                            ? `$${Number(row.Transaction_Amount).toLocaleString()}`
                            : "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {row.Transaction_Date || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleEditClick(index)}
                            disabled={saving}
                            size="small"
                            sx={{ color: "#374151", "&:hover": { bgcolor: "#f3f4f6" } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => setDeleteIndex(index)}
                            disabled={saving}
                            size="small"
                            sx={{ color: "#6b7280", "&:hover": { bgcolor: "#f3f4f6", color: "#dc2626" } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </>
                  )}
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
                    <InboxIcon sx={{ fontSize: 40, color: "#cbd5e1" }} />
                    <Typography variant="body2" color="text.secondary">
                      No transactions yet
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      Click "Add Row" to get started
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Transaction Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Transaction</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Transaction Name"
              value={newRowData.Transaction_Name}
              onChange={(e) =>
                setNewRowData((p) => ({ ...p, Transaction_Name: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={newRowData.Transaction_Email}
              onChange={(e) =>
                setNewRowData((p) => ({ ...p, Transaction_Email: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Amount"
              type="number"
              value={newRowData.Transaction_Amount}
              onChange={(e) =>
                setNewRowData((p) => ({ ...p, Transaction_Amount: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Transaction Date"
              type="date"
              value={newRowData.Transaction_Date}
              onChange={(e) =>
                setNewRowData((p) => ({ ...p, Transaction_Date: e.target.value }))
              }
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSaveNewRow} variant="contained" disabled={saving}>
            {saving ? "Saving..." : "Save Transaction"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                bgcolor: "#fef2f2",
                color: "#ef4444",
                borderRadius: "8px",
                p: 0.75,
                display: "flex",
              }}
            >
              <WarningAmberIcon fontSize="small" />
            </Box>
            Delete Transaction?
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteIndex(null)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DataTransaction;
