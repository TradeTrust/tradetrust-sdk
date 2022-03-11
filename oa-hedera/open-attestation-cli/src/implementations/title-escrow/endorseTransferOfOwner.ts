import signale from "signale";
import { getLogger } from "../../logger";
import { getClient, getGas } from "../utils/wallet";
import { connectToTitleEscrow, validateEndorseTransferOwner } from "./helpers";
import { BaseTitleEscrowCommand as TitleEscrowEndorseTransferOfOwnerCommand } from "../../commands/title-escrow/title-escrow-command.type";
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


const { trace } = getLogger("title-escrow:endorseTransferOfOwner");

export const endorseTransferOfOwner = async ({
  tokenRegistry: address,
  tokenId,
  network,
  ...rest
}: TitleEscrowEndorseTransferOfOwnerCommand): Promise<{
  transactionReceipt: TransactionReceipt;
  approvedOwner: string;
  approvedHolder: string;
}> => {
  const client = await getClient({ network, ...rest });
  signale.await(`Sending transaction to pool`);
  const titleEscrow = await connectToTitleEscrow({ tokenId, address, client });
  const approvedBeneficiary = await titleEscrow.approvedBeneficiary(getGas());
  const approvedHolder = await titleEscrow.approvedHolder(getGas());
  validateEndorseTransferOwner({ approvedOwner: approvedBeneficiary.toString(), approvedHolder: approvedHolder.toString() });
  const transaction = await titleEscrow.transferToNewEscrow(approvedBeneficiary, approvedHolder, getGas());
  const transactionReceipt = await transaction.getReceipt(client)
  trace(`Tx contractId: ${transactionReceipt.contractId}`);
  return {
    transactionReceipt,
    approvedOwner: approvedBeneficiary.toString(),
    approvedHolder: approvedHolder.toString(),
  };;
};
