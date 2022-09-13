import { expect } from "chai";
import { ethers } from "hardhat";

describe("Colors", function () {

  it("should mint an NFT", async () => {
    const colorsContractFactory = await ethers.getContractFactory("Colors");
    const colorContract = await colorsContractFactory.deploy()

    let tokenIds = await colorContract.tokenIds();
    expect(tokenIds.toNumber()).eq(0);

    const txn = await colorContract.mint();
    await txn.wait();

    tokenIds = await colorContract.tokenIds();
    expect(tokenIds.toNumber()).eq(1);
  })

  it("tokenURI should include Base64 encoded data", async () => {
    const colorsContractFactory = await ethers.getContractFactory("Colors");
    const colorContract = await colorsContractFactory.deploy()

    const toMintTokenId = 0;
    const txn = await colorContract.mint();
    await txn.wait();

    const tokenURI = await colorContract.tokenURI(toMintTokenId);
    expect(tokenURI.indexOf("base64")).not.eq(0);
  })

  it("should mint multiple nfts", async () => {
    const colorsContractFactory = await ethers.getContractFactory("Colors");
    const colorContract = await colorsContractFactory.deploy()

    let txn = await colorContract.mint();
    await txn.wait();

    txn = await colorContract.mint();
    await txn.wait();
  });

});
