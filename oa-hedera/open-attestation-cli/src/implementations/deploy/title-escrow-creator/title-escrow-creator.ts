import { TitleEscrowClonerFactory } from "@tianhr/hedera-token-registry";
import { getClient,getGas } from "../../utils/wallet";
import signale from "signale";
import { getLogger } from "../../../logger";
import { DeployTitleEscrowCreatorCommand } from "../../../commands/deploy/deploy.types";
import { TransactionReceipt } from "@hashgraph/sdk";

const { trace } = getLogger("deploy:title-escrow-creator");

export const deployTitleEscrowCreator = async ({
  network,
  ...rest
}: DeployTitleEscrowCreatorCommand): Promise<TransactionReceipt> => {
  const client = await getClient({ network, ...rest });

  const factory = new TitleEscrowClonerFactory(client);
  signale.await(`Sending transaction to pool`);
  const transaction = await factory._deploy(getGas());
  trace(`Tx contractId: ${transaction.contractId}`);
  return transaction;
};
