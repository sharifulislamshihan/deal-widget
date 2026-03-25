import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Skeleton,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import RelatedQuotes from "./quotes/RelatedQuotes";
import DataTransaction from "./DataTransaction";
import useSnackbar from "../hooks/useSnackbar";

const SectionHeader = ({ icon, title }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
    <Box
      sx={{
        bgcolor: "#f3f4f6",
        color: "#6b7280",
        borderRadius: "8px",
        p: 0.75,
        display: "flex",
        alignItems: "center",
      }}
    >
      {icon}
    </Box>
    <Typography variant="h6">{title}</Typography>
  </Box>
);

const DealDetails = ({ moduleName, recordId }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dealName, setDealName] = useState("");
  const [dealId, setDealId] = useState("");
  const [contactName, setContactName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState("");
  const [relatedQuotes, setRelatedQuotes] = useState({ data: [] });
  const [dataTransaction, setDataTransaction] = useState([]);

  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();

  const getQuotes = useCallback(async () => {
    if (!moduleName || !recordId) return;
    const quotes = await window.ZOHO.CRM.API.getRelatedRecords({
      Entity: moduleName,
      RecordID: recordId,
      RelatedList: "Quotes",
    }).catch(() => null);
    if (quotes) setRelatedQuotes(quotes);
  }, [moduleName, recordId]);

  useEffect(() => {
    if (!moduleName || !recordId) return;

    window.ZOHO.CRM.API.getRecord({
      Entity: moduleName,
      RecordID: recordId,
    }).then((recordData) => {
      const record = recordData.data[0];
      setDealName(record?.Deal_Name ?? "");
      setDealId(record?.id ?? "");
      setContactName(record?.Contact_Name?.name ?? "");
      setAccountName(record?.Account_Name?.name ?? "");
      setAmount(record?.Amount ?? "");
      setDataTransaction(record?.Subform_1 ?? []);
      setLoading(false);
    });

    getQuotes();
  }, [moduleName, recordId, getQuotes]);

  const handleDealSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await window.ZOHO.CRM.API.updateRecord({
        Entity: "Deals",
        APIData: { id: dealId, Deal_Name: dealName, Amount: amount },
        Trigger: [],
      });
      if (result?.data?.[0]?.code === "SUCCESS") {
        showSnackbar("Deal updated successfully");
        window.ZOHO.CRM.UI.Popup.closeReload();
      } else {
        showSnackbar("Failed to update deal", "error");
      }
    } catch {
      showSnackbar("Error updating deal", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    window.ZOHO.CRM.UI.Popup.closeReload();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      {/* Deal Details Card */}
      <Card>
        <CardContent>
          <SectionHeader
            icon={<BusinessCenterIcon fontSize="small" />}
            title="Deal Details"
          />

          {loading ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
              }}
            >
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} variant="rounded" height={40} />
              ))}
            </Box>
          ) : (
            <form onSubmit={handleDealSubmit} id="deal-form">
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 2,
                }}
              >
                <TextField
                  value={dealName}
                  onChange={(e) => setDealName(e.target.value)}
                  label="Deal Name"
                />
                <Tooltip title="Read-only field" placement="top">
                  <TextField
                    disabled
                    label="Contact Name"
                    value={contactName}
                  />
                </Tooltip>
                <Tooltip title="Read-only field" placement="top">
                  <TextField
                    disabled
                    label="Account Name"
                    value={accountName}
                  />
                </Tooltip>
                <TextField
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  label="Amount"
                />
              </Box>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Related Quotes Card */}
      <Card>
        <CardContent>
          <SectionHeader
            icon={<ReceiptLongIcon fontSize="small" />}
            title="Related Quotes"
          />
          <RelatedQuotes
            moduleName={moduleName}
            recordId={recordId}
            relatedQuotes={relatedQuotes}
            getQuotes={getQuotes}
          />
        </CardContent>
      </Card>

      {/* Data Transactions Card */}
      <Card>
        <CardContent>
          <SectionHeader
            icon={<AccountTreeIcon fontSize="small" />}
            title="Data Transactions"
          />
          <DataTransaction dataTransaction={dataTransaction} dealId={dealId} />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
          pb: 2,
        }}
      >
        <Button
          variant="outlined"
          onClick={handleClose}
          disabled={submitting}
          sx={{ px: 3, borderColor: "#e2e8f0", color: "text.secondary" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          type="submit"
          form="deal-form"
          disabled={submitting || loading}
          sx={{ px: 3 }}
          startIcon={
            submitting ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {submitting ? "Saving..." : "Save Deal"}
        </Button>
      </Box>

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

export default DealDetails;
