import React, { useEffect, useState } from "react";
import "./App.css";
import { data } from "./constants";

function App() {
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  interface Amount {
    amount: string;
    denom: string;
  }

  interface Transaction {
    sender: string;
    receiver: string;
    hash: string;
    type: string;
    gasLimit: string;
    amount: Amount[];
    gas_used: string;
    height: string;
  }

  interface Node {
    address: string;
    transactions: Transaction[];
  }

  useEffect(() => {
    // Simulating data fetch
    setFetchedData(data);
    console.log(data);
  }, []);

  const mapTransactions = (data: any): Node[] => {
    const { addressIndex, tx, gas_used, height } = data;
    const { body } = tx;
    const { messages } = body;
  
    const nodes: Node[] = [];
  
    for (const address of addressIndex) {
      const transactions: Transaction[] = [];
  
      for (const message of messages) {
        const { validatorAddress, "@type": type, delegatorAddress } = message;
  
        const transaction: Transaction = {
          sender: validatorAddress,
          receiver: delegatorAddress,
          hash: tx.hash,
          type,
          gasLimit: tx.authInfo.fee.gasLimit,
          amount: tx.authInfo.fee.amount,
          gas_used,
          height,
        };
  
        transactions.push(transaction);
      }
  
      const node: Node = {
        address,
        transactions,
      };
  
      nodes.push(node);
    }
  
    return nodes;
  };
  

  const nodes = fetchedData ? mapTransactions(fetchedData) : [];
  console.log(nodes);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {nodes.map((node, index) => (
            <div key={index}>
              <h3>Address: {node.address}</h3>
              <ul>
                {node.transactions.map((transaction, index) => (
                  <li key={index}>
                    <p>Sender: {transaction.sender}</p>
                    <p>Receiver: {transaction.receiver}</p>
                    <p>Hash: {transaction.hash}</p>
                    <p>Type: {transaction.type}</p>
                    <p>Gas Limit: {transaction.gasLimit}</p>
                    <p>Amount:</p>
                    <ul>
                      {transaction.amount.map((amt, index) => (
                        <li key={index}>
                          Amount: {amt.amount}, Denom: {amt.denom}
                        </li>
                      ))}
                    </ul>
                    <p>Gas Used: {transaction.gas_used}</p>
                    <p>Height: {transaction.height}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
