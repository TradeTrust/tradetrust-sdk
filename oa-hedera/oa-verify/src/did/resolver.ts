import { DIDDocument, DIDResolutionResult, Resolver, VerificationMethod } from "did-resolver";
import { getResolver as ethrGetResolver, Errors, verificationMethodTypes } from "ethr-did-resolver";
import { getResolver as webGetResolver } from "web-did-resolver";
import NodeCache from "node-cache";
import { INFURA_API_KEY } from "../config";
import { generateProvider } from "../common/utils";
import { HcsDid } from "@hashgraph/did-sdk-js";
import { PublicKey } from "@hashgraph/sdk";

export interface EthrResolverConfig {
  networks: Array<{
    name: string;
    registry?: string;
    rpcUrl: string;
  }>;
}

export const getProviderConfig = () => {
  const provider = generateProvider() as any;
  const rpcUrl = provider?.connection?.url || "";
  const networkName = provider?._network?.name === "homestead" ? "mainnet" : provider?._network?.name || "";

  if (!rpcUrl || !networkName) {
    return { networks: [{ name: "mainnet", rpcUrl: `https://mainnet.infura.io/v3/${INFURA_API_KEY}` }] };
  }

  return {
    networks: [{ name: networkName, rpcUrl: rpcUrl }],
  };
};

const didResolutionCache = new NodeCache({ stdTTL: 5 * 60 }); // 5 min

const defaultResolver = new Resolver({ ...ethrGetResolver(getProviderConfig()), ...webGetResolver() });

export const createResolver = ({ ethrResolverConfig }: { ethrResolverConfig?: EthrResolverConfig }): Resolver => {
  return ethrResolverConfig
    ? new Resolver({ ...ethrGetResolver(ethrResolverConfig), ...webGetResolver() })
    : defaultResolver;
};

export const resolve = async (did: string, publicKey: string): Promise<DIDDocument | undefined> => {
  const cachedResult = didResolutionCache.get<DIDDocument>(did);
  if (cachedResult) return cachedResult;
  //const didResolutionResult = resolver ? await resolver.resolve(didUrl) : await defaultResolver.resolve(didUrl);
  const didResolutionResult = await hederaResolve(did, publicKey);
  const didDocument = didResolutionResult.didDocument || undefined;
  didResolutionCache.set(did, didDocument);
  return didDocument;
};

export const getVerificationMethod = async (
  did: string,
  key: string,
  resolver?: Resolver
): Promise<VerificationMethod | undefined> => {
  const didDocument = await resolve(did, key);
  if (!didDocument) return;
  return didDocument.verificationMethod?.find((k) => k.controller.toLowerCase() === did.toLowerCase());
};

const hederaResolve = async (
  did: string,
  publicKey: string
): Promise<DIDResolutionResult> => {
  let parsedDid;
  let controller;
  try {
    parsedDid = HcsDid.fromString(did.split("#").join(";"));
    let publicKeyDid = new HcsDid(parsedDid.getNetwork(), PublicKey.fromString(publicKey), parsedDid.getAddressBookFileId());
    controller = publicKeyDid.toString().split(";").join("#");
  } catch (e) {
    return {
      didResolutionMetadata: {
        error: Errors.invalidDid,
        message: `Not a valid ${did.split("#").join(";")}`,
      },
      didDocumentMetadata: {},
      didDocument: null,
    }
  }

  try {
    const didDocument: DIDDocument = {
      '@context': [
        'https://www.w3.org/ns/did/v1',
        'https://identity.foundation/EcdsaSecp256k1RecoverySignature2020/lds-ecdsa-secp256k1-recovery2020-0.0.jsonld',
      ],
      id: did,
      verificationMethod: [],
      authentication: [],
      assertionMethod: [],
    }
    didDocument.verificationMethod = [
      {
        id: `${did}#controllerKey`,
        type: verificationMethodTypes.Ed25519VerificationKey2018,
        controller: controller,
        publicKeyHex: publicKey
      },
    ]
    didDocument.authentication = [`${did}#controller`];
    didDocument.assertionMethod = [...(didDocument.verificationMethod?.map((pk) => pk.id) || [])]
    return {
      didResolutionMetadata: {},
      didDocumentMetadata: {},
      didDocument: didDocument,
    };
  } catch (e: any) {
    return {
      didResolutionMetadata: {
        error: Errors.notFound,
        message: e.toString(), // This is not in spec, nut may be helpful
      },
      didDocumentMetadata: {},
      didDocument: null,
    }
  }
}