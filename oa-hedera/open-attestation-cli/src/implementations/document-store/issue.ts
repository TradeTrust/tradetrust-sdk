import { DocumentStoreFactory } from "@tianhr/hedera-document-store";
import signale from "signale";
import { getLogger } from "../../logger";
import { DocumentStoreIssueCommand } from "../../commands/document-store/document-store-command.type";
import { getClient,getGas } from "../utils/wallet";
import {ContractId,TransactionReceipt} from "@hashgraph/sdk";

const { trace } = getLogger("document-store:issue");

export const issueToDocumentStore = async ({
  address,
  hash,
  network,
  ...rest
}: DocumentStoreIssueCommand): Promise<TransactionReceipt> => {
  const client = await getClient({ network, ...rest });
  signale.await(`Sending transaction to pool`);
  const documentStore = new DocumentStoreFactory(client,ContractId.fromString(address));
  const isIssued = await documentStore.isIssued(hash, getGas());
  if (isIssued) signale.info(`The hash ${hash} has been issued`);
  const transaction = await documentStore.issue(hash, getGas());
  const transactionReceipt = await transaction.getReceipt(client)
  trace(`Tx contractId: ${transactionReceipt.contractId}`);
  return transactionReceipt;
};
