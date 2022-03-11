
import {
  DocumentStoreCreator__factory as DocumentStoreCreatorFactory,
  UpgradableDocumentStore__factory as UpgradableDocumentStoreFactory,
} from "./contracts/";
import { TransactionResponse, ContractId, Client } from "@hashgraph/sdk";
import { addressToContractId } from "./utils";

export const deploy = async (name: string, client: Client, contractId: ContractId, gas: number): Promise<TransactionResponse> => {
  const documentStoreCreatorFactory = new DocumentStoreCreatorFactory(client, contractId);
  return documentStoreCreatorFactory.deploy(name, gas);
};

export const deployAndWait = async (name: string, client: Client, contractId: ContractId, gas: number) => {
  const receipt = await deploy(name, client, contractId, gas);
  var txRecord = await receipt.getRecord(client);
  if (txRecord.receipt.status._code != 22) throw new Error("Fail to detect deployed contract address");
  if (!txRecord.contractFunctionResult) throw new Error("Document Store Creator contract deployed Fail");
  let address = txRecord.contractFunctionResult.getAddress();
  return new UpgradableDocumentStoreFactory(client, await addressToContractId(address));
};

export const connect = async (client: Client, contractId: ContractId) => {
  return new UpgradableDocumentStoreFactory(client, contractId);
};

export {
  DocumentStore__factory as DocumentStoreFactory,
  DocumentStoreCreator__factory as DocumentStoreCreatorFactory,
  GsnCapableDocumentStore__factory as GsnCapableDocumentStoreFactory,
  NaivePaymaster__factory as NaivePaymasterFactory,
  UpgradableDocumentStore__factory as UpgradableDocumentStoreFactory,
} from "./contracts";

export { stringToUint8Array, stringListToUint8ArrayList, addressToContractId, contractIdToAddress } from "./utils"
