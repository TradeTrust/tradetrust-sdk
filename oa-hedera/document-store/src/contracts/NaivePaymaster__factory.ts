import {
  ContractFunctionParameters,
  TransactionResponse,
  Client,
  ContractId
} from "@hashgraph/sdk";

import { ContractFactory } from "./ContractFactory";
import { addressToContractId,contractIdToAddress } from "../utils";
import naivePaymaster from "./build/NaivePaymaster.json";

export class NaivePaymaster__factory extends ContractFactory {

  constructor(client: Client, contractId?: ContractId) {
    super(client, naivePaymaster.bytecode, contractId);
  }

  async FORWARDER_HUB_OVERHEAD(gas: number): Promise<number> {
    let instance = await super._callQuery("FORWARDER_HUB_OVERHEAD", gas);
    return instance.getUint256().toNumber();
  }

  async PAYMASTER_ACCEPTANCE_BUDGET(gas: number): Promise<number> {
    let instance = await super._callQuery("PAYMASTER_ACCEPTANCE_BUDGET", gas);
    return instance.getUint256().toNumber();
  }

  async POST_RELAYED_CALL_GAS_LIMIT(gas: number): Promise<number> {
    let instance = await super._callQuery("POST_RELAYED_CALL_GAS_LIMIT", gas);
    return instance.getUint256().toNumber();
  }

  async PRE_RELAYED_CALL_GAS_LIMIT(gas: number): Promise<number> {
    let instance = await super._callQuery("PRE_RELAYED_CALL_GAS_LIMIT", gas);
    return instance.getUint256().toNumber();
  }

  async getGasLimits(gas: number): Promise<any> {
    let instance = await super._callQuery("getGasLimits", gas);
    return instance;
  }

  async getHubAddr(gas: number): Promise<ContractId> {
    let instance = await super._callQuery("getHubAddr", gas);
    return addressToContractId(instance.getAddress());
  }

  async getRelayHubDeposit(gas: number): Promise<number> {
    let instance = await super._callQuery("getRelayHubDeposit", gas);
    return instance.getUint256().toNumber();
  }

  async name(gas: number): Promise<string> {
    let instance = await super._callQuery("name", gas);
    return instance.getString();
  }

  async owner(gas: number): Promise<ContractId> {
    let instance = await super._callQuery("owner", gas);
    return addressToContractId(instance.getAddress());
  }

  async renounceOwnership(gas: number): Promise<TransactionResponse> {
    return await super._executeTransaction("renounceOwnership", gas);
  }

  async setRelayHub(hub: ContractId, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(hub));
    return await super._executeTransaction("renounceOwnership", gas);
  }

  async setTrustedForwarder(forwarder: ContractId, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(forwarder));
    return await super._executeTransaction("setTrustedForwarder", gas);
  }

  async transferOwnership(newOwner: ContractId, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(newOwner));
    return await super._executeTransaction("setTrustedForwarder", gas);
  }

  async trustedForwarder(gas: number): Promise<ContractId> {
    let instance = await super._callQuery("trustedForwarder", gas);
    return addressToContractId(instance.getAddress());
  }

  async version(gas: number): Promise<string> {
    let instance = await super._callQuery("version", gas);
    return instance.getString();
  }

  async withdrawRelayHubDepositTo(amount: any, target: ContractId, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addUint256(amount);
    parameters.addAddress(contractIdToAddress(target));
    return await super._executeTransaction("setTrustedForwarder", gas);
  }

  async setTarget(target: ContractId, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(target));
    return await super._executeTransaction("setTarget", gas);
  }

  async removeTarget(target: ContractId, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(target));
    return await super._executeTransaction("removeTarget", gas);
  }

  async supportsAddress(target: ContractId, gas: number): Promise<boolean> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(target));
    let instance = await super._callQuery("supportsAddress", gas);
    return instance.getBool();
  }

  async versionPaymaster(gas: number): Promise<string> {
    let instance = await super._callQuery("versionPaymaster", gas);
    return instance.getString();
  }

}

