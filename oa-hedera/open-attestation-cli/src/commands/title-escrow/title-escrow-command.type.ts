import { NetworkAndWalletSignerOption } from "../shared";

export type BaseTitleEscrowCommand = NetworkAndWalletSignerOption &
   {
    tokenRegistry: string;
    tokenId: string;
  };
export type TitleEscrowChangeHolderCommand = BaseTitleEscrowCommand & {
  to: string;
};

export type TitleEscrowEndorseChangeOfOwnerCommand = BaseTitleEscrowCommand & {
  newHolder: string;
  newOwner: string;
};

export type TitleEscrowNominateChangeOfOwnerCommand = BaseTitleEscrowCommand & {
  newOwner: string;
};
