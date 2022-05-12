
const { ethers } = require("hardhat");
const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");

async function getBalance(provider, address) {
    const balanceBigInt = await provider.getBalance(address);
    return ethers.utils.formatEther(balanceBigInt);
}

async function main() {
    const contractAddress = "0xFB66F8d659a56BA41A37829Ba3D4a01d5cADD046";
    const contractABI = abi.abi;

    const provider = new ethers.providers.AlchemyProvider("rinkeby", process.env.RINKEBY_API);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log(signer.address);

    const buyMeACoffee = new ethers.Contract(contractAddress, contractABI, signer);

    console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH");
    let contractBalance = await getBalance(provider, buyMeACoffee.address);
    console.log("current balance of contract: ", contractBalance, "ETH");
    const accounts = await ethers.getSigners();
    // const tip = {value: hre.ethers.utils.parseEther("0.000001")};
    // console.log(`buying coffee`);
    // const tx1 =  await buyMeACoffee.buyCoffee("Carolina", "You're the best!", tip);
    // await tx1.wait(1);
    // contractBalance = await getBalance(provider, buyMeACoffee.address);
    // console.log("current balance of contract: ", contractBalance, "ETH");
    const tx2 = await buyMeACoffee.allowWithdrawing(accounts[0].address);
    await tx2.wait(1);
    const tx3 = await buyMeACoffee.connect(accounts[0]).withdrawTips();
    await tx3.wait(1);
    let accBal = await getBalance(provider, accounts[0].address);
    console.log(accBal);
    contractBalance = await getBalance(provider, buyMeACoffee.address);
    console.log("current balance of contract: ", contractBalance, "ETH");

    




    if (contractBalance !== "0.0") {
        console.log("withdrawing funds..");
        const withdrawTxn = await buyMeACoffee.withdrawTips();
        await withdrawTxn.wait();
    } else {
        console.log("no funds to withdraw!");
    }

    console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH");


}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })