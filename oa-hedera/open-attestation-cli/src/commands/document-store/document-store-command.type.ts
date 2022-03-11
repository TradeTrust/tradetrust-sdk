import { NetworkAndWalletSignerOption } from "../shared";

export type DocumentStoreIssueCommand = NetworkAndWalletSignerOption &
{
  address: string;
  hash: string;
};

export type DocumentStoreRevokeCommand = NetworkAndWalletSignerOption &
{
  address: string;
  hash: string;
};

export type DocumentStoreTransferOwnershipCommand = NetworkAndWalletSignerOption &
{
  address: string;
  newOwner: string;
};
