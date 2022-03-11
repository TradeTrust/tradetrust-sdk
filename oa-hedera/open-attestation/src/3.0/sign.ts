import {
  OpenAttestationDocument,
  SignedWrappedDocument,
  VerifiableCredentialSignedProof,
  WrappedDocument,
} from "./types";
import { sign } from "../shared/signer";
import { SigningKey, SUPPORTED_SIGNING_ALGORITHM } from "../shared/@types/sign";
import { isSignedWrappedV3Document } from "../shared/utils";
import { PrivateKey } from "@hashgraph/sdk";

export const signDocument = async <T extends OpenAttestationDocument>(
  document: SignedWrappedDocument<T> | WrappedDocument<T>,
  algorithm: SUPPORTED_SIGNING_ALGORITHM,
  keyOrSigner: SigningKey
): Promise<SignedWrappedDocument<T>> => {
  if (isSignedWrappedV3Document(document)) throw new Error("Document has been signed");
  const merkleRoot = `0x${document.proof.merkleRoot}`;
  const signature = await sign(algorithm, merkleRoot, keyOrSigner);
  const proof: VerifiableCredentialSignedProof = {
    ...document.proof,
    key: PrivateKey.fromString(keyOrSigner.private).publicKey.toString(),
    signature,
  };
  return { ...document, proof };
};
