import { ethers } from "ethers";
import React, { useEffect, useState } from "react";

import ColorABI from './abi/Color.json';
const CONTRACT_ADDRESS = "0x9D47bFa2d24b58d2DD33f46C02C936fEeE8481D3"

const App = () => {
  const [storedColor, setStoredColor] = useState("");
  const [colorValue, setColorValue] = useState("");

  const getColorContract = (ethereum: any) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, ColorABI.abi, signer);
  }

  const setColor = async () => {
    try {
      // @ts-ignore
      const { ethereum } = window;
      const colorContract = getColorContract(ethereum)

      const txn = await colorContract.set(colorValue);
      
      console.log("minting transaction..")
      await txn.wait()
      console.log("transaction succesfull!..")
      setStoredColor(colorValue);
    } catch (err) {
      console.error("failed to set color value", err);
    }
  }

  const getColor = async () => {
    try {
      // @ts-ignore
      const { ethereum } = window;
      if (ethereum) {
        const colorContract = getColorContract(ethereum)

        const currentColor = await colorContract.get();
        setStoredColor(currentColor);
      } else {
        console.log("ethereum object not found in window")
      }
    } catch (err) {
      console.error("failed to get stored color value", err)
    }
  }

  useEffect(() => {
    getColor();
  }, [])

  return (
    <div>
      <p>Current Color: {storedColor}</p>
      <input value={colorValue} onChange={({ target: { value } }) => setColorValue(value)} />
      <button onClick={setColor}>Store color on ETH</button>
    </div>
  )
}


export default App;
