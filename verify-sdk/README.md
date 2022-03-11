# TradeTrust Verify

## Usage

### Code Example

```java
JSONObject document = ...;
Verifier[] verifiers = new Verifier[]{
    new TradeTrustHash(),
    new EthereumTokenRegistryStatus(),
    new DnsTxtProof()
};
VerificationClient verificationClient = new VerificationClient.Builder()
    .setVerifiers(verifiers)
    .build();
VerifierOptions verifierOptions = new VerifierOptions.Builder()
    .provider(Web3jProvider.getDefaultProvider())
    .build();
List<VerificationFragment> fragments = verificationClient.verify(document, verifierOptions);
boolean result = verificationClient.isValid(fragments);
if (result) {
    System.out.println("document is valid!");
}
```
 