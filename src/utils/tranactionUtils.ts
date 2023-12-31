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
    const { tx, gas_used, height, rawLog } = data;
    const { body } = tx;
    const { messages } = body;
    console.log(rawLog);
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
          receiverAddress = "gov proposals";
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
        const existingTransactions = nodes[transaction.receiver].transactions;
        const existingIndex = existingTransactions.findIndex(
          (t) => t.hash === transaction.hash
        );
        if (existingIndex !== -1) {
          const existingTransaction = existingTransactions[existingIndex];
          if (gas_used > existingTransaction.gas_used) {
            existingTransactions[existingIndex] = transaction;
          }
        } else {
          existingTransactions.push(transaction);
        }
      } else {
        nodes[transaction.receiver] = {
          address: transaction.receiver,
          transactions: [transaction],
        };
      }
    });
  };
  
  export const mapTransactions = (txns: any[]) => {
    txns.forEach((txn) => mapTransaction(txn));
  }
  
  export { nodes };
  