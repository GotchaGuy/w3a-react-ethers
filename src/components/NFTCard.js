import React, { useEffect, useState } from 'react';
import { getOwnerOf, getURI} from "../ethers";

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

        fetch(`https://ipfs.io/ipfs/${uri}`, { mode: 'cors' })
        .then(response => response.json())
        .then(data => {
            const { name, description, image } = data;
            nftData.name = name;
            nftData.desc = description;
            nftData.image = image;

            setMetadata(nftData);
            // console.log(metadata);
        }).catch(error => console.error(error));

        

    }

  return (
    <>
        <div className='card'>
          <div className='header'>
          <img src={metadata.image} alt={metadata.name}/>
          </div>
          <div className='body'>
              <h2> {metadata.name} </h2>
              <p className='desc'> <span>DESC:</span> {metadata.desc}</p>
              <p className='desc'> <span>OWNER:</span> {metadata.owner}</p>
          </div>
          <div className='action'>
              <button className='button button-main'>List</button>
          </div>
        </div>
      </>
  )
}
