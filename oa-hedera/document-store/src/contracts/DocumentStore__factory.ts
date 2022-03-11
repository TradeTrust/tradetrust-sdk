import {
  ContractFunctionParameters,
  TransactionResponse,
  ContractId,
  Client,
} from "@hashgraph/sdk";
import { ContractFactory } from "./ContractFactory";
import { stringToUint8Array, stringListToUint8ArrayList, addressToContractId } from "../utils";
import documentStore from "./build/DocumentStore.json";
import { contractIdToAddress } from "../utils";

export class DocumentStore__factory extends ContractFactory {

  constructor(client: Client, contractId?: ContractId) {
    super(client, documentStore.bytecode, contractId);
  }

  async documentIssued(arg0: string, gas: number): Promise<number> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes(stringToUint8Array(arg0));
    let instance = await super._callQuery("documentIssued", gas, parameters);
    return instance.getUint256().toNumber();
  }

  async documentRevoked(arg0: string, gas: number): Promise<number> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes(stringToUint8Array(arg0));
    let instance = await super._callQuery("documentRevoked", gas, parameters);
    return instance.getUint256().toNumber();
  }

  async name(gas: number): Promise<string> {
    let instance = await super._callQuery("name", gas);
    return instance.getString();
  }

  async owner(gas: number): Promise<string> {
    let instance = await super._callQuery("owner", gas);
    let res = addressToContractId(instance.getAddress());
    return res.toString()
  }

  async renounceOwnership(gas: number): Promise<TransactionResponse> {
    return (await super._executeTransaction("renounceOwnership", gas));
  }

  async transferOwnership(newOwner: ContractId, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(newOwner));
    return super._executeTransaction("transferOwnership", gas, parameters);
  }

  async version(gas: number): Promise<string> {
    let instance = await super._callQuery("version", gas);
    return instance.getString();
  }

  async issue(document: string, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes(stringToUint8Array(document));
    return super._executeTransaction("issue", gas, parameters);
  }

  async bulkIssue(documents: string[], gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytesArray(stringListToUint8ArrayList(documents));
    return super._executeTransaction("bulkIssue", gas, parameters);
  }

  async isIssued(document: any, gas: number): Promise<boolean> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes(stringToUint8Array(document));
    let instance = await super._callQuery("isIssued", gas, parameters);
    return instance.getBool();
  }

  async revoke(document: any, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes(stringToUint8Array(document));
    return super._executeTransaction("revoke", gas, parameters);
  }

  async bulkRevoke(documents: any[], gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytesArray(stringListToUint8ArrayList(documents));
    return super._executeTransaction("bulkRevoke", gas, parameters);
  }

  async isRevoked(document: any, gas: number): Promise<boolean> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes(stringToUint8Array(document));
    let instance = await super._callQuery("isRevoked", gas, parameters);
    return instance.getBool();
  }

}
