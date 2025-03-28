import { useState, useEffect } from "react";

const fetchLivePrice = async (): Promise<number | null> => {
  try {
    const response = await fetch(
      "https://api.binance.com/api/v3/ticker/price?symbol=ATOMUSDT"
    );
    const data: { price: string } = await response.json();
    return parseFloat(data.price);
  } catch (error) {
    console.error("Error fetching live price:", error);
    return null;
  }
};

const LivePrice: React.FC = () => {
  const [livePrice, setLivePrice] = useState<number | null>(null);

  useEffect(() => {
    const getPrice = async () => {
      const price = await fetchLivePrice();
      setLivePrice(price);
    };

    getPrice();
    const interval = setInterval(getPrice, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p style={{ margin: "0px" }}>
        ATOM/USDT:{" "}
        {livePrice !== null ? `$${livePrice.toFixed(2)}` : "Loading..."}
      </p>
      <small
        style={{
          display: "block",
          fontSize: "12px",
        }}
      >
        (Source: Binance)
      </small>
    </div>
  );
};

export default LivePrice;
