
import {
  ContractFunctionParameters,
  TransactionResponse,
  ContractId,
  Client,
} from "@hashgraph/sdk";

import { ContractFactory } from "./ContractFactory";
import documentStoreCreator from "./build/DocumentStoreCreator.json";

export class DocumentStoreCreator__factory extends ContractFactory {

  constructor(client: Client, contractId?: ContractId) {
    super(client, documentStoreCreator.bytecode, contractId);
  }

  deploy(name: string, gas: number): Promise<TransactionResponse> {
    let parameters = new ContractFunctionParameters();
    parameters.addString(name);
    return super._executeTransaction("deploy", gas, parameters);
  }

}