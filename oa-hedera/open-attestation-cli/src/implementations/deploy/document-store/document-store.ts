import { DocumentStoreFactory } from "@tianhr/hedera-document-store";
import signale from "signale";
import { DeployDocumentStoreCommand } from "../../../commands/deploy/deploy.types";
import { getLogger } from "../../../logger";
import { getClient, getGas } from "../../utils/wallet";
import { ContractFunctionParameters, ContractId } from "@hashgraph/sdk";

const { trace } = getLogger("deploy:document-store");

export const deployDocumentStore = async ({
  storeName,
  network,
  ...rest
}: DeployDocumentStoreCommand): Promise<{ contractId: ContractId }> => {
  const client = await getClient({ network, ...rest });
  const factory = new DocumentStoreFactory(client);
  signale.await(`Sending transaction to pool`);
  let parameters = new ContractFunctionParameters();
  parameters.addString(storeName);
  const transaction = await factory._deploy(getGas(), parameters);
  trace(`Tx contractId: ${transaction.contractId}`);
  if (transaction.contractId == null) throw new Error("DocumentStore deploy transaction.contractId is null.");
  return { contractId: transaction.contractId };
};
