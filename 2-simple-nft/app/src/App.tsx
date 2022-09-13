import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import ColorsJSON from './abi/Colors.json';

const CONTRACT_ADDRESS = "0x725eB3341B9cC299bb2d223b8833E4848e3Ca12E"

const App = () => {
  const rinkeberyChainId = "0x4";

  const [nfts, setNFTs] = useState([]);
  const [currentAccount, setCurrentAccount] = useState("");

  const checkConnectedWallet = async () => {
    try {
      // @ts-ignore
      const { ethereum } = window;
      if (!ethereum) {
        console.error("global eth object not found in window");
      } else {

        const chainId = await ethereum.request({ method: "eth_chainId" });
        if (chainId !== rinkeberyChainId) {
          alert("you are not connnected to rinkebery testnet!");
        }

        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length !== 0) {
          setCurrentAccount(accounts[0])
          console.log("account found!", accounts[0]);
        } else {
          console.log("account not found");
        }
      }

    } catch (err) {
      console.error("failed to check for connected wallet", err)
    }
  }

  const getColorsContract = (ethereum: any) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    return new ethers.Contract(CONTRACT_ADDRESS, ColorsJSON.abi, signer);
  }

  const getNFTs = async () => {
    try {
      // @ts-ignore
      const { ethereum } = window;
      if (!ethereum) {
        console.error("global eth object not found in window");
      } else {
        const colorsContract = getColorsContract(ethereum);
        const currentTokenId = await colorsContract.tokenIds();

        // NOTE: of course, this is in case there are no burns
        const nfts = [];
        for (let i = 0; i < Number(currentTokenId._hex); i++) {
          const tokenURI = await colorsContract.tokenURI(i)
          nfts.push({ tokenId: i, data: tokenURI });
        }

        setNFTs(nfts);
      }
    } catch (err) {
      console.error("failed to get NFT's", err);
    }
  }

  useEffect(() => {
    checkConnectedWallet();
  }, [])

  useEffect(() => {
    if (currentAccount) {
      getNFTs();
      listenToMintEvents();
    }
  }, [currentAccount])

  const listenToMintEvents = async () => {
    try {
      // @ts-ignore
      const { ethereum } = window;
      if (!ethereum) {
        console.error("global eth object not found in window");
      } else {
        const colorsContract = getColorsContract(ethereum);
        colorsContract.on("MintedNFT", async (id) => {
          const tokenId = Number(id._hex)

          const tokenURI = await colorsContract.tokenURI(tokenId);
          setNFTs(nfts.concat({ tokenId, data: tokenURI }));
        })
      }
    } catch (err) {
      console.error('failed to listen to events', err);
    }
  }

  const mint = async () => {
    try {
      // @ts-ignore
      const { ethereum } = window;
      if (!ethereum) {
        console.error("global eth object not found in window");
      } else {
        const colorsContract = getColorsContract(ethereum);
        const txn = await colorsContract.mint();

        console.log('minting nft...')
        await txn.wait();
        console.log('sucessfully minted nft!');
      }
    } catch (err) {
      console.error('failed to mint NFT', err)
    }
  }

  const renderNFTS = () => nfts.map(nft => {
    const decodedJsonData = JSON.parse(atob(nft.data.split(",")[1]));
    const decodedImageData = atob(decodedJsonData.image.split(',')[1]);

    return (
      <div key={nft.tokenId} style={{ margin: 10 }}>
        <div>tokenId: {nft.tokenId}</div>
        <div style={{ height: 300, width: 300 }} dangerouslySetInnerHTML={{ __html: decodedImageData }}></div>
      </div>
    )
  })

  const connectWaller = async () => {
    try {
      // @ts-ignore
      const { ethereum } = window;
      if (!ethereum) {
        console.error("global eth object not found in window");
      } else {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        console.log("connected", accounts[0]);
        setCurrentAccount(accounts[0])
      }
    } catch (err) {
      console.error("failed to connect wallet", err)
    }
  }

  const renderConnectWallet = () => (
    <button onClick={connectWaller}>Connect Wallet</button>
  )

  return (
    <div>
      {
        currentAccount ? <>
          <button onClick={mint}>Mint NFT</button>
          {renderNFTS()}
        </> : renderConnectWallet()
      }
    </div>
  );
}

export default App;
