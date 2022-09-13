import { ethers } from "hardhat";

async function main() {
  const colorsContractFactory = await ethers.getContractFactory("Colors");
  const colorContract = await colorsContractFactory.deploy();

  const token = await colorContract.deployed();
  console.log(`contract has been deployed, addr: ${token.address}`)
}

// addr: 0xad8BC5BE9613103BBf3146218E7a3CbC903Ec432
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
