import React, {useEffect, useState} from 'react'
import { init, network, connectWallet, accountAddress, getBalance, getContractName } from '../ethers'


export default function Home() {
    const [connected, setConnected] = useState(false);
    const [balance, setBalance] = useState("");
    const [name, setName] = useState("");


    useEffect(() => {
        init().then(() => {
            handleGetContractName();
        })

        window.ethereum.on('chainChanged', (chainId) => {
            // Handle the new chain.
            // Correctly handling chain changes can be complicated.
            // We recommend reloading the page unless you have good reason not to.
            window.location.reload();
          });
        }, []);
        
    async function handleConnectWallet() {
        try {
            await connectWallet();
            setConnected(true);
        } catch(e) {
            console.log(e);
        }
    }

    function handleDisconnectWallet() {
        window.location.reload();
    }

    async function handleGetBalance() {
        try {
            const balanceVal = await getBalance();
            setBalance(balanceVal);
        } catch(e) {
            console.log("handleBalance", e);
        }
    }

    async function handleGetContractName() {
        try {
            const nameVal = await getContractName();
            setName(nameVal);
        } catch(e) {
            console.log(e);
        }
    }



  return (
      <>
      <h1>{name}</h1>
      <div>Account: {accountAddress}</div>
      <div>Balance: {balance}</div>

      { !connected && (
          <>
          
          <button className='connect' onClick={handleConnectWallet}>Connect Wallet</button>
          </>
      )}
      { connected && (
      <>
      <button className='connect' onClick={handleDisconnectWallet}>Disconnect</button>
      <button className='balance' onClick={handleGetBalance}>Get Balance</button>
      </>
      )}
      
      </>

  )
}
