/**
 * Key Derivation Implementation for Ventlore v0.3
 * Tuân thủ tuyệt đối quy định tại docs/ID_CONTRACT.md & Ventlore_Logic_ID_DB_v0_3.pdf Mục 15.
 */

import { encodeAbiParameters, keccak256, toHex, stringToBytes } from 'viem';

// APP_NAMESPACE = keccak256(UTF8("VENTLORE_V1"))
export const APP_NAMESPACE = keccak256(stringToBytes('VENTLORE_V1'));

// RECEIPT_DOMAIN = keccak256(UTF8("VENTLORE_RECEIPT_V1"))
export const RECEIPT_DOMAIN = keccak256(stringToBytes('VENTLORE_RECEIPT_V1'));

export const VALID_KEY_KINDS = [
  'post',
  'revision',
  'claim',
  'route',
  'donation-request',
  'payable',
  'credential',
  'collectible',
  'region',
  'reason'
] as const;

export type KeyKind = (typeof VALID_KEY_KINDS)[number];

/**
 * Chuyển chuỗi UUID canonical (có dấu gạch ngang) thành 16 bytes nhị phân thực tế (hex string 0x...).
 */
export function uuidToBytes16(uuidStr: string): `0x${string}` {
  const clean = uuidStr.replace(/-/g, '').toLowerCase();
  if (clean.length !== 32 || !/^[0-9a-f]{32}$/.test(clean)) {
    throw new Error(`Định dạng UUID không hợp lệ: ${uuidStr}`);
  }
  return `0x${clean}` as `0x${string}`;
}

/**
 * entityKey(kind, uuid) = keccak256(abi.encode(APP_NAMESPACE, kind, bytes16(uuid)))
 * ABI types: bytes32, string, bytes16
 */
export function deriveEntityKey(kind: KeyKind, uuidStr: string): `0x${string}` {
  if (!VALID_KEY_KINDS.includes(kind)) {
    throw new Error(`Loại keyKind không hợp lệ: ${kind}`);
  }
  const bytes16Uuid = uuidToBytes16(uuidStr);

  const encoded = encodeAbiParameters(
    [
      { type: 'bytes32', name: 'namespace' },
      { type: 'string', name: 'kind' },
      { type: 'bytes16', name: 'uuid' }
    ],
    [APP_NAMESPACE, kind, bytes16Uuid]
  );

  return keccak256(encoded);
}

/**
 * receiptKey = keccak256(abi.encode(RECEIPT_DOMAIN, chainId, splitterAddress, donorAddress, requestKey))
 * ABI types: bytes32, uint256, address, address, bytes32
 */
export function deriveReceiptKey(
  chainId: bigint,
  splitterAddress: `0x${string}`,
  donorAddress: `0x${string}`,
  requestKey: `0x${string}`
): `0x${string}` {
  const encoded = encodeAbiParameters(
    [
      { type: 'bytes32', name: 'domain' },
      { type: 'uint256', name: 'chainId' },
      { type: 'address', name: 'splitterAddress' },
      { type: 'address', name: 'donorAddress' },
      { type: 'bytes32', name: 'requestKey' }
    ],
    [RECEIPT_DOMAIN, chainId, splitterAddress, donorAddress, requestKey]
  );

  return keccak256(encoded);
}

/**
 * NFT tokenId = uint256(collectibleKey)
 * SBT tokenId = uint256(credentialKey)
 */
export function keyToTokenId(key: `0x${string}`): bigint {
  return BigInt(key);
}
