const { Alchemy, Network } = require("alchemy-sdk");
const { ethers } = require('ethers');
const fs = require('fs');
const { BigNumber } = require('ethers');


const config = {
    apiKey: "HnZD2JznEg0TvSdDvtgBjxbXdk5j8-yX",
    network: Network.ARB_MAINNET,
    timeout: 900000, // Set a longer timeout (300,000 milliseconds or 5 minutes)
};
const alchemy = new Alchemy(config);

const main = async () => {
    const contractAddress = "0x9A01857f33aa382b1d5bb96C3180347862432B0d";
    const dataArr = [];
    let arr= [86,103,121,122,135,137,155,170,188,194,195,201,245,489]
    // Loop through NFT token IDs from 1 to 10
    for (let tokenId = 0; tokenId <= 14; tokenId++) {
         
        console.log("Processing Token ID:", arr[tokenId]);

        const lockedabi = ['function locked(uint256 _tokenId) view returns (int128,uint)']
        const ownerabi = ['function ownerOf(uint256 _tokenId) view returns (address)'];

        const iface = new ethers.utils.Interface(lockedabi);
        const ifaceowner = new ethers.utils.Interface(ownerabi);

        const data = iface.encodeFunctionData("locked", [arr[tokenId]]);
        const ownerData = ifaceowner.encodeFunctionData("ownerOf", [arr[tokenId]]);

        try {
            // Get locked at a particular block using eth_call
            const lockedResponse = await alchemy.core.call({
                to: contractAddress,
                data: data,
            }, 157265056);

            // Get owner at a particular block using eth_call
            const ownerDataResponse = await alchemy.core.call({
                to: contractAddress,
                data: ownerData,
            }, 157265056);

            const owner = ifaceowner.decodeFunctionResult("ownerOf", ownerDataResponse);
            const locked = iface.decodeFunctionResult("locked", lockedResponse);

            dataArr.push({ tokenId: arr[tokenId], owner: owner, lockedChr: BigNumber.from(locked[0]).toString() , lockedUntill:BigNumber.from(locked[1]).toString() }); // Convert locked to string
            fs.writeFileSync('venftdata.json', JSON.stringify(dataArr, null, 2), 'utf-8');
            console.log(`Token ID: ${arr[tokenId]}, lockedChr: ${BigNumber.from(locked[0]).toString()} , lockedUntill: ${BigNumber.from(locked[1]).toString()} , Owner: ${owner}`);
        } catch (error) {
            console.error(`Error processing Token ID ${tokenId}:`, error);
        }
    }

    // Write data to a JSON file
  //  fs.writeFileSync('nft_data.json', JSON.stringify(dataArr, null, 2), 'utf-8');
    console.log('Data written to venftdata.json');
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

runMain();



