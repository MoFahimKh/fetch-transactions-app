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
    transaction: Transaction;
  }

  useEffect(() => {
    // Simulating data fetch
    setFetchedData(data);
    console.log(data);
  }, []);

  const mapTransaction = (data: any): Node => {
    const { tx, gas_used, height } = data;
    const { body } = tx;
    const { messages } = body;
  
    const message = messages[0];
    const { validatorAddress, "@type": type, delegatorAddress } = message;
  
    const transaction: Transaction = {
      sender: validatorAddress,
      receiver: delegatorAddress,
      hash: data.hash, 
      type,
      gasLimit: tx.authInfo.fee.gasLimit,
      amount: tx.authInfo.fee.amount,
      gas_used,
      height,
    };
  
    const node: Node = {
      address: transaction.receiver,
      transaction,
    };
  
    return node;
  };
  

  const node = fetchedData ? mapTransaction(fetchedData) : null;
  console.log(node);

  return (
    <div className="App">
      <header className="App-header">
        {node && (
          <div>
            <h3>Address: {node.address}</h3>
            <p>Sender: {node.transaction.sender}</p>
            <p>Receiver: {node.transaction.receiver}</p>
            <p>Hash: {node.transaction.hash}</p>
            <p>Type: {node.transaction.type}</p>
            <p>Gas Limit: {node.transaction.gasLimit}</p>
            <p>Amount:</p>
            <ul>
              {node.transaction.amount.map((amt, index) => (
                <li key={index}>
                  Amount: {amt.amount}, Denom: {amt.denom}
                </li>
              ))}
            </ul>
            <p>Gas Used: {node.transaction.gas_used}</p>
            <p>Height: {node.transaction.height}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
