require('dotenv').config()
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    rinkbery: {
      url: process.env.RINKBERY_QUICK_NODE_URL,
      accounts: [process.env.RINKBERY_PRIVATE_KEY || "<KEY_NOT_FOUND>"]
    }
  }
};

export default config;
