import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const DeleteRecord = ({ deleteQuoteId, onClick, quote }) => {
  console.log(deleteQuoteId);
  console.log("Delete Quote", quote);

  const [open, setOpen] = useState(false);
  const [quoteId, SetQuoteId] = useState(quote?.id || "");
  const subject = quote?.Subject;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    // console.log("Delete Quote", quoteId);
    if (quoteId) {
      window.ZOHO.CRM.API.deleteRecord({
        Entity: "Quotes",
        RecordID: quoteId,
      }).then(function (data) {
        if (data.data[0].code === "SUCCESS") {
          alert("Record updated successfully!");
        } else {
          alert("Failed to update record.");
        }
      });
      handleClose();
    }
  };

  return (
    <div>
      <IconButton
        color="error"
        size="small"
        onClick={() => {
          onClick(deleteQuoteId);
          handleClickOpen();
        }}
      >
        <DeleteIcon />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete {subject}?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be undone. Are you sure you want to permanently
            remove this?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleDelete} autoFocus color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteRecord;
