import { Argv } from "yargs";

export interface NetworkOption {
  network: string;
}

// it should be a union, because we expect one or the other key. However I couldn't find a clean way to handle this, with the rest of the code
export type PrivateKeyOption =
  | {
      key?: string;
      keyFile?: never;
    }
  | {
      key?: never;
      keyFile?: string;
    };

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isPrivateKeyOption = (option: any): option is PrivateKeyOption => {
  return typeof option?.key === "string" || typeof option?.keyFile === "string";
};

export type AwsKmsSignerOption = {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  kmsKeyId: string;
};

export type WalletOption = {
  encryptedWalletPath: string;
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isWalletOption = (option: any): option is WalletOption => {
  return typeof option?.encryptedWalletPath === "string";
};

export type WalletOrSignerOption = Partial<PrivateKeyOption> | Partial<AwsKmsSignerOption> | Partial<WalletOption>;

export type NetworkAndWalletSignerOption = NetworkOption & (Partial<WalletOption> | Partial<PrivateKeyOption>);

export const withNetworkOption = (yargs: Argv): Argv =>
  yargs.option("network", {
    alias: "n",
    choices: ["mainnet", "testnet", "previewnet"],
    default: "testnet",
    description: "Hedera network to deploy to",
  });

export const withPrivateKeyOption = (yargs: Argv): Argv =>
  yargs
    .option("key", {
      alias: "k",
      type: "string",
      description: "Private key of owner account",
    })
    .option("key-file", {
      alias: "f",
      type: "string",
      description: "Path to file containing private key of owner account",
    });

export const withWalletOption = (yargs: Argv): Argv =>
  yargs.option("encrypted-wallet-path", {
    type: "string",
    description: "Path to file containing private key of owner account",
    normalize: true,
  });

export const withNetworkAndWalletSignerOption = (yargs: Argv): Argv =>
  withNetworkOption(withWalletOption(withPrivateKeyOption(yargs)));
