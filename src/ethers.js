import { ethers } from 'ethers';
import NFTMarketplaceABI from './contract/NFTMarketplaceABI.json';

const contractAddress = '0x57FB190D83b1b01EE24488dF3b5645648BD96c99'; // the address of your contract
const contractAbi = NFTMarketplaceABI; // the ABI of your contract
// const REACT_APP_INFURA_API_KEY = "";

let provider = null;
let signer = null;
let contract = null;

function init() {
  // create a new provider object
  provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`);
  // create a new contract object
  contract = new ethers.Contract(contractAddress, contractAbi, provider);

  // *dodati neku read funkciju ovde da se okine
}

async function connectWallet() {
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    // request access to the user's accounts
    await window.ethereum.enable();
    
    // create a new signer object
    signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
    console.log("signer", signer);
  } else {
    alert('Please install Metamask to use this feature!');
  }
}

async function fetchBalance() {
    console.log("getContract", getContract());
    const accountAddress = await getContract().signer.getAddress();
    const balance = await getContract().balanceOf(accountAddress);
    return balance.toString();
  }

function getContract() {
  return contract.connect(signer);
}

export { ethers, init, connectWallet, signer, getContract, fetchBalance };
