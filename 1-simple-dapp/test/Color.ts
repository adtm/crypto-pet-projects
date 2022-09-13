import { expect } from "chai";
import { ethers } from "hardhat";

describe("Color", function () {

  it("should get and set color", async function () {
    const colorContractFactory = await ethers.getContractFactory("Color");
    const colorContract = await colorContractFactory.deploy();

    const expectedColor = "red"

    expect(await colorContract.get()).to.equal("");
    await colorContract.set(expectedColor)
    expect(await colorContract.get()).to.equal(expectedColor);
  });

});
