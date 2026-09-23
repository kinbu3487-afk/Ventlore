/**
 * Chain Manifest & Configuration
 * Theo CHAIN_INTERFACE.md
 */

export interface DeploymentManifest {
  deploymentId: string;
  chainId: number;
  chainName: string;
  rpcUrl: string;
  explorerUrl: string;
  contracts: {
    registry?: `0x${string}`;
    payments?: `0x${string}`;
    contributorSbt?: `0x${string}`;
    authorNft?: `0x${string}`;
    mockErc20?: `0x${string}`;
  };
  finalityBlocks: number;
}

export const ARBITRUM_SEPOLIA_MANIFEST: DeploymentManifest = {
  deploymentId: 'dpl-arbitrum-sepolia-001',
  chainId: 421614,
  chainName: 'Arbitrum Sepolia',
  rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
  explorerUrl: 'https://sepolia.arbiscan.io',
  contracts: {},
  finalityBlocks: 64
};

export const ANVIL_LOCAL_MANIFEST: DeploymentManifest = {
  deploymentId: 'dpl-anvil-local-001',
  chainId: 31337,
  chainName: 'Anvil Local',
  rpcUrl: 'http://127.0.0.1:8545',
  explorerUrl: 'http://localhost:3000/explorer',
  contracts: {},
  finalityBlocks: 1
};
