import {ethers} from "ethers";
import ContractABI from "./contract/NFTMarketplaceABI.json"

const contractAddress = "0x3FfDf07919352322F718B23Cf6F9A38D96db8F8f";


let provider = null;
let signer = null;
let contract = null;
let accountAddress = null;
let network = {};


async function init() {

 provider = new ethers.providers.Web3Provider(window.ethereum, "any");

 contract = new ethers.Contract(contractAddress, ContractABI, provider);

 await getNetwork();
};

async function connectWallet() {

    if( typeof window !== undefined && typeof window.ethereum !== undefined) {
        
        await window.ethereum.enable();
        
        signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
        console.log("signer", signer);
        await getAddress();
    } else {
        alert("Please install Metamask");
    }


}

async function getNetwork() {
    if(provider) {
        network = await provider.getNetwork();
    }
}

async function getContract() {
    return contract.connect(signer);
}

async function getAddress() {
    if(signer) {
        accountAddress = await signer.getAddress();
    }
}

async function getBalance() {
    const contract = await getContract();
     const balanceResponse = await contract.balanceOf(accountAddress);
     return balanceResponse.toString();
}

async function getContractName() {  
    if(network.name === 'goerli') {
        const nameResponse = await contract.name();
        return nameResponse.toString();
    } else {
        console.log("Switch back to Goerli por favor, gracias");
    }

}


export {
    init,
    signer,
    network,
    contract,
    provider,
    getBalance,
    connectWallet,
    accountAddress,
    getContractName
}
