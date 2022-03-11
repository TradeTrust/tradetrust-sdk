import signale from "signale";
import { getLogger } from "../../logger";
import { getClient,getGas } from "../utils/wallet";
import { connectToTitleEscrow, validateEndorseChangeOwner } from "./helpers";
import { TitleEscrowEndorseChangeOfOwnerCommand } from "../../commands/title-escrow/title-escrow-command.type";
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

const { trace } = getLogger("title-escrow:endorseChangeOfOwner");

export const endorseChangeOfOwner = async ({
  tokenRegistry: address,
  tokenId,
  newHolder,
  newOwner,
  network,
  ...rest
}: TitleEscrowEndorseChangeOfOwnerCommand): Promise<TransactionReceipt> => {
  const client = await getClient({ network, ...rest });
  signale.await(`Sending transaction to pool`);
  const titleEscrow = await connectToTitleEscrow({ tokenId, address, client });
  await validateEndorseChangeOwner({ newHolder, newOwner, titleEscrow });
  const transaction = await titleEscrow.transferToNewEscrow(ContractId.fromString(newOwner), ContractId.fromString(newHolder), getGas());
  const transactionReceipt = await transaction.getReceipt(client)
  trace(`Tx contractId: ${transactionReceipt.contractId}`);
  return transactionReceipt;
};
