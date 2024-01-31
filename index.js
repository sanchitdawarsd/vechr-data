const { Alchemy, Network, Utils } = require("alchemy-sdk");
const { ethers } = require('ethers');
const EthDater = require('ethereum-block-by-date');

const config = {
    apiKey: "JO0aoHWHLdYkxMAwDQLZPC51Nv52ES2C",
    network: Network.ARB_MAINNET,
    timeout: 900000, // Set a longer timeout (300,000 milliseconds or 5 minutes)

};
const alchemy = new Alchemy(config);

const dater = new EthDater(
    alchemy.core // Ethers provider, required.
);

const main = async () => {

    // Wallet address
    const tokenid = 6566;

    // chr contract address
    const contractAddress = "0x9A01857f33aa382b1d5bb96C3180347862432B0d";

    // Set timestamp
    const timestamp = '2023-12-05T23:59:59Z'; // Ensure the day and month are zero-padded if needed


    // Get blocknumber 
    // let block = await dater.getDate(timestamp);
    // let blockNum = block['block']
    // console.log(blockNum)
    // ABI
    let abi = [
        'function locked(uint256 tokenid)'
    ];

    // Create function call data
    let iface = new ethers.utils.Interface(abi) 
    let data = iface.encodeFunctionData("locked", [9985]);

    // Get balance at a particular block -- usage of eth_call
    let balance = await alchemy.core.call({
        to: contractAddress,
        data: data,
    }, 157265056);

    console.log("Balance:",balance, "lockedchr and until");
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();