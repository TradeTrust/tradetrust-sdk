import {
  ContractId,
  Client,
  AccountId,
  PrivateKey,
  ContractFunctionParameters,
} from "@hashgraph/sdk";
import {
  TitleEscrowCloneable__factory as TitleEscrowCloneableFactory,
  TradeTrustERC721__factory as TradeTrustERC721Factory,
  TitleEscrowCloner__factory as TitleEscrowClonerFactory,
} from "./route";
import { getEventsFromRecord, addressToContractId,getEventsFromMirror } from "./utils";

import BigNumber from "bignumber.js";

let client1: Client;
let client2: Client;
const tokenId = new BigNumber("0x624d0d7ae6f44d41d368d8280856dbaac6aa29fb3b35f45b80a7c1c90032eeb3");
let accountId1: AccountId;
let accountId2: AccountId;
const DEFAULT_GAS = 750000;

beforeAll(async () => {

  client1 = Client.forName("testnet").setOperator(
    AccountId.fromString("0.0.2478338"),
    PrivateKey.fromString("302e020100300506032b65700422042096bc5aef39d8d681fdb44fd45e5616f7cd34290674839a5fead870d29366b09f")
  );

  client2 = Client.forName("testnet").setOperator(
    AccountId.fromString("0.0.29650340"),
    PrivateKey.fromString("302e020100300506032b6570042204206d5dd10c7a189defd08aee28fa1291066588ef2370d89853b47b3058c2e41439")
  );
  if (client1.operatorAccountId == null) throw new Error("client1 accountId is null.");
  accountId1 = client1.operatorAccountId;
  if (client2.operatorAccountId == null) throw new Error("client2 accountId is null.");
  accountId2 = client2.operatorAccountId;

});

describe("TitleEscrowClonerFactory", () => {

  let tokenRegistryAccountId: ContractId;
  let titleEscrowFactoryAccountId: ContractId;

  beforeEach(async () => {
    const factory = new TitleEscrowClonerFactory(client1);
    const titleEscrowClonerFactory = await factory._deploy(DEFAULT_GAS);
    if (titleEscrowClonerFactory.contractId == null) throw new Error("TitleEscrowClonerFactory deploy receipt.contractId is null.");
    titleEscrowFactoryAccountId = titleEscrowClonerFactory.contractId;

    const tokenRegistryFactory = new TradeTrustERC721Factory(client1);
    let parameters = new ContractFunctionParameters();
    parameters.addString("MY_TOKEN_REGISTRY");
    parameters.addString("TKN");
    const tradeTrustERC721Factory = await tokenRegistryFactory._deploy(DEFAULT_GAS, parameters);
    if (tradeTrustERC721Factory.contractId == null) throw new Error("TradeTrustERC721Factory deploy receipt.contractId is null.");
    tokenRegistryAccountId = tradeTrustERC721Factory.contractId;

  }, 170000);

  it("should be able to deploy a new TitleEscrowCreator", async () => {
    expect(titleEscrowFactoryAccountId).not.toBeUndefined();
  });

  it("should be able to connect to an existing TitleEscrowCreator and write to it", async () => {

    const connectedCreator = new TitleEscrowClonerFactory(client1, tokenRegistryAccountId);
    const receipt = await connectedCreator.deployNewTitleEscrow(
      tokenRegistryAccountId,
      ContractId.fromString(accountId1.toString()),
      ContractId.fromString(accountId2.toString()),
      DEFAULT_GAS);
    const record = await receipt.getRecord(client1);
    const event = await getEventsFromRecord(record, "TitleEscrowDeployed", "TitleEscrowCloner");
    let tokenRegistry = (addressToContractId(event.tokenRegistry));
    let beneficiary = (addressToContractId(event.beneficiary));
    let holder = (addressToContractId(event.holder));
    expect(tokenRegistry.toString()).toBe(tokenRegistryAccountId.toString());
    expect(beneficiary.toString()).toBe(accountId1.toString());
    expect(holder.toString()).toBe(accountId2.toString());
  }, 70000);

});

