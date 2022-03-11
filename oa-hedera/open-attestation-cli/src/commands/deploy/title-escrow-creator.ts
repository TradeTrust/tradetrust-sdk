import { Argv } from "yargs";
import { error, info, success } from "signale";
import { getLogger } from "../../logger";
import { deployTitleEscrowCreator } from "../../implementations/deploy/title-escrow-creator";
import { DeployTitleEscrowCreatorCommand } from "./deploy.types";
import { withNetworkAndWalletSignerOption } from "../shared";
import { getErrorMessage, getEtherscanAddress } from "../../utils";
import { ContractId } from "@hashgraph/sdk";

const { trace } = getLogger("deploy:title-escrow-creator");

export const command = "title-escrow-creator [options]";

export const describe = "Deploys a (global) title escrow creator on the blockchain";

export const builder = (yargs: Argv): Argv => withNetworkAndWalletSignerOption(yargs);

export const handler = async (args: DeployTitleEscrowCreatorCommand): Promise<ContractId | undefined> => {
  trace(`Args: ${JSON.stringify(args, null, 2)}`);
  try {
    info(`Deploying title escrow creator`);
    const titleEscrowCreator = await deployTitleEscrowCreator(args);
    success(`Title escrow creator deployed at ${titleEscrowCreator.contractId}`);
    info(
      `Find more details at ${getEtherscanAddress({ network: args.network })}/hedera/search?q=${titleEscrowCreator.contractId}`
      );
    if (titleEscrowCreator.contractId == null) throw new Error("titleEscrowCreator deploy receipt.contractId is null.");
    return titleEscrowCreator.contractId;
  } catch (e) {
    error(getErrorMessage(e));
  }
};
