import { ContractFactory } from "./ContractFactory";
import {
  TransactionResponse,
  ContractFunctionParameters,
  ContractId,
  Client,
} from "@hashgraph/sdk";
import titleEscrowCloneable from "./build/TitleEscrowCloneable.sol/TitleEscrowCloneable.json";

import BigNumber from "bignumber.js";
import { contractIdToAddress,addressToContractId } from "../utils";

export class TitleEscrowCloneable__factory extends ContractFactory {

  constructor(client: Client, contractId?: ContractId) {
    super(client, titleEscrowCloneable.bytecode, contractId);
  }

  async _tokenId(gas: number): Promise<BigNumber> {
    let instance = await super._callQuery("_tokenId", gas);
    return instance.getUint256();
  }

  async approveNewOwner(newOwner: ContractId, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(newOwner));
    return super._executeTransaction("approveNewOwner", gas, parameters);
  }

  async approveNewTransferTargets(newBeneficiary: ContractId, newHolder: ContractId, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(newBeneficiary));
    parameters.addAddress(contractIdToAddress(newHolder));
    return super._executeTransaction("approveNewTransferTargets", gas, parameters);
  }

  async approvedBeneficiary(gas: number): Promise<ContractId> {
    let instance = await super._callQuery("approvedBeneficiary", gas);
    return addressToContractId(instance.getAddress());
  }

  async approvedHolder(gas: number): Promise<ContractId> {
    let instance = await super._callQuery("approvedHolder", gas);
    return addressToContractId(instance.getAddress());
  }

  async approvedOwner(gas: number): Promise<ContractId> {
    let instance = await super._callQuery("approvedOwner", gas);
    return addressToContractId(instance.getAddress());
  }

  async beneficiary(gas: number): Promise<ContractId> {
    let instance = await super._callQuery("beneficiary", gas);
    return addressToContractId(instance.getAddress());
  }

  async changeHolder(newHolder: ContractId, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(newHolder));
    return super._executeTransaction("changeHolder", gas, parameters);
  }

  async holder(gas: number): Promise<ContractId> {
    let instance = await super._callQuery("holder", gas);
    return addressToContractId(instance.getAddress());
  }

  async initialize(_tokenRegistry: ContractId, _beneficiary: ContractId, _holder: ContractId, _titleEscrowFactoryAddress: ContractId, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(_tokenRegistry));
    parameters.addAddress(contractIdToAddress(_beneficiary));
    parameters.addAddress(contractIdToAddress(_holder));
    parameters.addAddress(contractIdToAddress(_titleEscrowFactoryAddress));
    return super._executeTransaction("initialize", gas, parameters);
  }

  async onERC721Received(operator: ContractId, from: ContractId, tokenId: BigNumber, data: any, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(operator));
    parameters.addAddress(contractIdToAddress(from));
    parameters.addUint256(tokenId);
    parameters.addBytes(data);
    return super._executeTransaction("onERC721Received", gas, parameters);
  }

  async status(gas: number): Promise<number> {
    let instance = await super._callQuery("status", gas);
    return instance.getUint256().toNumber();
  }

  async supportsInterface(interfaceId: any, gas: number): Promise<boolean> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes(interfaceId);
    let instance = await super._callQuery("supportsInterface", gas, parameters);
    return instance.getBool()
  }

  async surrender(gas: number): Promise<TransactionResponse> {
    return super._executeTransaction("surrender", gas);
  }

  async titleEscrowFactory(gas: number): Promise<ContractId> {
    let instance = await super._callQuery("titleEscrowFactory", gas);
    return addressToContractId(instance.getAddress());
  }

  async tokenRegistry(gas: number): Promise<ContractId> {
    let instance = await super._callQuery("tokenRegistry", gas);
    return addressToContractId(instance.getAddress());
  }

  async transferToNewEscrow(newBeneficiary: ContractId, newHolder: ContractId, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(newBeneficiary));
    parameters.addAddress(contractIdToAddress(newHolder));
    return super._executeTransaction("transferToNewEscrow", gas, parameters);
  }

}
