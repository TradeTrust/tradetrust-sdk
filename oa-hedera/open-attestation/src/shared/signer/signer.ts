import { SigningFunction, SigningKey } from "../../shared/@types/sign";
import { defaultSigners } from "./signatureSchemes";

export const signerBuilder =
  (signers: Map<string, SigningFunction>) =>
    (alg: string, message: string, keyOrSigner: SigningKey) => {
      const signer = signers.get(alg);
      if (!signer) throw new Error(`${alg} is not supported as a signing algorithm`);
      return signer(message, keyOrSigner);
    };

export const sign = signerBuilder(defaultSigners);

export { defaultSigners };
