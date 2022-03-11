import {
  ContractFunctionParameters,
  TransactionResponse,
  Client,
  ContractId,
} from "@hashgraph/sdk";

import { ContractFactory } from "./ContractFactory";
import { stringToUint8Array, stringListToUint8ArrayList, addressToContractId,contractIdToAddress } from "../utils";
import gsnCapableDocumentStore from "./build/GsnCapableDocumentStore.json";

export class GsnCapableDocumentStore__factory extends ContractFactory {

  constructor(client: Client, contractId?: ContractId) {
    super(client, gsnCapableDocumentStore.bytecode, contractId);
  }

  async bulkIssue(documents: string[], gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytesArray(stringListToUint8ArrayList(documents));
    return super._executeTransaction("bulkIssue", gas, parameters);
  }

  async bulkRevoke(documents: string[], gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytesArray(stringListToUint8ArrayList(documents));
    return super._executeTransaction("bulkRevoke", gas, parameters);
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

  async getPaymaster(gas: number): Promise<ContractId> {
    let instance = await super._callQuery("getPaymaster", gas);
    return addressToContractId(instance.getAddress());
  }

  async initialize(_name: string, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addString(_name);
    return super._executeTransaction("initialize", gas, parameters);
  }

  async isIssued(document: string, gas: number): Promise<boolean> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes(stringToUint8Array(document));
    let instance = await super._callQuery("isIssued", gas, parameters);
    return instance.getBool();
  }

  async isRevoked(document: string, gas: number): Promise<boolean> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes(stringToUint8Array(document));
    let instance = await super._callQuery("isRevoked", gas, parameters);
    return instance.getBool();
  }

  async isTrustedForwarder(forwarder: string, gas: number): Promise<boolean> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes(stringToUint8Array(forwarder));
    let instance = await super._callQuery("isRevoked", gas, parameters);
    return instance.getBool();
  }

  async issue(document: string, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes(stringToUint8Array(document));
    return super._executeTransaction("issue", gas, parameters);
  }

  async name(gas: number): Promise<string> {
    let instance = await super._callQuery("name", gas);
    return instance.getString();
  }

  async owner(gas: number): Promise<ContractId> {
    let instance = await super._callQuery("owner", gas);
    return addressToContractId(instance.getAddress());
  }

  async paymaster(gas: number): Promise<ContractId> {
    let instance = await super._callQuery("paymaster", gas);
    return addressToContractId(instance.getAddress());
  }

  async renounceOwnership(gas: number): Promise<TransactionResponse> {
    return super._executeTransaction("paymaster", gas);
  }

  async revoke(document: string, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes(stringToUint8Array(document));
    return super._executeTransaction("revoke", gas, parameters);
  }

  async setPaymaster(target: string, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes(stringToUint8Array(target));
    return super._executeTransaction("revoke", gas, parameters);
  }

  async supportsInterface(interfaceId: string, gas: number): Promise<boolean> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes(stringToUint8Array(interfaceId));
    let instance = await super._callQuery("supportsInterface", gas, parameters);
    return instance.getBool();
  }

  async transferOwnership(newOwner: ContractId, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(newOwner));
    return super._executeTransaction("transferOwnership", gas, parameters);
  }

  async trustedForwarder(gas: number): Promise<ContractId> {
    let instance = await super._callQuery("trustedForwarder", gas);
    return addressToContractId(instance.getAddress());
  }

  async version(gas: number): Promise<string> {
    let instance = await super._callQuery("version", gas);
    return instance.getString();
  }

  async versionRecipient(gas: number): Promise<string> {
    let instance = await super._callQuery("versionRecipient", gas);
    return instance.getString();
  }

  async getTrustedForwarder(gas: number): Promise<ContractId> {
    let instance = await super._callQuery("getTrustedForwarder", gas);
    return addressToContractId(instance.getAddress());
  }

  async setTrustedForwarder(_forwarder: ContractId, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(_forwarder));
    return super._executeTransaction("transferOwnership", gas, parameters);
  }

}