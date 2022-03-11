import { DocumentStoreFactory } from "@tianhr/hedera-document-store";
import signale from "signale";
import { getLogger } from "../../logger";
import { DocumentStoreRevokeCommand } from "../../commands/document-store/document-store-command.type";
import { getClient,getGas } from "../utils/wallet";
import { ContractId,TransactionReceipt } from "@hashgraph/sdk";

const { trace } = getLogger("document-store:revoke");

export const revokeToDocumentStore = async ({
  address,
  hash,
  network,
  ...rest
}: DocumentStoreRevokeCommand): Promise<TransactionReceipt> => {
  const client = await getClient({ network, ...rest });
  signale.await(`Sending transaction to pool`);
  const documentStore = new DocumentStoreFactory(client, ContractId.fromString(address));
  const isRevoked = await documentStore.isRevoked(hash, getGas());
  if (isRevoked) signale.info(`The hash ${hash} has been isRevoked`);
  const transaction = await documentStore.revoke(hash,getGas() );
  const transactionReceipt = await transaction.getReceipt(client)
  trace(`Tx contractId: ${transactionReceipt.contractId}`);
  return transactionReceipt;
};
