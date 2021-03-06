import { PrivateKey, FileId } from "@hashgraph/sdk";
import { stringToUint8Array } from "../../../utils"
import { SigningFunction, SigningKey } from "../../../@types/sign";
import { HcsDid,ArraysUtils } from "@hashgraph/did-sdk-js";

export const name = "Ed25519VerificationKey2018";

export const sign: SigningFunction = (
  message: string,
  keyOrSigner: SigningKey
): Promise<string> => {
  let privateKey: PrivateKey;
  if (SigningKey.guard(keyOrSigner)) {
    const publicKey = keyOrSigner.public.split("#").join(";");
    const parsedDid = HcsDid.fromString(publicKey);
    const network = parsedDid.getNetwork();
    privateKey = PrivateKey.fromString(keyOrSigner.private);
    const fileId = FileId.fromString(parsedDid.getAddressBookFileId().toString());
    const did = new HcsDid(network, privateKey.publicKey, fileId);
    if (!publicKey.toLowerCase().includes(did.toString().toLowerCase())) {
      throw new Error(`Private key is wrong for ${publicKey}`);
    }
  } else {
    throw new Error(`SigningKey type is wrong for ${keyOrSigner}`);
  }
  return new Promise(resolve => {
    resolve(Buffer.from(privateKey.sign(ArraysUtils.fromString(message))).toString("hex"));
  });
};
