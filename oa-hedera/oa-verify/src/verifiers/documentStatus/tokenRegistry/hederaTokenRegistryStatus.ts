import { getData, utils, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { TradeTrustERC721Factory, addressToContractId } from "@tianhr/hedera-token-registry";
import { constants, errors } from "ethers";
import { VerificationFragmentType, Verifier } from "../../../types/core";
import { OpenAttestationHederaTokenRegistryStatusCode } from "../../../types/error";
import { CodedError } from "../../../common/error";
import { withCodedErrorHandler } from "../../../common/errorHandler";
import {
  InvalidTokenRegistryStatus,
  OpenAttestationHederaTokenRegistryStatusFragment,
  ValidTokenRegistryStatus,
} from "./hederaTokenRegistryStatus.type";
import { Client } from "@hashgraph/sdk";
import BigNumber from "bignumber.js";
import { getGas } from "../utils";

type VerifierType = Verifier<OpenAttestationHederaTokenRegistryStatusFragment>;

const name = "OpenAttestationHederaTokenRegistryStatus";
const type: VerificationFragmentType = "DOCUMENT_STATUS";

export const getTokenRegistry = (
  document: WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>
): string => {
  if (utils.isWrappedV2Document(document)) {
    const { issuers } = getData(document);
    if (issuers.length !== 1)
      throw new CodedError(
        "Only one issuer is allowed for tokens",
        OpenAttestationHederaTokenRegistryStatusCode.INVALID_ISSUERS,
        OpenAttestationHederaTokenRegistryStatusCode[OpenAttestationHederaTokenRegistryStatusCode.INVALID_ISSUERS]
      );
    if (!issuers[0].tokenRegistry)
      throw new CodedError(
        "Token registry is undefined",
        OpenAttestationHederaTokenRegistryStatusCode.UNDEFINED_TOKEN_REGISTRY,
        OpenAttestationHederaTokenRegistryStatusCode[
          OpenAttestationHederaTokenRegistryStatusCode.UNDEFINED_TOKEN_REGISTRY
        ]
      );
    return issuers[0].tokenRegistry;
  }

  if (utils.isWrappedV3Document(document)) {
    if (!document.openAttestationMetadata.proof.value)
      throw new CodedError(
        "Token registry is undefined",
        OpenAttestationHederaTokenRegistryStatusCode.UNDEFINED_TOKEN_REGISTRY,
        OpenAttestationHederaTokenRegistryStatusCode[
          OpenAttestationHederaTokenRegistryStatusCode.UNDEFINED_TOKEN_REGISTRY
        ]
      );
    return document.openAttestationMetadata.proof.value;
  }

  throw new CodedError(
    `Document does not match either v2 or v3 formats. Consider using \`utils.diagnose\` from open-attestation to find out more.`,
    OpenAttestationHederaTokenRegistryStatusCode.UNRECOGNIZED_DOCUMENT,
    OpenAttestationHederaTokenRegistryStatusCode[OpenAttestationHederaTokenRegistryStatusCode.UNRECOGNIZED_DOCUMENT]
  );
};

const getMerkleRoot = (
  document: WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>
): string => {
  if (utils.isWrappedV2Document(document)) return `0x${document.signature.merkleRoot}`;
  else if (utils.isWrappedV3Document(document)) return `0x${document.proof.merkleRoot}`;
  throw new CodedError(
    `Document does not match either v2 or v3 formats. Consider using \`utils.diagnose\` from open-attestation to find out more.`,
    OpenAttestationHederaTokenRegistryStatusCode.UNRECOGNIZED_DOCUMENT,
    OpenAttestationHederaTokenRegistryStatusCode[OpenAttestationHederaTokenRegistryStatusCode.UNRECOGNIZED_DOCUMENT]
  );
};

const isNonExistentToken = (error: any) => {
  const message: string | undefined = error.message;
  if (!message) return false;
  return message.includes("owner query for nonexistent token");
};
const isMissingTokenRegistry = (error: any) => {
  return (
    !error.reason &&
    error.method?.toLowerCase() === "ownerOf(uint256)".toLowerCase() &&
    error.code === errors.CALL_EXCEPTION
  );
};
const decodeError = (error: any) => {
  const reason = error.reason && Array.isArray(error.reason) ? error.reason[0] : error.reason ?? "";
  switch (true) {
    case isNonExistentToken(error):
      return `Document has not been issued under token registry`;
    case isMissingTokenRegistry(error):
      return `Token registry is not found`;
    case reason.toLowerCase() === "ENS name not configured".toLowerCase() &&
      error.code === errors.UNSUPPORTED_OPERATION:
      return "ENS name is not configured";
    case reason.toLowerCase() === "invalid address".toLowerCase() && error.code === errors.INVALID_ARGUMENT:
      return `Invalid token registry address`;
    case error.code === errors.INVALID_ARGUMENT:
      return `Invalid contract arguments`;
    case error.code === errors.SERVER_ERROR:
      throw new CodedError(
        "Unable to connect to the Hedera network, please try again later",
        OpenAttestationHederaTokenRegistryStatusCode.SERVER_ERROR,
        OpenAttestationHederaTokenRegistryStatusCode[OpenAttestationHederaTokenRegistryStatusCode.SERVER_ERROR]
      );
    default:
      throw error;
  }
};

export const isTokenMintedOnRegistry = async ({
  tokenRegistry,
  merkleRoot,
  client,
}: {
  tokenRegistry: string;
  merkleRoot: string;
  client: Client;
}): Promise<ValidTokenRegistryStatus | InvalidTokenRegistryStatus> => {
  try {
    const tokenRegistryContract = new TradeTrustERC721Factory(client, addressToContractId(tokenRegistry));
    const minted = await tokenRegistryContract
      .ownerOf(new BigNumber(merkleRoot), getGas())
      .then((owner) => !(owner.toString() === constants.AddressZero));
    return minted
      ? { minted, address: tokenRegistry }
      : {
          minted,
          address: tokenRegistry,
          reason: {
            code: OpenAttestationHederaTokenRegistryStatusCode.DOCUMENT_NOT_MINTED,
            codeString:
              OpenAttestationHederaTokenRegistryStatusCode[
                OpenAttestationHederaTokenRegistryStatusCode.DOCUMENT_NOT_MINTED
              ],
            message: `Document ${merkleRoot} has not been issued under contract ${tokenRegistry}`,
          },
        };
  } catch (error) {
    return {
      minted: false,
      address: tokenRegistry,
      reason: {
        message: decodeError(error),
        code: OpenAttestationHederaTokenRegistryStatusCode.DOCUMENT_NOT_MINTED,
        codeString:
          OpenAttestationHederaTokenRegistryStatusCode[
            OpenAttestationHederaTokenRegistryStatusCode.DOCUMENT_NOT_MINTED
          ],
      },
    };
  }
};

const skip: VerifierType["skip"] = async () => {
  return {
    status: "SKIPPED",
    type,
    name,
    reason: {
      code: OpenAttestationHederaTokenRegistryStatusCode.SKIPPED,
      codeString: OpenAttestationHederaTokenRegistryStatusCode[OpenAttestationHederaTokenRegistryStatusCode.SKIPPED],
      message: `Document issuers doesn't have "tokenRegistry" property or ${v3.Method.TokenRegistry} method`,
    },
  };
};

const test: VerifierType["test"] = (document) => {
  if (utils.isWrappedV2Document(document)) {
    const documentData = getData(document);
    return documentData.issuers.some((issuer) => "tokenRegistry" in issuer);
  } else if (utils.isWrappedV3Document(document)) {
    return document.openAttestationMetadata.proof.method === v3.Method.TokenRegistry;
  }
  return false;
};

// TODO split
const verify: VerifierType["verify"] = async (document, options) => {
  if (!utils.isWrappedV3Document(document) && !utils.isWrappedV2Document(document))
    throw new CodedError(
      `Document does not match either v2 or v3 formats. Consider using \`utils.diagnose\` from open-attestation to find out more.`,
      OpenAttestationHederaTokenRegistryStatusCode.UNRECOGNIZED_DOCUMENT,
      OpenAttestationHederaTokenRegistryStatusCode[OpenAttestationHederaTokenRegistryStatusCode.UNRECOGNIZED_DOCUMENT]
    );
  const tokenRegistry = getTokenRegistry(document);
  const merkleRoot = getMerkleRoot(document);
  const mintStatus = await isTokenMintedOnRegistry({ tokenRegistry, merkleRoot, client: options.client });
  if (ValidTokenRegistryStatus.guard(mintStatus)) {
    const fragment = {
      name,
      type,
      status: "VALID" as const,
    };
    if (utils.isWrappedV3Document(document)) {
      return {
        ...fragment,
        data: { mintedOnAll: true, details: mintStatus },
      };
    } else {
      return {
        ...fragment,
        data: { mintedOnAll: true, details: [mintStatus] },
      };
    }
  } else {
    const fragment = {
      name,
      type,
      reason: mintStatus.reason,
      status: "INVALID" as const,
    };
    if (utils.isWrappedV3Document(document)) {
      return {
        ...fragment,
        data: { mintedOnAll: false, details: mintStatus },
      };
    } else {
      return {
        ...fragment,
        data: { mintedOnAll: false, details: [mintStatus] },
      };
    }
  }
};

export const openAttestationHederaTokenRegistryStatus: Verifier<OpenAttestationHederaTokenRegistryStatusFragment> = {
  skip,
  test,
  verify: withCodedErrorHandler(verify, {
    name,
    type,
    unexpectedErrorCode: OpenAttestationHederaTokenRegistryStatusCode.UNEXPECTED_ERROR,
    unexpectedErrorString:
      OpenAttestationHederaTokenRegistryStatusCode[OpenAttestationHederaTokenRegistryStatusCode.UNEXPECTED_ERROR],
  }),
};
