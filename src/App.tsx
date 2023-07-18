import { useEffect, useState } from "react";
import useTransactions from "./hooks/useTransactions";
// import { mapTransactions, nodes } from "./utils/tranactionUtils";

function App() {
  const { error, fetchedNodes } = useTransactions(
    "osmo12djtypewhttne5s4usgpy05sn3uy3dad6sgfml",
    0
  );

  useEffect(() => {}, []);

  return <div>{JSON.stringify(fetchedNodes) || error}</div>;
}

export default App;
