import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/header";
import DealDetails from "./components/DealDetails";

function App() {
  const [zohoLoaded, setZohoLoaded] = useState(false);
  const [recordId, setRecordId] = useState("");
  const [moduleName, setModuleName] = useState("");
  useEffect(() => {
    /*
     * Subscribe to the EmbeddedApp onPageLoad event before initializing
     */

    window.ZOHO.embeddedApp.on("PageLoad", function (data) {
      console.log(data);
      setRecordId(data["EntityId"][0]);
      setModuleName(data?.Entity);
    });
    window.ZOHO.embeddedApp.init().then(() => {
      setZohoLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (zohoLoaded && recordId && moduleName) {
      window.ZOHO.CRM.API.getRecord({
        Entity: moduleName,
        approved: "both",
        RecordID: recordId,
      }).then(function (data) {
        console.log(data);
      });

      window.ZOHO.CRM.UI.Resize({
        height: "1000",
        width: "1000",
      }).then(function (data) {
        console.log(data);
      });
    }
  }, [zohoLoaded, recordId, moduleName]);

  console.log(recordId);
  console.log(moduleName);

  return (
    <div>
      <Header />
      <DealDetails moduleName={moduleName} recordId={recordId} />
    </div>
  );
}

export default App;
