import React, { useEffect, useState } from "react";
import { createNFT } from "../ethers";
import { create } from "ipfs-http-client";
import { Buffer } from 'buffer';

export default function CreateForm() {

  const [imageHash, setImageHash] = useState(null);
  const [metadataHash, setMetadataHash] = useState(null);


  const auth = 'Basic ' + Buffer.from(process.env.REACT_APP_INFURA_IPFS_PROJECT_ID + ':' + process.env.REACT_APP_INFURA_IPFS_API_KEY).toString('base64');
  const ipfs = create({ 
    host: "ipfs.infura.io", 
    port: 5001, 
    protocol: "https",  
    headers: {authorization: auth} 
    });
  console.log("ipfs", ipfs);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const name = formData.get("nftName");
    const desc = formData.get("nftDescription");
    const file = formData.get("image");
    const buffer = await file.arrayBuffer();

    const { cid } = await ipfs.add(buffer);
    console.log("image cid", cid);
    setImageHash(cid.toString());

    // Create the NFT metadata object
    const nftMetadata = {
        name: name,
        description: desc,
        image: `https://ipfs.io/ipfs/${cid.toString()}`
    }

    // Convert the metadata object to JSON
    const nftMetadataJson = JSON.stringify(nftMetadata);

    // Upload the metadata JSON to IPFS
    const { cid: metadataCid } = await ipfs.add(nftMetadataJson);
    console.log("metadata cid", metadataCid);
    setMetadataHash(metadataCid.toString());

    try {
        await createNFT(metadataCid.toString());
    } catch(e) {
        console.log("createNFT", e);
    }
  };

  return (
    <section className="section create-form-wrapper">
      <h2>CreateForm</h2>
      <div>
        <h1>Upload an image to IPFS</h1>
        <form className="create-form" onSubmit={handleSubmit}>
            <label htmlFor="nftName">NFT Name:</label>
            <input type="text" name="nftName" required />
            <label htmlFor="nftDescription">NFT Description:</label>
            <textarea name="nftDescription" required />
            <label htmlFor="image">Choose an image:</label>
            <input type="file" name="image" accept=".jpg,.jpeg,.png" required />
          <button type="submit">Create NFT</button>
        </form>
        {imageHash && (
          <div className="ipfs-image">
            <p>IPFS hash: {imageHash}</p>
            <img src={`https://ipfs.io/ipfs/${imageHash}`} alt="Uploaded to IPFS" />
          </div>
        )}
        {metadataHash && (
          <div className="ipfs-metadata">
            <p>IPFS metadata: <a href={`https://ipfs.io/ipfs/${metadataHash}`} target="_blank">{metadataHash}</a> </p>
          </div>
        )}
      </div>
    </section>
  );
}
