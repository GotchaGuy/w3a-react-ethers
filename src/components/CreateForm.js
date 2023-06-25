import React, {useState} from 'react';
import { createNFT } from "../ethers";
import { create } from "ipfs-http-client";
import { Buffer } from 'buffer';

export default function CreateForm() {

    const [imageHash, setImageHash] = useState("");
    const [metadataHash, setMetadataHash] = useState("");

    const auth = 'Basic ' + Buffer.from(process.env.REACT_APP_INFURA_IPFS_PROJECT_ID + ':' + process.env.REACT_APP_INFURA_IPFS_API_KEY).toString('base64');
    const ipfs = create({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
        headers: {authorization: auth}
    });


    async function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        const name = formData.get("nftName");
        const desc = formData.get("nftDescription");

        const file = formData.get("image");
        const buffer = await file.arrayBuffer();

        const { cid } = await ipfs.add(buffer);
        console.log("image cid", cid.toString());
        setImageHash(cid.toString());

        const nftMetadata = {
            name: name,
            description: desc,
            image: `https://ipfs.io/ipfs/${cid.toString()}`
        }

        const nftMetadataJSON = JSON.stringify(nftMetadata);

        const { cid: metadataCid } = await ipfs.add(nftMetadataJSON);
        console.log("metadata cid", metadataCid.toString());
        setMetadataHash(metadataCid.toString());

        try {
            await createNFT(metadataCid.toString());
        } catch(e) {
            console.log("ipfs upload", e);
        }



    }

  return (
      <section className='section create-form-wrapper'>
          <h2>CreateForm</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="nftName" required/>
            <input type="text" name="nftDescription" required/>
            <input type="file" name="image" accept='.jpg, .jpeg, .png' required/>
            <button type="submit" className='button'>Create NFT</button>
          </form>

          { imageHash && (
              <>
              <span>Image cid: {imageHash}</span>
              <img src={`https://ipfs.io/ipfs/${imageHash}`} alt="ipfs upload" />
              </>
          )}
          { metadataHash && (
              <>
              <span>Metadata cid: {metadataHash}</span>
              <a href={`https://ipfs.io/ipfs/${metadataHash}`} alt="ipfs full metadata upload" />
              </>
          )}



      </section>
  )
}
