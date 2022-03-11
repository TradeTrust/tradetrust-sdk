export const documentDidSigned: any = {
  version: "https://schema.openattestation.com/2.0/schema.json",
  data: {
    $template: {
      name: "36e5277b-30e7-4d40-9444-c1b9968702bb:string:main",
      type: "d065fb21-c4df-46e9-bb13-c5253e963db5:string:EMBEDDED_RENDERER",
      url: "3c6489d9-6c5a-49c3-9d31-41805613b7f1:string:https://tutorial-renderer.openattestation.com",
    },
    recipient: {
      name: "0333be22-7d96-4f18-b19e-bb223445bc52:string:HR TIAN",
    },
    issuers: [
      {
        name: "9f5260ab-6d61-4ad8-b72a-6e2d9c87c9ba:string:Demo Issuer",
        documentStore: "241b4667-a4ab-4d65-af28-bed67d1cbf6a:string:0x0000000000000000000000000000000001d7aff4",
        identityProof: {
          type: "ea4f899c-ac49-44bb-a854-9b7ecf8c707b:string:DNS-TXT",
          location: "9a4567af-12b1-4ba9-b297-2dbe71474fd8:string:magnificent-silver-rattlesnake.openattestation.com",
        },
      },
    ],
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "33d6c163a398df617808ba292d2977ef0d709e9bc44ba8c9bed1a1cbb2a392df",
    proof: ["6b2a0a2dfde00b0bbcbb6269b5801f4967d88451a04ec764151d073ca8d430e7"],
    merkleRoot: "7dd3246947a714d31ade8a6bd99d04fafad5e466f2f3252153adb37dbe834ae0",
  },
};
