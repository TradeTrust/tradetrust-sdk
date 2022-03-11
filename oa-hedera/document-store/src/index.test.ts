import {
  ContractId,
  Client,
  AccountId,
  PrivateKey,
} from "@hashgraph/sdk";
import { deploy, deployAndWait } from "./index";
import { DocumentStoreCreator__factory as DocumentStoreCreatorFactory } from "./contracts";

let contractId: ContractId;
let client: Client;
let accountId: AccountId;
const DEFAULT_GAS = 750000;

beforeAll(async () => {
  // Deploy an instance of DocumentStoreFactory on the new blockchain
  client = Client.forName("testnet").setOperator(
    AccountId.fromString("0.0.2478338"),
    PrivateKey.fromString("302e020100300506032b65700422042096bc5aef39d8d681fdb44fd45e5616f7cd34290674839a5fead870d29366b09f")
  )

  const factory = new DocumentStoreCreatorFactory(client);
  const receipt = await factory._deploy(DEFAULT_GAS);
  if (receipt.contractId == null) throw new Error("DocumentStoreCreator deploy receipt.contractId is null.");
  contractId = receipt.contractId;
  if (client.operatorAccountId == null) throw new Error("accountId is null.");
  accountId = client.operatorAccountId;
});

describe("deploy", () => {
  it("deploys a new UpgradableDocumentStore contract without waiting for confirmation", async () => {
    const receipt = await deploy("My Store", client, contractId, DEFAULT_GAS);
    if (!receipt.transactionId.accountId) throw new Error("unknown transaction transactionId.accountId .");
    expect(receipt.transactionId.accountId.toString()).toBe(accountId.toString());
  });
});

describe("deployAndWait", () => {
  it("deploys a new UpgradableDocumentStore contract", async () => {
    const instance = await deployAndWait("My Store", client, contractId, DEFAULT_GAS);
    const owner = await instance.owner(DEFAULT_GAS);
    expect(owner.toString()).toBe(accountId.toString());
    const name = await instance.name(DEFAULT_GAS);
    expect(name).toBe("My Store");
  });
});

describe("connect", () => {
  it("connects to existing contract", async () => {
    const instance = await deployAndWait("My Store", client, contractId, DEFAULT_GAS);
    const owner = await instance.owner(DEFAULT_GAS);
    expect(owner.toString()).toBe(accountId.toString());
    const name = await instance.name(DEFAULT_GAS);
    expect(name).toBe("My Store");
  });
});
