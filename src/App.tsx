import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [data, setData] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://evmos.numia.xyz/txs/evmos1kdxj7ukuvw5ht93598l0n6t0ye4kvl8x8vj2nr",
          {
            headers: {
              Authorization: "Bearer sk_276dcee2d7ea486cb064a7ae55feb885",
              "Access-Control-Allow-Origin": "*",
              mode: "no-cors",
            },
          }
        );
        setData(JSON.stringify(response.data));
      } catch (error) {
        setError("An error occurred while fetching data.");
        console.log("Error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {error ? <p>{error}</p> : <p>{data || "Loading..."}</p>}
      </header>
    </div>
  );
}

export default App;
