import { TradeTrustERC721Factory } from "@tianhr/hedera-token-registry";
import signale from "signale";
import { getLogger } from "../../logger";
import { getClient, getGas } from "../utils/wallet";
import { TokenRegistryIssueCommand } from "../../commands/token-registry/token-registry-command.type";
import { ContractId, TransactionReceipt } from "@hashgraph/sdk";
import BigNumber from "bignumber.js";

const { trace } = getLogger("token-registry:issue");

export const issueToTokenRegistry = async ({
  address,
  to,
  tokenId,
  network,
  ...rest
}: TokenRegistryIssueCommand): Promise<TransactionReceipt> => {
  const client = await getClient({ network, ...rest });
  signale.await(`Sending transaction to pool`);
  const erc721 = new TradeTrustERC721Factory(client, ContractId.fromString(address));
  // https://github.com/ethereum-ts/TypeChain/issues/150
  const transaction = await erc721.safeMint(
    ContractId.fromString(to),
    new BigNumber(tokenId),
    getGas()
  );
  const transactionReceipt = await transaction.getReceipt(client)
  trace(`Tx contractId: ${transactionReceipt.contractId}`);
  return transactionReceipt;
};
