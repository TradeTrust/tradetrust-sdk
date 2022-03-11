import { NetworkAndWalletSignerOption } from "../shared";

export type DeployDocumentStoreCommand = NetworkAndWalletSignerOption &
{
  storeName: string;
};

export type DeployTokenRegistryCommand = NetworkAndWalletSignerOption &
{
  registryName: string;
  registrySymbol: string;
};

export type DeployTitleEscrowCreatorCommand = NetworkAndWalletSignerOption;

export type DeployTitleEscrowCommand = NetworkAndWalletSignerOption &
{
  tokenRegistry: string;
  beneficiary: string;
  holder: string;
  titleEscrowFactory?: string;
};
