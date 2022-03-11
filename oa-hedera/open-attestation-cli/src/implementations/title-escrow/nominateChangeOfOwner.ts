import signale from "signale";
import { getLogger } from "../../logger";
import { getClient,getGas } from "../utils/wallet";
import { connectToTitleEscrow, validateNominateChangeOwner } from "./helpers";
import { TitleEscrowNominateChangeOfOwnerCommand } from "../../commands/title-escrow/title-escrow-command.type";

import {
  Client,
  PrivateKey,
  ContractCreateTransaction,
  ContractExecuteTransaction,
  FileCreateTransaction,
  ContractFunctionParameters,
  ContractCallQuery,
  Hbar,
  AccountId,
  TransactionReceipt,
  ContractId,
} from "@hashgraph/sdk";

const { trace } = getLogger("title-escrow:nominateChangeOfOwner");

export const nominateChangeOfOwner = async ({
  tokenRegistry: address,
  tokenId,
  newOwner,
  network,
  ...rest
}: TitleEscrowNominateChangeOfOwnerCommand): Promise<TransactionReceipt> => {
  const client = await getClient({ network, ...rest });
  signale.await(`Sending transaction to pool`);
  const titleEscrow = await connectToTitleEscrow({ tokenId, address, client });
  const holder = await titleEscrow.holder(getGas());
  await validateNominateChangeOwner({ newOwner, titleEscrow });
  const transaction = await titleEscrow.approveNewTransferTargets(ContractId.fromString(newOwner), holder, getGas());
  const transactionReceipt = await transaction.getReceipt(client)
  trace(`Tx contractId: ${transactionReceipt.contractId}`);
  return transactionReceipt;
};
