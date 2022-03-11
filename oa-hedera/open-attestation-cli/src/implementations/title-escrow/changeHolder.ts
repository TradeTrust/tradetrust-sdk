import signale from "signale";
import { getLogger } from "../../logger";
import { getClient,getGas } from "../utils/wallet";
import { connectToTitleEscrow } from "./helpers";
import { TitleEscrowChangeHolderCommand } from "../../commands/title-escrow/title-escrow-command.type";
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
// import { TransactionReceipt } from "@ethersproject/providers";

const { trace } = getLogger("title-escrow:changeHolder");

export const changeHolderOfTitleEscrow = async ({
  tokenRegistry: address,
  to,
  tokenId,
  network,
  ...rest
}: TitleEscrowChangeHolderCommand): Promise<TransactionReceipt> => {
  const client = await getClient({ network, ...rest });
  signale.await(`Sending transaction to pool`);
  const titleEscrow = await connectToTitleEscrow({ tokenId, address, client });
  const transaction = await titleEscrow.changeHolder(ContractId.fromString(to), getGas());
  const transactionReceipt = await transaction.getReceipt(client)
  trace(`Tx contractId: ${transactionReceipt.contractId}`);
  return transactionReceipt;
};
