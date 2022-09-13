require('dotenv').config()
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    rinkbery: {
      url: process.env.QUICKNODE_API,
      // @ts-ignore
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};

export default config;
