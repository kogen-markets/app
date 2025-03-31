import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import WithValue from "../../../../components/with-value";
import { Config } from "../../../../codegen/KogenMarkets.types";

const PYTH_PRICE_FEED_URL =
  "https://hermes-beta.pyth.network/v2/updates/price/latest?ids%5B%5D=";

const PythPrice = ({ config }: { config: Config }) => {
  const [spotPrice, setSpotPrice] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(
          `${PYTH_PRICE_FEED_URL}${config.pyth_base_price_feed}`
        );
        const data = await response.json();
        console.log("Pyth response:", data);

        const parsedData = data.parsed?.[0];

        if (parsedData && parsedData.price) {
          const price = parsedData.price.price;
          const expo = parsedData.price.expo;
          const calculatedPrice = price / Math.pow(10, -expo);
          setSpotPrice(calculatedPrice.toFixed(2)); // Display with 2 decimal places
        } else {
          setSpotPrice("No price data");
        }
      } catch (error) {
        console.error("Error fetching Pyth price:", error);
        setSpotPrice("Error fetching price");
      }
    };

    fetchPrice();
  }, [config.pyth_base_price_feed]);

  return (
    <>
      <WithValue value={config.strike_price_in_quote}>
        <Typography variant="caption">Latest Expiry Price</Typography>
        <Typography variant="body1">
          ${spotPrice ? spotPrice : "Loading..."}
        </Typography>
        <small
          style={{
            display: "block",
            fontSize: "12px",
          }}
        >
          (Source: Pyth Oracle)
        </small>
      </WithValue>
    </>
  );
};

export default PythPrice;
