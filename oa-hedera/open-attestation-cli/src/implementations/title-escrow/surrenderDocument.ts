import signale from "signale";
import { getLogger } from "../../logger";
import { getClient,getGas } from "../utils/wallet";
import { connectToTitleEscrow } from "./helpers";
import { BaseTitleEscrowCommand as TitleEscrowSurrenderDocumentCommand } from "../../commands/title-escrow/title-escrow-command.type";
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

const { trace } = getLogger("title-escrow:surrenderDocument");

export const surrenderDocument = async ({
  tokenRegistry: address,
  tokenId,
  network,
  ...rest
}: TitleEscrowSurrenderDocumentCommand): Promise<TransactionReceipt> => {
  const client = await getClient({ network, ...rest });
  signale.await(`Sending transaction to pool`);
  const titleEscrow = await connectToTitleEscrow({ tokenId, address, client });
  // const transaction = await titleEscrow.transferTo(address, { gasPrice: gasPrice.mul(gasPriceScale) });
  const transaction = await titleEscrow.surrender(getGas());
  const transactionReceipt = await transaction.getReceipt(client)
  trace(`Tx contractId: ${transactionReceipt.contractId}`);
  return transactionReceipt;
};
