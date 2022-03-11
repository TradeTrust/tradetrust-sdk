import {
  ContractFunctionParameters,
  TransactionResponse,
  ContractId,
  Client,
} from "@hashgraph/sdk";

import { ContractFactory } from "./ContractFactory";
import { stringToUint8Array, stringListToUint8ArrayList, addressToContractId,contractIdToAddress } from "../utils";
import upgradableDocumentStore from "./build/UpgradableDocumentStore.json";

export class UpgradableDocumentStore__factory extends ContractFactory {

  constructor(client: Client, contractId?: ContractId) {
    super(client, upgradableDocumentStore.bytecode, contractId);
  }

  async deploy(arg0: string, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes(stringToUint8Array(arg0));
    return super._executeTransaction("deploy", gas, parameters);
  };

  async documentIssued(arg0: string, gas: number): Promise<number> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes(stringToUint8Array(arg0));
    // The function gas expected is 1183.
    let instance = await super._callQuery("documentIssued", gas, parameters);
    return instance.getUint256().toNumber();
  };

  async documentRevoked(arg0: string, gas: number): Promise<number> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes(stringToUint8Array(arg0));
    // The function gas expected is 1140.
    let instance = await super._callQuery("documentRevoked", gas, parameters);
    return instance.getUint256().toNumber();
  }

  async isIssued(arg0: string, gas: number): Promise<boolean> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes(stringToUint8Array(arg0));
    // The function gas expected is 1749.
    let instance = await super._callQuery("isIssued", gas, parameters);
    return instance.getBool();
  }

  async isRevoked(arg0: string, gas: number): Promise<number> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes(stringToUint8Array(arg0));
    let instance = await super._callQuery("isRevoked", gas, parameters);
    return instance.getUint256().toNumber();
  }

  async name(gas: number): Promise<string> {
    // The function gas expected is 1175.
    let instance = await super._callQuery("name", gas);
    return instance.getString();
  }

  async owner(gas: number): Promise<ContractId> {
    // The function gas expected is 517.
    let instance = await super._callQuery("owner", gas);
    return addressToContractId(instance.getAddress());
  }

  async renounceOwnership(gas: number): Promise<void> {
    await super._executeTransaction("renounceOwnership", gas);
  }

  async transferOwnership(arg0: ContractId, gas: number): Promise<void> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(arg0));
    await super._executeTransaction("transferOwnership", gas, parameters);
  }

  async version(gas: number): Promise<string> {
    // The function gas expected is 1174.
    let instance = await super._callQuery("version", gas);
    return instance.getString();
  }

  // async initialize(arg0:string,arg1?:ContractId): Promise<TransactionResponse>{
  //   let parameters = new ContractFunctionParameters();
  //   parameters.addString(arg0);
  //   if(arg1){
  //     parameters.addAddress(arg1);
  //   };
  //   let instance = await super._executeTransaction("initialize",7000,parameters);
  // }

  async issue(arg0: string, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes(stringToUint8Array(arg0));
    // The function gas expected is 3366. 
    return await super._executeTransaction("issue", gas, parameters);
  }

  async bulkIssue(arg0: string[], gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytesArray(stringListToUint8ArrayList(arg0));
    return await super._executeTransaction("bulkIssue", gas, parameters);
  }

  async revoke(arg0: string, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes(stringToUint8Array(arg0));
    return await super._executeTransaction("revoke", gas, parameters);
  }

  async bulkRevoke(arg0: string[], gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytesArray(stringListToUint8ArrayList(arg0));
    return await super._executeTransaction("bulkRevoke", gas, parameters);
  }

}
