

import signale from "signale";
import { NetworkAndWalletSignerOption } from "../../commands/shared";
import { getClient } from "../utils/wallet";
import { FileId } from "@hashgraph/sdk";
import { HcsDid } from "@hashgraph/did-sdk-js";

export const create = async ({
  network,
  ...rest
}: NetworkAndWalletSignerOption & { progress?: (progress: number) => void }): Promise<string> => {
  signale.await(`Generating a did on Hedera`);
  const client = await getClient({ network, ...rest });
  const accountId = client.operatorAccountId;
  const publicKey = client.operatorPublicKey;
  if (!accountId || !publicKey) throw new Error("No accountId or publicKey to be found.");

  const did = new HcsDid(network, publicKey, FileId.fromString(accountId.toString()));
  const doc = did.generateDidDocument();

  signale.info(`Hedera did successfully created.`);

  return doc.getId();
};
