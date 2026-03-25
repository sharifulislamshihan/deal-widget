import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import DealDetails from "./components/DealDetails";
import { Box, CircularProgress, Typography } from "@mui/material";

function App() {
  const [zohoLoaded, setZohoLoaded] = useState(false);
  const [recordId, setRecordId] = useState("");
  const [moduleName, setModuleName] = useState("");

  useEffect(() => {
    window.ZOHO.embeddedApp.on("PageLoad", (data) => {
      setRecordId(data["EntityId"][0]);
      setModuleName(data?.Entity);
    });

    window.ZOHO.embeddedApp.init().then(() => {
      setZohoLoaded(true);
      window.ZOHO.CRM.UI.Resize({ height: "1000", width: "1000" });
    });
  }, []);

  if (!zohoLoaded) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography color="text.secondary">Loading widget...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Header />
      <DealDetails moduleName={moduleName} recordId={recordId} />
    </Box>
  );
}

export default App;
