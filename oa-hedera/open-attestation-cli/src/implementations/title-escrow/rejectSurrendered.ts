import { TradeTrustERC721Factory, TitleEscrowCloneableFactory, getEventsFromMirror,addressToContractId } from "@tianhr/hedera-token-registry";
import signale from "signale";
import { getLogger } from "../../logger";
import { getClient, getGas } from "../utils/wallet";
import { BaseTitleEscrowCommand as TitleEscrowSurrenderDocumentCommand } from "../../commands/title-escrow/title-escrow-command.type";
import { Client, ContractId } from "@hashgraph/sdk";
import BigNumber from "bignumber.js";

const { trace } = getLogger("title-escrow:acceptSurrendered");

const retrieveLastBeneficiaryAndHolder = async (
  clietn: Client,
  network: string,
  address: string,
  tokenId: string
): Promise<{ lastBeneficiary: ContractId; lastHolder: ContractId }> => {
  // Fetch transfer logs from token registry
  signale.info(`Getting event(s) from mirror`);
  signale.info(`Waiting 10s to allow transaction propagation to mirror`);
  // Search topics timestamp lower and upper bounds must be positive and within 7d
  const time = new Date();
  const curTime = time.getTime().toString().substr(0, 10);
  const weekTime = (new Date(time.getTime() - 7 * 24 * 60 * 60 * 1000).getTime() + 1000).toString().substr(0, 10);
  const path = `/contracts/${address}/results/logs?order=desc&timestamp=gte%3A${weekTime}&timestamp=lte%3A${curTime}&topic3=${tokenId}`;
  const logs = await getEventsFromMirror(network, path, "TradeTrustERC721", "Transfer")
  const lastTitleEscrowAddress = logs[0].to;
  const lastTitleEscrowInstance = new TitleEscrowCloneableFactory(clietn, ContractId.fromSolidityAddress(lastTitleEscrowAddress));
  const lastBeneficiary = await lastTitleEscrowInstance.beneficiary(getGas());
  const lastHolder = await lastTitleEscrowInstance.holder(getGas());
  return { lastBeneficiary, lastHolder };
};

export const rejectSurrendered = async ({
  tokenRegistry: address,
  tokenId,
  network,
  ...rest
}: TitleEscrowSurrenderDocumentCommand): Promise<ContractId> => {
  const client = await getClient({ network, ...rest });
  const tokenRegistryInstance = new TradeTrustERC721Factory(client, ContractId.fromString(address));
  signale.await(`Sending transaction to pool`);
  const { lastBeneficiary, lastHolder } = await retrieveLastBeneficiaryAndHolder(
    client,
    network,
    address,
    tokenId
  );

  const transaction = await tokenRegistryInstance.restoreTitle(
    lastBeneficiary,
    lastHolder,
    new BigNumber(tokenId),
    getGas()
  );
  var txRecord = await transaction.getRecord(client);
  if (!txRecord.contractFunctionResult) throw new Error("unknown transaction record.");
  trace(`Tx contractId: ${addressToContractId(txRecord.contractFunctionResult.getAddress())}`);
  return addressToContractId(txRecord.contractFunctionResult.getAddress());
};
