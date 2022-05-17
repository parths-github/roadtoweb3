const { ethers } = require("hardhat");


const main = async() => {
    const ChainBattelsFactory = await ethers.getContractFactory("ChainBattels");
    console.log("Deploying...")
    const chainBattels = await ChainBattelsFactory.deploy();
    await chainBattels.deployed();
    console.log(`Chain Battles Contract deployed to: ${chainBattels.address}`);

    console.log(`Verify with: /n npx hardhat verify --network mumbai ${chainBattels.address}`);

    // When deploying to real chain we have to give the gas value for any txns

    const [owner, acc1, acc2, acc3] = await ethers.getSigners();
    console.log("Let's mint some NFT")
    const tx = await chainBattels.mint();
    const receipt = await tx.wait(1);
    let tokenId = receipt.events[0].topics[3];
    console.log(`TokenURI of TokenId#${tokenId}: ${await chainBattels.tokenURI(tokenId)}`);
    console.log("Let's train it")
    const tx1 = await chainBattels.train(tokenId);
    const receipt1 = await tx1.wait(1);
    console.log(`TokenURI of TokenId#${tokenId}: ${await chainBattels.tokenURI(tokenId)}`);
    console.log("Let's mint other one");
    const tx2 = await chainBattels.connect(acc1).mint();
    const receipt2 = await tx2.wait(1);
    tokenId = receipt2.events[0].topics[3];
    console.log(`TokenURI of TokenId#${tokenId}: ${await chainBattels.tokenURI(tokenId)}`);
    console.log("Let's train it")
    const tx3 = await chainBattels.connect(acc1).train(tokenId);
    const receipt3 = await tx3.wait(1);
    console.log(`TokenURI of TokenId#${tokenId}: ${await chainBattels.tokenURI(tokenId)}`);
    console.log("Let's train it")
    const tx4 = await chainBattels.connect(acc1).train(tokenId);
    const receipt4 = await tx4.wait(1);
    console.log(`TokenURI of TokenId#${tokenId}: ${await chainBattels.tokenURI(tokenId)}`);


}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    })