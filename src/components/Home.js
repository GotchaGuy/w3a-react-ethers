import { useState, useEffect } from "react";
import { init, connectWallet, network, handleAccountsChanged, getContractName } from "../ethers";
import ListingList from "./ListingList";
import OwnedList from "./OwnedList";
import CreateForm from "./CreateForm";

function Home() {
  const [connected, setConnected] = useState(false);
  const [contractName, setContractName] = useState(false);

  useEffect(() => {
    init().then(() => {
      handleGetContractName();
    })

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        handleAccountsChanged(accounts);
      });

      window.ethereum.on("chainChanged", (_chainId) => window.location.reload());
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

  async function handleGetContractName() {
    if(network.name === 'goerli') {

      const name = await getContractName();
      setContractName(name);
    }
  }

  return (
    <div>
        <section className="nav">
      <h1>{contractName}</h1>
      {!connected && <button className="button button-main" onClick={handleConnectWallet}>Connect Wallet</button>}
      {connected && 
      <>
      <div className="right">
      <span>{network.name}</span>
      <button className="button button-alt" onClick={handleDisconnectWallet}>Disconnect Wallet</button>
      </div>
      </>
      }
        </section>

        <ListingList/>
       
        { connected && (
            <>
            <OwnedList/>
            <CreateForm/>
            </>
        ) }
    </div>
  );
}

export default Home;
