import React, { useState, useEffect } from "react";
import { init, connectWallet, signer, getContract, fetchBalance, accountAddress, network, handleAccountsChanged } from "./ethers";

init();

function App() {
  const [balance, setBalance] = useState(null);
  const [connected, setConnected] = useState(false);
  const [changedAddress, setChangedAddress] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        handleAccountsChanged(accounts);
      });

      window.ethereum.on('chainChanged', (_chainId) => window.location.reload());
    }
  }, []);

  async function handleConnectWallet() {
    try {
      await connectWallet();
      setConnected(true);
    } catch (error) {
      console.log("handleConnectWallet", error);
    }
  }

  function handleDisconnectWallet() {
    window.location.reload();
  }

  async function handleFetchBalance() {
    if (connected) {
      const balance = await fetchBalance();
      setBalance(balance);
    }
  }

  return (
    <div>
      <h1>Balance: {balance}</h1>
      <h1>Account: {accountAddress}</h1>
      {!connected && <button onClick={handleConnectWallet}>Connect Wallet</button>}
      {connected && (
        <>
          <span>Network: {network.name}</span>
          {network.name === "goerli" ? (
            <>
              <span>Congrats! That's the right nework</span>
              <button onClick={handleFetchBalance}>Fetch Balance</button>
            </>
          ) : (
            <span>You must switch to Goerli</span>
          )}
          <button onClick={handleDisconnectWallet}>Disconnect Wallet</button>
        </>
      )}
    </div>
  );
}

export default App;
