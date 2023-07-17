import { useEffect } from "react";
import { data } from "./constants";

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

let nodes: { [key: string]: Node } = {};

const mapTransaction = (data: any) => {
  const { tx, gas_used, height } = data;
  const { body } = tx;
  const { messages } = body;

  messages.forEach((message: any) => {
    const {
      "@type": type,
      delegatorAddress,
      validatorAddress,
      sender,
      receiver,
      signer,
    } = message;
    let senderAddress: string;
    let receiverAddress: string;

    switch (type) {
      case "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward":
      case "/cosmos.staking.v1beta1.MsgDelegate":
      case "/cosmos.staking.v1beta1.MsgUnDelegate":
        senderAddress = delegatorAddress;
        receiverAddress = validatorAddress;
        break;
      case "ibc.core.client.v1.MsgUpdateClient":
        senderAddress = signer;
        receiverAddress = "goc proposals";
        break;
      case "/ibc.applications.transfer.v1.MsgTransfer":
        senderAddress = sender;
        receiverAddress = receiver;
        break;
      default:
        return;
    }

    const transaction: Transaction = {
      sender: senderAddress,
      receiver: receiverAddress,
      hash: data.hash,
      type,
      gasLimit: tx.authInfo.fee.gasLimit,
      amount: tx.authInfo.fee.amount,
      gas_used,
      height,
    };
    if (nodes[transaction.receiver]) {
      nodes[transaction.receiver].transactions.push(transaction);
    } else {
      nodes[transaction.receiver] = {
        address: transaction.receiver,
        transactions: [transaction],
      };
    }
  });
};

const mapTransactions = (txns: any[]) => {
  txns.forEach((txn) => mapTransaction(txn));
};

function App() {
  useEffect(() => {
    mapTransactions(data);
    console.log("nodes:", nodes);
  }, []);
  return (
    <div>
      {JSON.stringify(
        nodes.evmosvaloper1sp9frqwep52chwavv3xd776myy8gyyvkv5uysl
      )}
    </div>
  );
}

export default App;
