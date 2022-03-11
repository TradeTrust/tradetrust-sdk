import { TitleEscrowCloneableFactory,TradeTrustERC721Factory } from "@tianhr/hedera-token-registry";
import signale from "signale";
import { getLogger } from "../../logger";
import { getClient,getGas } from "../utils/wallet";
import { BaseTitleEscrowCommand as TitleEscrowSurrenderDocumentCommand } from "../../commands/title-escrow/title-escrow-command.type";
import {  TransactionReceipt,ContractId } from "@hashgraph/sdk";
import BigNumber from "bignumber.js";

const { trace } = getLogger("title-escrow:acceptSurrendered");

export const acceptSurrendered = async ({
  tokenRegistry: address,
  tokenId,
  network,
  ...rest
}: TitleEscrowSurrenderDocumentCommand): Promise<TransactionReceipt> => {
  const client = await getClient({ network, ...rest });
  const tokenRegistryInstance = new TradeTrustERC721Factory(client,ContractId.fromString(address));
  signale.await(`Sending transaction to pool`);
  const transaction = await tokenRegistryInstance.destroyToken(new BigNumber(tokenId), getGas());
  const transactionReceipt = await transaction.getReceipt(client)
  trace(`Tx contractId: ${transactionReceipt.contractId}`);
  return transactionReceipt;
};
