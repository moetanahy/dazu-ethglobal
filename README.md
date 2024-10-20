# DAZU Business Invoicing Platform

The goal of this project is to create a business invoicing platform that allows users to create, send, and manage invoices as a business on Web3.

## Tag Line

The Decentralized Business Invoicing Platform

## Tech Stack Plan

- IDE/Plumbing
	- https://scaffoldeth.io/ **USED**
	- Hardhat - **USED**
- Dynamic for Wallets? (or am I using the Circle Wallet SDK)
	- https://www.dynamic.xyz/ - **INTEGRATED**
- ENS for name service - **INTEGRATED**
	- https://ens.domains/
	- https://docs.ens.domains/web/subdomains
	- For Sure
- Smart contracts on Polygon Blockchain - **INTEGRATED**
- Walrus (for data storage)  **INTEGRATED**
- Circle for USDc, EURc - **PARTIALLY INTEGRATED**
- Unlimit for on/off ramps - **NOT COMPLETE**
- Delv (Hyperdrive) for the AMM -  **NOT COMPLETE**
- Chronicle for real exchange rates - **NOT COMPLETE**


## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Install dependencies if it was skipped in CLI:

```
cd dazu-ethglobal
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

3. On a second terminal, deploy the test contract to the test environment

```
yarn deploy
```

4. On a third terminal, start your NextJS app:

```
yarn start
```

## Deploy on Polygon

Used instructions from here - https://docs.scaffoldeth.io/deploying/deploy-smart-contracts

```
yarn deploy --network polyAmoly
```

## Deployment

Polygon deployer on Amoy

Public key: 0x4C3fbd96888A2A6912eF2db5f1747A2C59b7821C

