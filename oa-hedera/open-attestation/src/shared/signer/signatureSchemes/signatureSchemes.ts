// import { SigningFunction } from "../../@types/sign";
// import {
//   sign as Secp256k1VerificationKey2018Sign,
//   name as Secp256k1VerificationKey2018Name,
// } from "./Secp256k1VerificationKey2018";

// export const defaultSigners = new Map<string, SigningFunction>();
// defaultSigners.set(Secp256k1VerificationKey2018Name, Secp256k1VerificationKey2018Sign);

import { SigningFunction } from "../../@types/sign";
import {
  sign as Ed25519VerificationKey2018Sign,
  name as Ed25519VerificationKey2018Name,
} from "./Ed25519VerificationKey2018";

export const defaultSigners = new Map<string, SigningFunction>();
defaultSigners.set(Ed25519VerificationKey2018Name, Ed25519VerificationKey2018Sign);
