import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, should } from "chai";
import { ethers } from "hardhat";
import * as crypto from "crypto";

function generateSHA256Hash(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}


describe("NewsWorthy", function () {
  async function deployNewsworthy() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Newsworthy = await ethers.getContractFactory("NewsWorthy");
    const newsworthy = await Newsworthy.deploy();

    return { newsworthy, owner, otherAccount };
  }

  describe("ERC20 Deployment", function () {
    it("Should deploy ERC20", async function () {
      const { newsworthy } = await loadFixture(deployNewsworthy);
      expect(newsworthy).to.not.be.an("undefined");
    });

  });

  describe("GitNews Deployment", function () {
    it("Should be deployed", async function () {
      const { newsworthy } = await loadFixture(deployNewsworthy);
      expect(newsworthy).to.not.be.an("undefined");
    });

  });

  describe("add", function () {
    it("Should track updates and mint tokens", async function () {
      const { newsworthy } = await loadFixture(deployNewsworthy);

      let url =
        "https://www.theguardian.com/world/2023/nov/03/blockbuster-show-on-genghis-khan-opens-in-france-after-row-with-china";

      let hash = generateSHA256Hash(url);
      await newsworthy.add(url, "0x" + hash);
      let record = await newsworthy.getRecord(url);
      expect(record).to.have.length(1);
      expect(record[0].counter).to.equal(1);

      await newsworthy.add(url, "0x" + hash);
      record = await newsworthy.getRecord(url);
      expect(record).to.have.length(1);
      expect(record[0].counter).to.equal(2);

      hash = generateSHA256Hash(hash);
      await newsworthy.add(url, "0x" + hash);
      record = await newsworthy.getRecord(url);
      expect(record).to.have.length(2);
      expect(record[0].counter).to.equal(2);
      expect(record[1].counter).to.equal(1);
    });
    // describe("Validations", function () {
    //   it("Should revert with the right error if called too soon", async function () {
    //     const { lock } = await loadFixture(deployOneYearLockFixture);

    //     await expect(lock.withdraw()).to.be.revertedWith(
    //       "You can't withdraw yet"
    //     );
    //   });

    //   it("Should revert with the right error if called from another account", async function () {
    //     const { lock, unlockTime, otherAccount } = await loadFixture(
    //       deployOneYearLockFixture
    //     );

    //     // We can increase the time in Hardhat Network
    //     await time.increaseTo(unlockTime);

    //     // We use lock.connect() to send a transaction from another account
    //     await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
    //       "You aren't the owner"
    //     );
  });

  //   it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //     const { lock, unlockTime } = await loadFixture(
  //       deployOneYearLockFixture
  //     );

  //     // Transactions are sent using the first signer by default
  //     await time.increaseTo(unlockTime);

  //     await expect(lock.withdraw()).not.to.be.reverted;
  //   });
  // });

  // describe("Events", function () {
  //   it("Should emit an event on withdrawals", async function () {
  //     const { lock, unlockTime, lockedAmount } = await loadFixture(
  //       deployOneYearLockFixture
  //     );

  //     await time.increaseTo(unlockTime);

  //     await expect(lock.withdraw())
  //       .to.emit(lock, "Withdrawal")
  //       .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
  //   });
  // });

  // describe("Transfers", function () {
  //   it("Should transfer the funds to the owner", async function () {
  //     const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
  //       deployOneYearLockFixture
  //     );

  //     await time.increaseTo(unlockTime);

  //     await expect(lock.withdraw()).to.changeEtherBalances(
  //       [owner, lock],
  //       [lockedAmount, -lockedAmount]
  //     );
  //   });
  // });
  // });
});
