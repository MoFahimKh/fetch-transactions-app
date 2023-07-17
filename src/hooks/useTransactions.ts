import { useState, useEffect } from 'react';
import axios from 'axios';

const useTransactions = () => {
  const [nodes, setNodes] = useState({});
  const [error, setError] = useState("");
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://evmos.numia.xyz/txs/evmos1kdxj7ukuvw5ht93598l0n6t0ye4kvl8x8vj2nr?offset=${offset}`,
          {
            headers: {
              Authorization: 'Bearer sk_276dcee2d7ea486cb064a7ae55feb885',
              'Access-Control-Allow-Origin': '*',
              mode: 'no-cors',
            },
          }
        );

        const transactions = response.data;

        if (transactions.length === 0) {
          // Stop fetching when no more transactions are available
          return;
        }

        // Group transactions by address (node)
        const groupedNodes = transactions.reduce((acc: { [x: string]: any[]; }, transaction: { address: any; }) => {
          const { address } = transaction;

          if (!acc[address]) {
            acc[address] = [];
          }

          acc[address].push(transaction);

          return acc;
        }, {});

        setNodes((prevNodes) => ({
          ...prevNodes,
          ...groupedNodes,
        }));

        setOffset((prevOffset) => prevOffset + 10);
      } catch (error) {
        setError('An error occurred while fetching data.');
        console.log('Error:', error);
      }
    };

    fetchData();
  }, [offset]);

  return { nodes, error };
};

export default useTransactions;
