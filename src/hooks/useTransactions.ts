import { useState, useEffect } from "react";
import axios from "axios";

const useTransactions = (address: unknown, initialOffset: any) => {
  const [fetchedNodes, setFetchedNodes] = useState({});
  const [error, setError] = useState("");
  const [offset, setOffset] = useState(initialOffset);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/data?address=${address}&offset=${offset}`,
          {
            headers: { mode: "no-cors", "Access-Control-Allow-Origin": "*" },
          }
        );
        const transactions = response.data;

        if (transactions.length === 0) {
          // Stop fetching when no more transactions are available
          return;
        }

        // Group transactions by address
        const groupedNodes = transactions.reduce(
          (acc: { [x: string]: any[] }, transaction: { address: any }) => {
            const { address } = transaction;

            if (!acc[address]) {
              acc[address] = [];
            }

            acc[address].push(transaction);

            return acc;
          },
          {}
        );

        setFetchedNodes((prevNodes) => ({
          ...prevNodes,
          ...groupedNodes,
        }));

        setOffset((prevOffset: any) => prevOffset + 10);
      } catch (error) {
        setError("An error occurred while fetching data.");
        console.log("Error:", error);
      }
    };

    fetchData();
  }, [address, offset]);

  return { fetchedNodes, error };
};

export default useTransactions;
