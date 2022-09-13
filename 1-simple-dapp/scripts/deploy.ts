import { ethers } from "hardhat";

async function main() {
  const colorContractFactory = await ethers.getContractFactory("Color");
  const colorContract = await colorContractFactory.deploy();

  console.log(`Color contract has been deployed, addr: ${colorContract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
