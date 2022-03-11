import { DocumentStoreFactory } from "@tianhr/hedera-document-store";
import signale from "signale";
import { getLogger } from "../../logger";
import { DocumentStoreTransferOwnershipCommand } from "../../commands/document-store/document-store-command.type";
import { getClient,getGas } from "../utils/wallet";
import {  ContractId,TransactionReceipt } from "@hashgraph/sdk";

const { trace } = getLogger("document-store:transfer-ownership");

export const transferDocumentStoreOwnershipToWallet = async ({
  address,
  newOwner,
  network,
  ...rest
}: DocumentStoreTransferOwnershipCommand): Promise<TransactionReceipt> => {
  const client = await getClient({ network, ...rest });
  signale.await(`Sending transaction to pool`);
  const documentStore = new DocumentStoreFactory(client, ContractId.fromString(address));
  const transaction = await documentStore.transferOwnership(ContractId.fromString(newOwner), getGas());
  const transactionReceipt = await transaction.getReceipt(client)
  trace(`Tx contractId: ${transactionReceipt.contractId}`);
  return transactionReceipt;
};
