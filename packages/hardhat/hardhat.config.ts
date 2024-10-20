import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import "hardhat-deploy-ethers";

// If not set, it uses the hardhat account 0 private key.
const deployerPrivateKey =
  process.env.DEPLOYER_PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
// If not set, it uses ours Etherscan default API key.
const etherscanApiKey = process.env.ETHERSCAN_API_KEY || "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW";
// forking rpc url
const forkingURL = process.env.FORKING_URL || "";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            // https://docs.soliditylang.org/en/latest/using-the-compiler.html#optimizer-options
            runs: 200,
          },
        },
      },
    ],
  },
  defaultNetwork: "localhost",
  namedAccounts: {
    deployer: {
      // By default, it will take the first Hardhat account as the deployer
      default: 0,
    },
  },
  networks: {
    // View the networks that are pre-configured.
    // If the network you are looking for is not here you can add new network settings
    hardhat: {
      forking: {
        url: forkingURL,
        enabled: process.env.MAINNET_FORKING_ENABLED === "true",
      },
    },
    mainnet: {
      url: `https://cloudflare-eth.com`,
      accounts: [deployerPrivateKey],
    },
    sepolia: {
      url: `https://rpc2.sepolia.org`,
      accounts: [deployerPrivateKey],
    },
    arbitrum: {
      url: `https://arb1.arbitrum.io/rpc`,
      accounts: [deployerPrivateKey],
    },
    arbitrumSepolia: {
      url: `https://sepolia-rollup.arbitrum.io/rpc`,
      accounts: [deployerPrivateKey],
    },
    optimism: {
      url: `https://mainnet.optimism.io`,
      accounts: [deployerPrivateKey],
    },
    optimismSepolia: {
      url: `https://sepolia.optimism.io`,
      accounts: [deployerPrivateKey],
    },
    polygon: {
      url: `https://polygon-rpc.com`,
      accounts: [deployerPrivateKey],
    },
    polygonAmoy: {
      url: `https://polygon-amoy.blockpi.network/v1/rpc/public`,
      accounts: [deployerPrivateKey],
      // chainId: 80002,
    },
    polygonMumbai: {
      url: `https://rpc.ankr.com/polygon_mumbai`,
      accounts: [deployerPrivateKey],
    },
    polygonZkEvm: {
      url: `https://zkevm-rpc.com`,
      accounts: [deployerPrivateKey],
    },
    polygonZkEvmTestnet: {
      url: `https://rpc.public.zkevm-test.net`,
      accounts: [deployerPrivateKey],
    },
    gnosis: {
      url: "https://rpc.gnosischain.com",
      accounts: [deployerPrivateKey],
    },
    chiado: {
      url: "https://rpc.chiadochain.net",
      accounts: [deployerPrivateKey],
    },
    base: {
      url: "https://mainnet.base.org",
      accounts: [deployerPrivateKey],
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [deployerPrivateKey],
    },
    scrollSepolia: {
      url: "https://sepolia-rpc.scroll.io",
      accounts: [deployerPrivateKey],
    },
    scroll: {
      url: "https://rpc.scroll.io",
      accounts: [deployerPrivateKey],
    },
    pgn: {
      url: "https://rpc.publicgoods.network",
      accounts: [deployerPrivateKey],
    },
    pgnTestnet: {
      url: "https://sepolia.publicgoods.network",
      accounts: [deployerPrivateKey],
    },
  },
  // configuration for harhdat-verify plugin
  etherscan: {
    apiKey: `${etherscanApiKey}`,
    // apiKey: process.env.POLYGONSCAN_API_KEY,
    // apiKey: {
    //   // polygon: process.env.POLYGONSCAN_API_KEY!, // Non-null assertion
    //   polygonAmoy: "7SYDGX2HH6ZCNRSEF5SP25A1NT7NYBXIKK"
    // },
    // customChains: [
    //   {
    //     network: "polygonAmoy",
    //     chainId: 80002,
    //     urls: {
    //       apiURL: "https://polygon.api.onfinality.io/public",
    //       browserURL: "https://www.oklink.com/amoy"
    //     }
    //   }
    // ]
  },
  // configuration for etherscan-verify from hardhat-deploy plugin
  verify: {
    etherscan: {
      apiKey: `${etherscanApiKey}`,
      // apiKey: "7SYDGX2HH6ZCNRSEF5SP25A1NT7NYBXIKK",
      // apiKey: {
      // polygon: process.env.POLYGONSCAN_API_KEY!, // Non-null assertion
      // polygonAmoy: process.env.POLYGONSCAN_API_KEY || '', // Default to empty string
      // },
    },
  },
  sourcify: {
    enabled: false,
  },
};

export default config;
