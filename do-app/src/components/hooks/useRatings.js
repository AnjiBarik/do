import { useEffect, useState, useRef, useContext } from "react";
import { BooksContext } from "../../BooksContext";
import { useGoogleScriptAPI } from "../hooks/useGoogleScriptAPI";

export function useRatings(firstSubmit) {
  const { setRatingData, uiMain, books, fieldState } = useContext(BooksContext);
  const { getAggregatedData } = useGoogleScriptAPI();
  const [loadingRatings, setLoadingRatings] = useState(false);

  const hasFetched = useRef(false); 

  useEffect(() => {    
    if (!firstSubmit || hasFetched.current || books.length === 0) return; 

    hasFetched.current = true; 

    setLoadingRatings(true);

    const loadRatings = async () => {
      try {
        const aggregatedData = await getAggregatedData(uiMain.Urprice, fieldState.idprice);
        
        if (aggregatedData && aggregatedData.length > 0) {
          setRatingData(aggregatedData);
        }
      } catch (error) {
        console.error("Error loading ratings:", error);
      } finally {
        setLoadingRatings(false);
      }
    };

    loadRatings();
  }, [firstSubmit, uiMain, books, getAggregatedData, setRatingData, fieldState]);

  return { loadingRatings };
}
