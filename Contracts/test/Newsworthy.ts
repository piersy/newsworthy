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
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deplyNewsworthy() {
    // const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    // const ONE_GWEI = 1_000_000_000;

    // const lockedAmount = ONE_GWEI;
    // const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Newsworthy = await ethers.getContractFactory("NewsWorthy");
    const newsworthy = await Newsworthy.deploy();

    return { newsworthy, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should be deployed", async function () {
      const { newsworthy } = await loadFixture(deplyNewsworthy);
      expect(newsworthy).to.not.be.an("undefined");
    });

    // it("Should set the right owner", async function () {
    //   const { lock, owner } = await loadFixture(deployOneYearLockFixture);

    //   expect(await lock.owner()).to.equal(owner.address);
    // });

    // it("Should receive and store the funds to lock", async function () {
    //   const { lock, lockedAmount } = await loadFixture(
    //     deployOneYearLockFixture
    //   );

    //   expect(await ethers.provider.getBalance(lock.target)).to.equal(
    //     lockedAmount
    //   );
    // });

    // it("Should fail if the unlockTime is not in the future", async function () {
    //   // We don't use the fixture here because we want a different deployment
    //   const latestTime = await time.latest();
    //   const Lock = await ethers.getContractFactory("Lock");
    //   await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
    //     "Unlock time should be in the future"
    //   );
    // });
  });

  describe("add", function () {
    it("Should track updates", async function () {
      const { newsworthy } = await loadFixture(deplyNewsworthy);

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