describe("TitleEscrowCloneableFactory", () => {
  let tokenRegistry: TradeTrustERC721Factory;
  let tokenRegistryAccountId: ContractId;
  let escrowAddress: ContractId;

  beforeEach(async () => {
    const tokenRegistryFactory = new TradeTrustERC721Factory(client1);
    let parameters = new ContractFunctionParameters();
    parameters.addString("MY_TOKEN_REGISTRY");
    parameters.addString("TKN");
    const tradeTrustERC721Factory = await tokenRegistryFactory._deploy(DEFAULT_GAS, parameters);
    if (tradeTrustERC721Factory.contractId == null) throw new Error("TradeTrustERC721Factory deploy receipt.contractId is null.");
    tokenRegistryAccountId = tradeTrustERC721Factory.contractId;
    tokenRegistry = new TradeTrustERC721Factory(client1, tokenRegistryAccountId)
  }, 170000);

  const deployTitleEscrow = async () => {
    const titleEscrowTx = await tokenRegistry.deployNewTitleEscrow(
      tokenRegistryAccountId,
      ContractId.fromString(accountId1.toString()),
      ContractId.fromString(accountId2.toString()),
      DEFAULT_GAS);
    const record = await titleEscrowTx.getRecord(client1);
    const event = await getEventsFromRecord(record, "TitleEscrowDeployed", "TitleEscrowCloner");
    escrowAddress = (addressToContractId(event.escrowAddress));
    return new TitleEscrowCloneableFactory(client1, escrowAddress);
  };

  it("should be able to deploy a new TitleEscrow", async () => {
    const escrowInstance = await deployTitleEscrow();
    const beneficiary = await escrowInstance.beneficiary(DEFAULT_GAS);
    const holder = await escrowInstance.holder(DEFAULT_GAS);
    expect(beneficiary.toString()).toBe(accountId1.toString());
    expect(holder.toString()).toBe(accountId2.toString());
  }, 70000);

  it("should be able to write to TitleEscrow", async () => {
    const escrowInstance = await deployTitleEscrow();
    await tokenRegistry.safeMint(escrowAddress, tokenId, DEFAULT_GAS);
    await escrowInstance.approveNewOwner(
      ContractId.fromString(accountId2.toString()),
      DEFAULT_GAS);
    const target = await escrowInstance.approvedOwner(DEFAULT_GAS);
    expect(target.toString()).toBe(accountId2.toString());
  }, 70000);

});

describe("TradeTrustErc721Factory", () => {

  const deployTradeTrustERC721 = async () => {
    const tokenRegistryFactory = new TradeTrustERC721Factory(client1);
    let parameters = new ContractFunctionParameters();
    parameters.addString("MY_TOKEN_REGISTRY");
    parameters.addString("TKN");
    const tradeTrustERC721Factory = await tokenRegistryFactory._deploy(DEFAULT_GAS, parameters);
    if (tradeTrustERC721Factory.contractId == null) throw new Error("TradeTrustERC721Factory deploy receipt.contractId is null.");
    return new TradeTrustERC721Factory(client1, tradeTrustERC721Factory.contractId)
  };

  it("should be able to deploy a new TradeTrustERC721", async () => {
    const instance = await deployTradeTrustERC721();
    const sym = await instance.symbol(DEFAULT_GAS);
    expect(sym).toBe("TKN");
  }, 170000);

  it("should be able to write to TradeTrustERC721", async () => {
    const instance = await deployTradeTrustERC721();
    await instance.safeMint(
      ContractId.fromString(accountId1.toString()),
      tokenId,
      DEFAULT_GAS)
    const ownerOfToken = await instance.ownerOf(tokenId, DEFAULT_GAS);
    expect(ownerOfToken.toString()).toBe(accountId1.toString());
  }, 170000);


  it("should be able to write to TradeTrustERC721", async () => {
    const sss = await getEventsFromMirror("testnet",
    `/contracts/0.0.30803120/results/logs?order=desc&timestamp=gte%3A1645246716&timestamp=lte%3A1645851515&topic3=0x2b18ea05dd11e2676a8830c44dacc3e0da1ba2b14609b17b54630167e16cb375`,
    "TradeTrustERC721",
    "Transfer")
    console.log(sss);
    console.log(sss[0]);
    console.log(sss[0].from);
    console.log(sss[0].to);
    expect(1).toBe(1);
  }, 170000);

});
