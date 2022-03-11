import { TitleEscrowCloneableFactory,TradeTrustERC721Factory } from "@tianhr/hedera-token-registry";
import { constants } from "ethers";
import signale from "signale";
import { getGas } from "../utils/wallet";
import { Client, ContractId } from "@hashgraph/sdk";
import BigNumber from "bignumber.js";

interface ConnectToTitleEscrowArgs {
  tokenId: string;
  address: string;
  client: Client;
}

export const connectToTitleEscrow = async ({
  tokenId,
  address,
  client,
}: ConnectToTitleEscrowArgs): Promise<TitleEscrowCloneableFactory> => {
  const tokenRegistry = new TradeTrustERC721Factory(client,ContractId.fromString(address));
  const titleEscrowAddress = await tokenRegistry.ownerOf(new BigNumber(tokenId),getGas());
  const titleEscrow = new TitleEscrowCloneableFactory(client,titleEscrowAddress);
  return titleEscrow;
};

interface validateEndorseChangeOwnerArgs {
  newHolder: string;
  newOwner: string;
  titleEscrow: TitleEscrowCloneableFactory;
}
export const validateEndorseChangeOwner = async ({
  newHolder,
  newOwner,
  titleEscrow,
}: validateEndorseChangeOwnerArgs): Promise<void> => {
  const beneficiary = await titleEscrow.beneficiary(getGas());
  const holder = await titleEscrow.holder(getGas());
  if (newOwner === beneficiary.toString() && newHolder === holder.toString()) {
    const error = "new owner and new holder addresses are the same as the current owner and holder addresses";
    signale.error(error);
    throw new Error(error);
  }
};

interface validateNominateChangeOwnerArgs {
  newOwner: string;
  titleEscrow: TitleEscrowCloneableFactory;
}
export const validateNominateChangeOwner = async ({
  newOwner,
  titleEscrow,
}: validateNominateChangeOwnerArgs): Promise<void> => {
  const beneficiary = await titleEscrow.beneficiary(getGas());
  if (newOwner === beneficiary.toString()) {
    const error = "new owner address is the same as the current owner address";
    signale.error(error);
    throw new Error(error);
  }
};

interface validateEndorseTransferOwnerArgs {
  approvedOwner: string | undefined;
  approvedHolder: string | undefined;
}
const GENESIS_ADDRESS = constants.AddressZero;
export const validateEndorseTransferOwner = ({
  approvedOwner,
  approvedHolder,
}: validateEndorseTransferOwnerArgs): void => {
  if (!approvedOwner || !approvedHolder || approvedOwner === GENESIS_ADDRESS || approvedHolder === GENESIS_ADDRESS) {
    const error = `there is no approved owner or holder or the approved owner or holder is equal to the genesis address: ${GENESIS_ADDRESS}`;
    signale.error(error);
    throw new Error(error);
  }
};

