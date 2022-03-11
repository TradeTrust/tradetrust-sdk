import { Static, String, Literal, Record, Union } from "runtypes";

export const RecordTypesT = Literal("openatts");

export const BlockchainNetworkT = Union(
  Literal("ethereum"),
  Literal("hedera")
);

export const HederaAddressT = String.withConstraint((maybeAddress: string) => {
  return /0.0.[0-9]{8,12}|/.test(maybeAddress) || `${maybeAddress} is not a valid hedera address`;
});

export enum HederaNetworks {
  mainnet = "1",
  testnet = "3",
}

export const HederaNetworkIdT = Union(
  Literal(HederaNetworks.mainnet),
  Literal(HederaNetworks.testnet)
);

export const OpenAttestationDNSTextRecordT = Record({
  type: RecordTypesT,
  net: BlockchainNetworkT, // key names are directly lifted from the dns-txt record format
  netId: HederaNetworkIdT, // they are abbreviated because of 255 char constraint on dns-txt records
  addr: HederaAddressT,
});

export type BlockchainNetwork = Static<typeof BlockchainNetworkT>;
export type HederaAddress = Static<typeof HederaAddressT>;
export type OpenAttestationDNSTextRecord = Static<typeof OpenAttestationDNSTextRecordT>;
export type RecordTypes = Static<typeof RecordTypesT>;
