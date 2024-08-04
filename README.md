# term-finance-scripts

To use the place-order script ... would recommend creating a .env file with the necessary environment variables before running `yarn env-cmd -f .env ts-node scripts/place-order.ts`. This will generate a signature as well as order meta. 

NOTE: Both sides must approve their tokens to be spent by the ERC20Proxy contract from 0x. The ERC20Proxy is the designated 0x smart contract to transfer funds between order participants.

 This order can then be filled by calling `fillOrder` on Etherscan.
