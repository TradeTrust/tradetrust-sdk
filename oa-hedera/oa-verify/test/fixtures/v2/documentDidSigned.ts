export const documentDidSigned: any = {
  "version": "https://schema.openattestation.com/2.0/schema.json",
  "data": {
    "recipient": {
      "name": "896164ac-b198-4b8b-9cdc-b43298350dd3:string:HR TIAN"
    },
    "$template": {
      "name": "87dfbaba-560b-4563-a2a9-e79d05711312:string:main",
      "type": "f2b8766b-653b-446c-a483-531d4cdaf828:string:EMBEDDED_RENDERER",
      "url": "1b034032-3357-4696-bb51-26bb0833643a:string:https://tutorial-renderer.openattestation.com"
    },
    "issuers": [
      {
        "id": "c1488900-fa54-46ca-884e-2bc06ea90c66:string:did:hedera:testnet:JCnGfsWr5n3AF8wDokBcUevnMPz8dGWB9Sz2i35asrCv;hedera:testnet:fid=0.0.2478338",
        "name": "3d8204b5-4818-4644-933a-df3200017210:string:Demo Issuer",
        "revocation": {
          "type": "e10691be-3216-4163-860d-ff280b00c23b:string:NONE"
        },
        "identityProof": {
          "type": "3a81a119-5eff-4fe8-b04c-8608fe06b9c4:string:DID",
          "location": "9475ce0f-9ce7-4e82-925b-79a918ef725e:string:afraid-maroon-guppy.sandbox.openattestation.com",
          "key": "008899a4-bae9-4bdc-b3c3-a20d1c5b522e:string:302a300506032b6570032100db993060d3c939ae59af1ed84e9ed3aa76edddc19e7114e7c8fe7bae7bd8831f"
        }
      }
    ]
  },
  "signature": {
    "type": "SHA3MerkleProof",
    "targetHash": "3f21ad7283a8369fd8b850bd236ad3d6df6a5d8a27a21066f95ddaf91213e0f3",
    "proof": [
      "9bb55852486eada56805969067ab03326607f18c26b01c01c5d69c4853556acc"
    ],
    "merkleRoot": "a135b12fa4e396b548a83fc3aa120ecb95db16d6d24a4a7ba682a551a9e11e36"
  },
  "proof": [
    {
      "type": "OpenAttestationSignature2018",
      "created": "2022-03-08T10:05:57.956Z",
      "proofPurpose": "assertionMethod",
      "verificationMethod": "302a300506032b6570032100db993060d3c939ae59af1ed84e9ed3aa76edddc19e7114e7c8fe7bae7bd8831f",
      "signature": "eb5d90684cf5031f96ae3a2977e1ae3a7e02e1272af15cafafeb138595c55e5d2e262a48be622d629d03ed9f7376d38010a99c98e868448ab32c8dbefb26ab02"
    }
  ]
};
