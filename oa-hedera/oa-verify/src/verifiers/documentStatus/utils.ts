import { utils } from "@govtechsg/open-attestation";
// import { DocumentStore } from "@tianhr/hedera-document-store";
// import { errors, providers } from "ethers";
import { errors } from "ethers";
import { DocumentStoreFactory,addressToContractId } from "@tianhr/hedera-document-store";
import { Hash } from "../../types/core";
import {
  OpenAttestationHederaDocumentStoreStatusCode,
  OpenAttestationDidSignedDocumentStatusCode,
} from "../../types/error";
import { CodedError } from "../../common/error";
import { OcspResponderRevocationReason, RevocationStatus } from "./revocation.types";
import axios from "axios";
import { ValidOcspResponse, ValidOcspResponseRevoked } from "./didSigned/didSignedDocumentStatus.type";
import { Client } from "@hashgraph/sdk";

export const getIntermediateHashes = (targetHash: Hash, proofs: Hash[] = []) => {
  const hashes = [`0x${targetHash}`];
  proofs.reduce((prev, curr) => {
    const next = utils.combineHashString(prev, curr);
    hashes.push(`0x${next}`);
    return next;
  }, targetHash);
  return hashes;
};

export const getGas = () => {
  return 750000;
};

/**
 * Try to decode the error to see if we can deterministically tell if the document has NOT been issued or revoked.
 *
 * In case where we cannot tell, we throw an error
 * */
export const decodeError = (error: any) => {
  const reason = error.reason && Array.isArray(error.reason) ? error.reason[0] : error.reason ?? "";
  switch (true) {
    case !error.reason &&
      (error.method?.toLowerCase() === "isRevoked(bytes32)".toLowerCase() ||
        error.method?.toLowerCase() === "isIssued(bytes32)".toLowerCase()) &&
      error.code === errors.CALL_EXCEPTION:
      return "Contract is not found";
    case reason.toLowerCase() === "ENS name not configured".toLowerCase() &&
      error.code === errors.UNSUPPORTED_OPERATION:
      return "ENS name is not configured";
    case reason.toLowerCase() === "bad address checksum".toLowerCase() && error.code === errors.INVALID_ARGUMENT:
      return "Bad document store address checksum";
    case error.message?.toLowerCase() === "name not found".toLowerCase():
      return "ENS name is not found";
    case reason.toLowerCase() === "invalid address".toLowerCase() && error.code === errors.INVALID_ARGUMENT:
      return "Invalid document store address";
    case error.code === errors.INVALID_ARGUMENT:
      return "Invalid call arguments";
    case error.code === errors.SERVER_ERROR:
      throw new CodedError(
        "Unable to connect to the Hedera network, please try again later",
        OpenAttestationHederaDocumentStoreStatusCode.SERVER_ERROR,
        OpenAttestationHederaDocumentStoreStatusCode[OpenAttestationHederaDocumentStoreStatusCode.SERVER_ERROR]
      );
    default:
      throw error;
  }
};

/**
 * Given a list of hashes, check against one smart contract if any of the hash has been revoked
 * */
export const isAnyHashRevoked = async (smartContract: DocumentStoreFactory, intermediateHashes: Hash[]) => {
  const revokedStatusDeferred = intermediateHashes.map((hash) =>
    smartContract.isRevoked(hash, getGas()).then((status) => (status ? hash : undefined))
  );
  const revokedStatuses = await Promise.all(revokedStatusDeferred);
  return revokedStatuses.find((hash) => hash);
};

export const isRevokedByOcspResponder = async ({
  certificateId,
  location,
}: {
  certificateId: string;
  location: string;
}): Promise<RevocationStatus> => {
  const { data } = await axios.get(`${location}/${certificateId}`);

  if (ValidOcspResponseRevoked.guard(data) && data.certificateStatus === "revoked") {
    const { reasonCode } = data;
    return {
      revoked: true,
      address: location,
      reason: {
        message: OcspResponderRevocationReason[reasonCode],
        code: reasonCode,
        codeString: OcspResponderRevocationReason[reasonCode],
      },
    };
  } else if (ValidOcspResponse.guard(data) && data.certificateStatus !== "revoked") {
    return {
      revoked: false,
      address: location,
    };
  }

  throw new CodedError(
    "oscp response invalid",
    OpenAttestationDidSignedDocumentStatusCode.OCSP_RESPONSE_INVALID,
    "OCSP_RESPONSE_INVALID"
  );
};

export const isRevokedOnDocumentStore = async ({
  documentStore,
  merkleRoot,
  client,
  targetHash,
  proofs,
}: {
  documentStore: string;
  merkleRoot: string;
  client: Client;
  targetHash: Hash;
  proofs?: Hash[];
}): Promise<RevocationStatus> => {
  try {
    const documentStoreContract = new DocumentStoreFactory(client, addressToContractId(documentStore));
    const intermediateHashes = getIntermediateHashes(targetHash, proofs);
    const revokedHash = await isAnyHashRevoked(documentStoreContract, intermediateHashes);

    return revokedHash
      ? {
          revoked: true,
          address: documentStore,
          reason: {
            message: `Document ${merkleRoot} has been revoked under contract ${documentStore}`,
            code: OpenAttestationHederaDocumentStoreStatusCode.DOCUMENT_REVOKED,
            codeString:
              OpenAttestationHederaDocumentStoreStatusCode[
                OpenAttestationHederaDocumentStoreStatusCode.DOCUMENT_REVOKED
              ],
          },
        }
      : {
          revoked: false,
          address: documentStore,
        };
  } catch (error) {
    // If error can be decoded and it's because of document is not revoked, we return false
    // Else allow error to continue to bubble up
    return {
      revoked: true,
      address: documentStore,
      reason: {
        message: decodeError(error),
        code: OpenAttestationHederaDocumentStoreStatusCode.DOCUMENT_REVOKED,
        codeString:
          OpenAttestationHederaDocumentStoreStatusCode[
            OpenAttestationHederaDocumentStoreStatusCode.DOCUMENT_REVOKED
          ],
      },
    };
  }
};
