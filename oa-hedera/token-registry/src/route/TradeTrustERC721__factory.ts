import { ContractFactory } from "./ContractFactory";
import {
  TransactionResponse,
  ContractFunctionParameters,
  ContractId,
  Client,
} from "@hashgraph/sdk";
import TradeTrustERC721 from "./build/TradetrustERC721.sol/TradeTrustERC721.json";

import BigNumber from "bignumber.js";
import { addressToContractId,contractIdToAddress } from "../utils";

export class TradeTrustERC721__factory extends ContractFactory {

  constructor(client: Client, contractId?: ContractId) {
    super(client, TradeTrustERC721.bytecode, contractId);
  }

  async DEFAULT_ADMIN_ROLE(gas: number): Promise<string> {
    let instance = await super._callQuery("DEFAULT_ADMIN_ROLE", gas);
    return instance.getString();
  }

  async MINTER_ROLE(gas: number): Promise<string> {
    let instance = await super._callQuery("MINTER_ROLE", gas);
    return instance.getString();
  }

  async addMinter(account: ContractId, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(account));
    return super._executeTransaction("addMinter", gas, parameters);
  }

  async approve(to: ContractId, tokenId: BigNumber, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(to));
    parameters.addUint256(tokenId)
    return super._executeTransaction("approve", gas, parameters);
  }

  async balanceOf(owner: ContractId, gas: number): Promise<number> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(owner));
    let instance = await super._callQuery("balanceOf", gas, parameters);
    return instance.getUint256().toNumber();
  }

  async deployNewTitleEscrow(tokenRegistry: ContractId, beneficiary: ContractId, holder: ContractId, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(tokenRegistry));
    parameters.addAddress(contractIdToAddress(beneficiary));
    parameters.addAddress(contractIdToAddress(holder));
    return super._executeTransaction("deployNewTitleEscrow", gas, parameters);
  }

  async destroyToken(_tokenId: BigNumber, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addUint256(_tokenId);
    return super._executeTransaction("destroyToken", gas, parameters);
  }

  async getApproved(tokenId: BigNumber, gas: number): Promise<ContractId> {
    let parameters = new ContractFunctionParameters();
    parameters.addUint256(tokenId);
    let instance = await super._callQuery("getApproved", gas, parameters);
    return addressToContractId(instance.getAddress());
  }

  async getRoleAdmin(role: any, gas: number): Promise<string> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes32(role);
    let instance = await super._callQuery("getRoleAdmin", gas, parameters);
    let res = addressToContractId(instance.getAddress());
    return res.toString()
  }

  async getRoleMember(role: any, index: BigNumber, gas: number): Promise<string> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes32(role);
    parameters.addUint256(index);
    let instance = await super._callQuery("getRoleMember", gas, parameters);
    let res = addressToContractId(instance.getAddress());
    return res.toString()
  }

  async getRoleMemberCount(role: any, gas: number): Promise<BigNumber> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes32(role);
    let instance = await super._callQuery("getRoleMemberCount", gas, parameters);
    return instance.getUint256()
  }

  async grantRole(role: any, address: ContractId, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes32(role);
    parameters.addAddress(contractIdToAddress(address));
    return super._executeTransaction("grantRole", gas, parameters);
  }

  async hasRole(role: any, address: ContractId, gas: number): Promise<boolean> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes32(role);
    parameters.addAddress(contractIdToAddress(address));
    let instance = await super._callQuery("getRoleMemberCount", gas, parameters);
    return instance.getBool()
  }

  async isApprovedForAll(owner: ContractId, operator: ContractId, gas: number): Promise<boolean> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(owner));
    parameters.addAddress(contractIdToAddress(operator));
    let instance = await super._callQuery("isApprovedForAll", gas, parameters);
    return instance.getBool()
  }

  async isMinter(account: ContractId, gas: number): Promise<boolean> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(account));
    let instance = await super._callQuery("isMinter", gas, parameters);
    return instance.getBool()
  }

  async mint(to: ContractId, tokenId: BigNumber, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(to));
    parameters.addUint256(tokenId);
    return super._executeTransaction("mint", gas, parameters);
  }


  async mintTitle(beneficiary: ContractId, holder: ContractId, tokenId: BigNumber, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(beneficiary));
    parameters.addAddress(contractIdToAddress(holder));
    parameters.addUint256(tokenId);
    return super._executeTransaction("mintTitle", gas, parameters);
  }

  async name(gas: number): Promise<string> {
    let instance = await super._callQuery("name", gas);
    return instance.getString();
  }

  async onERC721Received(_operator: ContractId, _from: ContractId, _tokenId: BigNumber, _data: any, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(_operator));
    parameters.addAddress(contractIdToAddress(_from));
    parameters.addUint256(_tokenId);
    parameters.addBytes(_data);
    return super._executeTransaction("onERC721Received", gas, parameters);
  }

  async ownerOf(tokenId: BigNumber, gas: number): Promise<ContractId> {
    let parameters = new ContractFunctionParameters();
    parameters.addUint256(tokenId);
    let instance = await super._callQuery("ownerOf", gas, parameters);
    return addressToContractId(instance.getAddress());
  }

  async renounceMinter(gas: number): Promise<TransactionResponse> {
    return super._executeTransaction("renounceMinter", gas);
  }


  async renounceRole(role: any, account: ContractId, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes32(role);
    parameters.addAddress(contractIdToAddress(account));
    return super._executeTransaction("renounceRole", gas, parameters);
  }

  async restoreTitle(beneficiary: ContractId, holder: ContractId, tokenId: BigNumber, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(beneficiary));
    parameters.addAddress(contractIdToAddress(holder));
    parameters.addUint256(tokenId);
    return super._executeTransaction("restoreTitle", gas, parameters);
  }

  async revokeRole(role: any, account: ContractId, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addBytes32(role);
    parameters.addAddress(contractIdToAddress(account));
    return super._executeTransaction("revokeRole", gas, parameters);
  }


  async safeMint(to: ContractId, tokenId: BigNumber, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(to));
    parameters.addUint256(tokenId);
    // parameters.addBytes(_data);
    return super._executeTransaction("safeMint", gas, parameters);
  }

  async safeTransferFrom(from: ContractId, to: ContractId, tokenId: BigNumber, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(from));
    parameters.addAddress(contractIdToAddress(to));
    parameters.addUint256(tokenId);
    return super._executeTransaction("safeTransferFrom", gas, parameters);
  }

  async setApprovalForAll(to: ContractId, approved: boolean, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(to));
    parameters.addBool(approved);
    return super._executeTransaction("setApprovalForAll", gas, parameters);
  }

  async supportsInterface(interfaceId: any, gas: number): Promise<boolean> {//interfaceId Bytes4
    let parameters = new ContractFunctionParameters();
    parameters.addBytes(interfaceId);
    let instance = await super._callQuery("supportsInterface", gas, parameters);
    return instance.getBool();
  }

  async symbol(gas: number): Promise<string> {
    let instance = await super._callQuery("symbol", gas);
    return instance.getString();
  }

  async titleEscrowImplementation(gas: number): Promise<ContractId> {
    let instance = await super._callQuery("titleEscrowImplementation", gas);
    return addressToContractId(instance.getAddress());
  }

  async tokenURI(tokenId: BigNumber, gas: number): Promise<string> {
    let parameters = new ContractFunctionParameters();
    parameters.addUint256(tokenId);
    let instance = await super._callQuery("tokenURI", gas, parameters);
    return instance.getString();
  }

  async transferFrom(from: ContractId, to: ContractId, tokenId: BigNumber, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(from));
    parameters.addAddress(contractIdToAddress(to));
    parameters.addUint256(tokenId);
    return super._executeTransaction("transferFrom", gas, parameters);
  }

}
