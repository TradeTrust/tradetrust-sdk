import { Argv } from "yargs";
import { deployTokenRegistry } from "../../implementations/deploy/token-registry";
import { error, info, success } from "signale";
import { getLogger } from "../../logger";
import { withNetworkAndWalletSignerOption } from "../shared";
import { getErrorMessage, getEtherscanAddress } from "../../utils";
import { DeployTokenRegistryCommand } from "./deploy.types";
import { ContractId } from "@hashgraph/sdk";
import { contractIdToAddress } from "@tianhr/hedera-token-registry";

const { trace } = getLogger("deploy:token-registry");

export const command = "token-registry <registry-name> <registry-symbol> [options]";

export const describe = "Deploys a token registry contract on the blockchain";

export const builder = (yargs: Argv): Argv =>
    withNetworkAndWalletSignerOption(
      yargs
        .positional("registry-name", {
          description: "Name of the token",
          normalize: true,
        })
        .positional("registry-symbol", {
          description: "Symbol of the token (typically 3 characters)",
          normalize: true,
        })
  );

export const handler = async (args: DeployTokenRegistryCommand): Promise<ContractId | undefined> => {
  trace(`Args: ${JSON.stringify(args, null, 2)}`);
  try {
    info(`Deploying token registry ${args.registryName}`);
    const tokenRegistry = await deployTokenRegistry(args);
    success(`Token registry deployed at ${tokenRegistry.contractId}`);
    if (tokenRegistry.contractId == null) throw new Error("TokenRegistry deploy transaction.contractId is null.");
    info(`Token Registry address: ${contractIdToAddress(tokenRegistry.contractId)}`)
    info(
      `Find more details at ${getEtherscanAddress({ network: args.network })}/hedera/search?q=${tokenRegistry.contractId}`
    );
    if (tokenRegistry.contractId == null) throw new Error("Token-registry deploy receipt.contractId is null.");
    return tokenRegistry.contractId;
  } catch (e) {
    error(getErrorMessage(e));
  }
};
