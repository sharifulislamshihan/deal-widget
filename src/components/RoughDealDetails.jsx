import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import { faker } from '@faker-js/faker'

const createRandomRow = () => ({
  id: faker.string.uuid(),
  transactionName: faker.commerce.productName(),
  email: faker.internet.email(),
  amount: parseFloat(faker.finance.amount({ min: 10, max: 1000 })),
  transactionDate: faker.date.past(),
})

const initialRows = faker.helpers.multiple(createRandomRow, {
  count: 5,
})

const emptyNewRow = {
  id: '',
  transactionName: '',
  email: '',
  amount: 0,
  transactionDate: null,
}

export default function App() {
  const [rows, setRows] = useState(initialRows)
  const [editingRowId, setEditingRowId] = useState(null)
  const [editedRowData, setEditedRowData] = useState(null)
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [newRowData, setNewRowData] = useState(emptyNewRow)

  const handleOpenAddDialog = () => {
    setNewRowData(emptyNewRow) // Reset dialog fields
    setOpenAddDialog(true)
  }

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false)
  }

  const handleSaveNewRow = () => {
    const finalNewRow = { ...newRowData, id: faker.string.uuid(), isNew: false }
    setRows((prevRows) => [...prevRows, finalNewRow])
    handleCloseAddDialog()
  }

  const handleNewRowInputChange = (e) => {
    const { name, value } = e.target
    setNewRowData((prev) => {
      if (name === 'amount') {
        return { ...prev, [name]: parseFloat(value) || 0 }
      }
      return { ...prev, [name]: value }
    })
  }

  const handleNewRowDateChange = (date) => {
    setNewRowData((prev) => ({ ...prev, transactionDate: date }))
  }

  const handleEditClick = (id) => {
    const rowToEdit = rows.find((row) => row.id === id)
    if (rowToEdit) {
      setEditingRowId(id)
      setEditedRowData({ ...rowToEdit }) // Create a copy for editing
    }
  }

  const handleSaveClick = (id) => {
    if (editedRowData) {
      setRows((prevRows) =>
        prevRows.map((row) => (row.id === id ? { ...editedRowData, isNew: false } : row)),
      )
      setEditingRowId(null)
      setEditedRowData(null)
    }
  }

  const handleCancelClick = (id) => {
    setEditingRowId(null)
    setEditedRowData(null)
  }

  const handleDeleteClick = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedRowData((prev) => {
      if (!prev) return null
      if (name === 'amount') {
        return { ...prev, [name]: parseFloat(value) || 0 }
      }
      return { ...prev, [name]: value }
    })
  }

  const handleDateChange = (date) => {
    setEditedRowData((prev) => {
      if (!prev) return null
      return { ...prev, transactionDate: date }
    })
  }

  return (
    <Box sx={{ p: 4 }}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpenAddDialog}
        sx={{ mb: 2 }}
      >
        Add Row
      </Button>

      <TableContainer component={Paper} className="shadow-md rounded-lg">
        <Table sx={{ minWidth: 700 }} aria-label="dynamic table">
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell className="font-bold text-gray-700">Transaction Name</TableCell>
              <TableCell className="font-bold text-gray-700">Email</TableCell>
              <TableCell align="right" className="font-bold text-gray-700">Amount</TableCell>
              <TableCell className="font-bold text-gray-700">Transaction Date</TableCell>
              <TableCell align="center" className="font-bold text-gray-700">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                {editingRowId === row.id && editedRowData ? (
                  <>
                    <TableCell>
                      <TextField
                        name="transactionName"
                        value={editedRowData.transactionName}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="email"
                        value={editedRowData.email}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        name="amount"
                        value={editedRowData.amount}
                        onChange={handleInputChange}
                        type="number"
                        size="small"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <DatePicker
                        label="Date"
                        value={editedRowData.transactionDate}
                        onChange={handleDateChange}
                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton aria-label="save" onClick={() => handleSaveClick(row.id)} color="primary">
                        <SaveIcon />
                      </IconButton>
                      <IconButton aria-label="cancel" onClick={() => handleCancelClick(row.id)} color="inherit">
                        <CancelIcon />
                      </IconButton>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell component="th" scope="row">
                      {row.transactionName}
                    </TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell align="right">${row.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {row.transactionDate ? new Date(row.transactionDate).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton aria-label="edit" onClick={() => handleEditClick(row.id)} color="info">
                        <EditIcon />
                      </IconButton>
                      <IconButton aria-label="delete" onClick={() => handleDeleteClick(row.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add New Row Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Transaction</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              name="transactionName"
              label="Transaction Name"
              value={newRowData.transactionName}
              onChange={handleNewRowInputChange}
              fullWidth
              size="small"
            />
            <TextField
              name="email"
              label="Email"
              value={newRowData.email}
              onChange={handleNewRowInputChange}
              fullWidth
              size="small"
            />
            <TextField
              name="amount"
              label="Amount"
              type="number"
              value={newRowData.amount}
              onChange={handleNewRowInputChange}
              fullWidth
              size="small"
            />
            <DatePicker
              label="Transaction Date"
              value={newRowData.transactionDate}
              onChange={handleNewRowDateChange}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSaveNewRow} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}