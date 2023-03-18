import React, {useEffect, useState} from 'react';
import { getOwnedNfts, accountAddress } from "../ethers";
import NFTCard from './NFTCard';

export default function OwnedList() {

    const [idList, setIdList] = useState([]);

    useEffect(() => {
        handleGetOwnedNfts();
        }, []);

    async function handleGetOwnedNfts () {
        const response = await getOwnedNfts(accountAddress);
        const formattedResponse = response.map((bigNumber) => bigNumber.toNumber());
        setIdList(formattedResponse);
    }

  return (
    <section className='section owned-list-wrapper'>
          <h2>OwnedList</h2>
          <div>
            { idList.map(id => {
                return <NFTCard key={id} id={id}/>
            })}
          </div>
      </section>
  )
}
