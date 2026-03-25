import { useState } from "react";

const useQuoteOptions = () => {
  const [stageOptions, setStageOptions] = useState([]);
  const [carrierOptions, setCarrierOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const fetchOptions = async () => {
    setLoadingOptions(true);
    try {
      const response = await window.ZOHO.CRM.FUNCTIONS.execute("quotesWidget", {
        arguments: JSON.stringify({}),
      });
      const data = JSON.parse(`[${response.details.output}]`);
      setStageOptions(data[0].Quote_Stage);
      setCarrierOptions(data[1].Carrier);
    } finally {
      setLoadingOptions(false);
    }
  };

  return { stageOptions, carrierOptions, loadingOptions, fetchOptions };
};

export default useQuoteOptions;
