import React, { useEffect, useState } from 'react';
import { getOwnerOf, getURI, accountAddress} from "../ethers";

export default function NFTCard({id}) {

    const [metadata, setMetadata] = useState({
        id: id,
        name: "",
        desc: "",
        image: "",
        owner: ""
    });

    useEffect( () => {
        handleNftMetadata();

    }, [id])

    async function handleNftMetadata() {
        let nftData = {};

        const owner = await getOwnerOf(id);
        nftData.owner = owner;
        
        let uri = await getURI(id);
        if(uri.includes("https://ipfs.moralis.io:2053/ipfs/")) {
            console.log("aaa");
            uri.replace('https://ipfs.moralis.io:2053/ipfs/', '');
        }


        fetch(`https://ipfs.io/ipfs/${uri}`, { mode: 'cors' })
        .then(response => response.json())
        .then(data => {
            const { name, description, image } = data;
            console.log(name, description, image);
            nftData.name = name;
            nftData.desc = description;
            nftData.image = image;

            setMetadata(nftData);
            console.log(metadata);
        }).catch(error => console.error(error));

        

    }

  return (
    <div>NFTCard</div>
  )
}
