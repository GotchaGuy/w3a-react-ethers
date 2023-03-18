import { ethers } from "ethers";
import NFTMarketplaceABI from "./contract/NFTMarketplaceABI.json";

const contractAddress = "0x3FfDf07919352322F718B23Cf6F9A38D96db8F8f"; // the address of your contract
const contractAbi = NFTMarketplaceABI; // the ABI of your contract

let provider = null;
let signer = null;
let contract = null;
let accountAddress = null;
let network = {};

async function init() {
  // create a new provider object
  provider = new ethers.providers.Web3Provider(window.ethereum, "any"); // if we want to allow any network
  // provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`);

  // create a new contract object
  contract = new ethers.Contract(contractAddress, contractAbi, provider);
  // get network info
  await getNetwork();
}

async function connectWallet() {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    // request access to the user's accounts
    await window.ethereum.enable();

    // create a new signer object
    signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();

    // fetch signer address
    await getAddress();
  } else {
    alert("Please install Metamask to use this feature!");
  }
}

function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    window.location.reload();
    // or reset all relevant state

  } else if (accounts[0] !== accountAddress) {
    console.log("accountAddress before", accountAddress);
    accountAddress = accounts[0];
    console.log("accountAddress after", accountAddress);
  }
}

async function getNetwork() {
  if (provider) {
    network = await provider.getNetwork();
  }
}

async function getAddress() {
  if (signer) {
    accountAddress = await getContract().signer.getAddress();
  }
}

function getContract() {
  return contract.connect(signer);
}

async function getContractName() {
  return await contract.name();
}

async function getURI(id) {
  return await contract.tokenURI(id);
}

async function getOwnerOf(id) {
  return await contract.ownerOf(id);
}

async function getOwnedNfts(address) {
  return await contract.getOwnedNfts(address);
}

async function fetchBalance() {
  if (accountAddress !== null && network.name === "goerli") {
    const balance = await getContract().balanceOf(accountAddress);
    return balance.toString();
  }
}

async function createNFT(uri) {
  if (uri !== null && signer) {
    const tx = await getContract().createNFT(uri);
    console.log("tx", tx);
    tx.wait();
    console.log("tx.wait", tx);
  }
}

export {
  init,
  getURI,
  signer,
  ethers,
  network,
  createNFT,
  getOwnerOf,
  getContract,
  getOwnedNfts,
  fetchBalance,
  connectWallet,
  accountAddress,
  getContractName,
  handleAccountsChanged,
};
