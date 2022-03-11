import { NetworkAndWalletSignerOption } from "../shared";

export type TokenRegistryIssueCommand = NetworkAndWalletSignerOption &
  {
    address: string;
    to: string;
    tokenId: string;
  };
