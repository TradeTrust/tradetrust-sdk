import { Argv } from "yargs";
import { error, info, success } from "signale";
import { getLogger } from "../../logger";
import { deployDocumentStore } from "../../implementations/deploy/document-store";
import { DeployDocumentStoreCommand } from "./deploy.types";
import { withNetworkAndWalletSignerOption } from "../shared";
import { getErrorMessage, getEtherscanAddress, highlight } from "../../utils";
import { ContractId } from "@hashgraph/sdk";
import { contractIdToAddress } from "@tianhr/hedera-document-store";

const { trace } = getLogger("deploy:document-store");

export const command = "document-store <store-name> [options]";

export const describe = "Deploys a document store contract on the blockchain";

export const builder = (yargs: Argv): Argv =>
  withNetworkAndWalletSignerOption(
    yargs.positional("store-name", {
      description: "Name of the store",
      normalize: true,
    })
  );

export const handler = async (args: DeployDocumentStoreCommand): Promise<ContractId | undefined> => {
  trace(`Args: ${JSON.stringify(args, null, 2)}`);
  try {
    info(`Deploying document store ${args.storeName}`);
    const documentStore = await deployDocumentStore(args);
    success(`Document store ${args.storeName} deployed at ${highlight(documentStore.contractId)}`);
    info(`Document store address: ${contractIdToAddress(documentStore.contractId)}`)
    info(
      `Find more details at ${getEtherscanAddress({ network: args.network })}/hedera/search?q=${documentStore.contractId}`
    );
    return documentStore.contractId;
  } catch (e) {
    error(getErrorMessage(e));
  }
};
