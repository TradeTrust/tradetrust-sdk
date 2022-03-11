import { Static, Boolean, String, Literal, Record, Union, Partial } from "runtypes";

// References https://www.w3.org/TR/did-core/#did-syntax
export const validateDid = (maybeDid: string) => {
  const [did, methodName, ...methodSpecificIdParts] = maybeDid.split(":");
  const methodSpecificId = methodSpecificIdParts.join(":");
  if (did !== "did" || !methodName || !methodSpecificId || !/[a-z]+/.test(methodName)) return false;
  return true;
};

export const RecordTypesT = Literal("openatts");
export const AlgorithmT = Union(Literal("dns-did"));
export const VersionT = String;
export const PublicKeyT = String.withConstraint((maybeDid: string) => {
  return validateDid(maybeDid) || `${maybeDid} is not a valid did`;
});

export const OpenAttestationDnsDidRecordT = Record({
  type: RecordTypesT,
  algorithm: AlgorithmT,
  publicKey: PublicKeyT,
  version: VersionT,
}).And(
  Partial({
    dnssec: Boolean,
  })
);

export type OpenAttestationDnsDidRecord = Static<typeof OpenAttestationDnsDidRecordT>;
