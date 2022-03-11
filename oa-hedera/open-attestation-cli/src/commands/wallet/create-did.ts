import { Argv } from "yargs";
import signale, { error, info } from "signale";
import { getLogger } from "../../logger";
import { getErrorMessage, highlight } from "../../utils";
import { create } from "../../implementations/wallet/create-did";
import { withNetworkAndWalletSignerOption,NetworkAndWalletSignerOption } from "../shared";

const { trace } = getLogger("wallet:create did");

export const command = "create did [options]";

export const describe = "Create a random wallet and encrypt the result into the provided path";

export const builder = (yargs: Argv): Argv =>
  withNetworkAndWalletSignerOption(yargs);

export const handler = async (args: NetworkAndWalletSignerOption): Promise<void> => {
  trace(`Args: ${JSON.stringify(args, null, 2)}`);
  try {
    info(`Creating a hedera did`);
    const did = await create(args);
    signale.success(`Hedera did is ${highlight(did)}`);
  } catch (e) {
    error(getErrorMessage(e));
  }
};
