import { getEnv } from "./utils";


import { signatureUtils, orderHashUtils, assetDataUtils } from '@0x/order-utils';
import { Web3ProviderEngine, RPCSubprovider, PrivateKeyWalletSubprovider } from '@0x/subproviders';

import { Web3Wrapper } from '@0x/web3-wrapper';
import { Order } from '@0x/types';
import { utils } from "ethers";
import dayjs from 'dayjs';
import { BigNumber } from "@0x/utils";

const makerAddress = getEnv("MAKER_ADDRESS");
const takerAddress = getEnv("TAKER_ADDRESS");
const makerTokenAssetAddress = getEnv("MAKER_ASSET_TOKEN_ADDRESS");
const takerTokenAssetAddress = getEnv("TAKER_ASSET_TOKEN_ADDRESS");
const makerAssetAmount = getEnv("MAKER_ASSET_AMOUNT");
const takerAssetAmount = getEnv("TAKER_ASSET_AMOUNT");
const expirationTimeSeconds = getEnv("EXPIRATION_TIME_SECONDS");
const exchangeAddress = getEnv("EXCHANGE_ADDRESS");
const mainnetRpcUrl = getEnv("MAINNET_RPC");
const deployerWallet = getEnv("DEPLOYER_WALLET");


async function main() { 
    // Set up the provider engine
    const providerEngine = new Web3ProviderEngine();
    providerEngine.addProvider(new PrivateKeyWalletSubprovider(deployerWallet));
    providerEngine.addProvider(new RPCSubprovider(mainnetRpcUrl));
    providerEngine.start();

    // Create a Web3Wrapper instance
    const web3Wrapper = new Web3Wrapper(providerEngine);

    const dayTimestamp = dayjs().add(Number(expirationTimeSeconds), 'seconds').unix();

  
        // Define the order
    const order: Order = {
        makerAddress,  // Maker's address
        takerAddress,  // Taker's address
        makerAssetAmount: new BigNumber(makerAssetAmount),  // Amount the maker is selling
        takerAssetAmount: new BigNumber(takerAssetAmount),  // Amount the taker is buying
        makerFee: new BigNumber(0),
        takerFee: new BigNumber(0),
        expirationTimeSeconds: new BigNumber(dayTimestamp), // 1 hour from now
        exchangeAddress,
        chainId: 1, // Replace with the appropriate chain ID
        senderAddress: '0x0000000000000000000000000000000000000000', // Default to zero address
        salt: new BigNumber(utils.hexlify(utils.randomBytes(32))), // Replace with the appropriate salt
        makerAssetData: assetDataUtils.encodeERC20AssetData(makerTokenAssetAddress), // Replace with the appropriate maker asset data
        takerAssetData: assetDataUtils.encodeERC20AssetData(takerTokenAssetAddress), // Replace with the appropriate taker asset data
        feeRecipientAddress: makerAddress, // Replace with the appropriate fee recipient address
        makerFeeAssetData: '0x', // Replace with the appropriate maker fee asset data
        takerFeeAssetData: '0x', // Replace with the appropriate taker fee asset data
    };

    // Get the order hash
    const orderHashHex = orderHashUtils.getOrderHash(order);

    // Sign the order hash
    const signature = await signatureUtils.ecSignHashAsync(web3Wrapper.getProvider(), orderHashHex, makerAddress);
    const signedOrder = {
        ...order,
        signature,
    };
    console.log("signature: " + signature)
    console.log("signedOrder: " + JSON.stringify(signedOrder));
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});


// Store signedOrder somewhere (e.g., database, blockchain, etc.)
