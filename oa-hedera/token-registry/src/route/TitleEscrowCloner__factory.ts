import { ContractFactory } from "./ContractFactory";
import {
  TransactionResponse,
  ContractFunctionParameters,
  ContractId,
  Client,
} from "@hashgraph/sdk";
import titleEscrowCloner from "./build/TitleEscrowCloner.sol/TitleEscrowCloner.json";
import { contractIdToAddress,addressToContractId } from "../utils";

export class TitleEscrowCloner__factory extends ContractFactory {

  constructor(client: Client, contractId?: ContractId) {
    super(client, titleEscrowCloner.bytecode, contractId);
  }

  async deployNewTitleEscrow(tokenRegistry: ContractId, beneficiary: ContractId, holder: ContractId, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addAddress(contractIdToAddress(tokenRegistry));
    parameters.addAddress(contractIdToAddress(beneficiary));
    parameters.addAddress(contractIdToAddress(holder));
    return super._executeTransaction("deployNewTitleEscrow", gas, parameters);
  }

  async titleEscrowImplementation(gas: number): Promise<ContractId> {
    let instance = await super._callQuery("titleEscrowImplementation", gas);
    return addressToContractId(instance.getAddress());
  }

}
