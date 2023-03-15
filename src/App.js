import React, { useState } from 'react';
import { init, connectWallet, getContract } from './ethers';

init();

function App() {
  const [balance, setBalance] = useState(null);
  const [connected, setConnected] = useState(false);
  const [accountAddress, setAccountAddress] = useState("");

    async function handleConnectWallet() {
      try {
        await connectWallet();
        setConnected(true);
        const account = await getContract().signer.getAddress();
        setAccountAddress(account);
      } catch (error) {
        console.log("handleConnectWallet", error);
      }
    }


    async function fetchBalance() {
      if(connected) {
        console.log("getContract", getContract());
        const balance = await getContract().balanceOf(accountAddress);
        setBalance(balance.toString());
      }
    }

  return (
    <div>
      <h1>Balance: {balance}</h1>
      {!connected && <button onClick={handleConnectWallet}>Connect Wallet</button>}
      {connected && <button onClick={fetchBalance}>Fetch Balance</button>}
    </div>
  );
}

export default App;
