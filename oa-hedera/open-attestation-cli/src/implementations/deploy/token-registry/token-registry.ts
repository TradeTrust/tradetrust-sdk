import { TradeTrustERC721Factory } from "@tianhr/hedera-token-registry";
import { getClient,getGas } from "../../utils/wallet";
import signale from "signale";
import { getLogger } from "../../../logger";
import { DeployTokenRegistryCommand } from "../../../commands/deploy/deploy.types";
import { ContractFunctionParameters, TransactionReceipt } from "@hashgraph/sdk";

const { trace } = getLogger("deploy:token-registry");

export const deployTokenRegistry = async ({
  registryName,
  registrySymbol,
  network,
  ...rest
}: DeployTokenRegistryCommand): Promise<TransactionReceipt> => {
  const client = await getClient({ network, ...rest });
  const factory = new TradeTrustERC721Factory(client);
  signale.await(`Sending transaction to pool`);
  let parameters = new ContractFunctionParameters();
  parameters.addString(registryName);
  parameters.addString(registrySymbol);
  const transaction = await factory._deploy(getGas(),parameters);
  
  trace(`Tx contractId: ${transaction.accountId}`);
  return transaction;
};
