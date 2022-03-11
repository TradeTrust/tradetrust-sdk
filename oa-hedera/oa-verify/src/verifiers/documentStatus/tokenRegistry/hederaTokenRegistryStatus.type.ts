import { Array as RunTypesArray, Literal, Record, Static, String, Union } from "runtypes";
import {
  ErrorVerificationFragment,
  InvalidVerificationFragment,
  SkippedVerificationFragment,
  ValidVerificationFragment,
} from "../../../types/core";
import { Reason } from "../../../types/error";

/**
 * Token registry mint status
 */
export const ValidTokenRegistryStatus = Record({
  minted: Literal(true),
  address: String,
});
export type ValidTokenRegistryStatus = Static<typeof ValidTokenRegistryStatus>;

export const InvalidTokenRegistryStatus = Record({
  minted: Literal(false),
  address: String,
  reason: Reason,
});
export type InvalidTokenRegistryStatus = Static<typeof InvalidTokenRegistryStatus>;

/**
 * Data for v2 Fragments
 */
export const ValidTokenRegistryDataV2 = Record({
  mintedOnAll: Literal(true),
  details: RunTypesArray(ValidTokenRegistryStatus),
});
export type ValidTokenRegistryDataV2 = Static<typeof ValidTokenRegistryDataV2>;

export const InvalidTokenRegistryDataV2 = Record({
  mintedOnAll: Literal(false),
  details: RunTypesArray(Union(ValidTokenRegistryStatus, InvalidTokenRegistryStatus)),
});
export type InvalidTokenRegistryDataV2 = Static<typeof InvalidTokenRegistryDataV2>;

/**
 * Data for v3 Fragments
 */
export const ValidTokenRegistryDataV3 = Record({
  mintedOnAll: Literal(true),
  details: ValidTokenRegistryStatus,
});
export type ValidTokenRegistryDataV3 = Static<typeof ValidTokenRegistryDataV3>;

export const InvalidTokenRegistryDataV3 = Record({
  mintedOnAll: Literal(false),
  details: InvalidTokenRegistryStatus,
});
export type InvalidTokenRegistryDataV3 = Static<typeof InvalidTokenRegistryDataV3>;

/**
 * Fragments
 */
export type OpenAttestationHederaTokenRegistryStatusValidFragmentV2 = ValidVerificationFragment<ValidTokenRegistryDataV2>;
export type OpenAttestationHederaTokenRegistryStatusValidFragmentV3 = ValidVerificationFragment<ValidTokenRegistryDataV3>;
export type OpenAttestationHederaTokenRegistryStatusInvalidFragmentV2 = InvalidVerificationFragment<InvalidTokenRegistryDataV2>;
export type OpenAttestationHederaTokenRegistryStatusInvalidFragmentV3 = InvalidVerificationFragment<InvalidTokenRegistryDataV3>;
export type OpenAttestationHederaTokenRegistryStatusErrorFragment = ErrorVerificationFragment<any>;

export type OpenAttestationHederaTokenRegistryStatusFragment =
  | OpenAttestationHederaTokenRegistryStatusValidFragmentV2
  | OpenAttestationHederaTokenRegistryStatusValidFragmentV3
  | OpenAttestationHederaTokenRegistryStatusInvalidFragmentV2
  | OpenAttestationHederaTokenRegistryStatusInvalidFragmentV3
  | OpenAttestationHederaTokenRegistryStatusErrorFragment
  | SkippedVerificationFragment;
