import { Argv } from "yargs";
import { error, info, success } from "signale";
import { getLogger } from "../../logger";
import { deployTitleEscrow } from "../../implementations/deploy/title-escrow";
import { DeployTitleEscrowCommand } from "./deploy.types";
import { withNetworkAndWalletSignerOption } from "../shared";
import { getErrorMessage, getEtherscanAddress } from "../../utils";
import { ContractId } from "@hashgraph/sdk";

const { trace } = getLogger("deploy:title-escrow");

export const command = "title-escrow [options]";

export const describe = "Deploys a title escrow on the blockchain";

export const builder = (yargs: Argv): Argv =>
  withNetworkAndWalletSignerOption(
    yargs
      .option("token-registry", {
        alias: "r",
        description: "Address of ERC721 contract that the escrow will receive the token from",
        type: "string",
        normalize: true,
        required: true,
      })
      .option("beneficiary", {
        alias: "b",
        description: "Beneficiary address",
        type: "string",
        normalize: true,
        required: true,
      })
      .option("holder", {
        alias: "h",
        description: "Holder address",
        type: "string",
        normalize: true,
        required: true,
      })
      .option("title-escrow-factory", {
        alias: "c",
        description: "Address of title escrow creator/factory",
        type: "string",
        normalize: true,
      })
  );

export const handler = async (args: DeployTitleEscrowCommand): Promise<ContractId | undefined> => {
  trace(`Args: ${JSON.stringify(args, null, 2)}`);
  try {
    info(`Deploying title escrow`);
    const titleEscrow = await deployTitleEscrow(args);
    success(`Title Escrow title escrow contractId is ${titleEscrow}`);
    info(
      `Find more details at ${getEtherscanAddress({ network: args.network })}/hedera/search?q=${args.tokenRegistry}`
    );
    if (titleEscrow == null) throw new Error("Title-escrow deploy receipt.contractId is null.");
    return titleEscrow;
  } catch (e) {
    error(getErrorMessage(e));
  }
};
