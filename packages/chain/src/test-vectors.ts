/**
 * Test Vectors for Ventlore v0.3
 * Tạo mới từ đặc tả docs/ID_CONTRACT.md để kiểm thử độc lập cho TS và Solidity.
 */

export interface EntityKeyVector {
  kind: string;
  uuid: string;
  expectedBytes16: string;
  note: string;
}

export const SAMPLE_UUIDS = {
  post: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e6f',
  revision: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e70',
  claim: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e71',
  route: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e72',
  donationRequest: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e73',
  payable: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e74',
  credential: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e75',
  collectible: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e76',
  region: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e77',
  reason: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e78'
};

export const SAMPLE_RECEIPT_CONTEXT = {
  chainId: 421614n,
  splitterAddress: '0x1111111111111111111111111111111111111111' as `0x${string}`,
  donorAddress: '0x2222222222222222222222222222222222222222' as `0x${string}`
};
