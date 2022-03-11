import { readFileSync } from "fs";
import signale from "signale";
import { ethers, getDefaultProvider, providers, Signer, Wallet } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import { addAddressPrefix } from "../../utils";
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
} from "@hashgraph/sdk";

import {
  isWalletOption,
  NetworkOption,
  PrivateKeyOption,
  WalletOrSignerOption,
} from "../../commands/shared";
import { readFile, readOpenAttestationFile } from "./disk";
import inquirer from "inquirer";

const getKeyFromFile = (file?: string): undefined | string => {
  return file ? readFileSync(file).toString().trim() : undefined;
};

// export type ConnectedSigner = Signer & {
//   readonly provider: Provider;
//   readonly publicKey?: never;
//   readonly privateKey?: never;
// };

export const getPrivateKey = ({ keyFile, key }: PrivateKeyOption): string | undefined => {
  if (key) {
    signale.warn(
      "Be aware that by using the `key` parameter, the private key may be stored in your machine's sh history"
    );
    signale.warn(
      "Other options are available: using a file with `key-file` option or using `OA_PRIVATE_KEY` environment variable"
    );
  }
  return key || getKeyFromFile(keyFile) || process.env["OA_PRIVATE_KEY"];
};

export const getGas = () => {
  return 750000;
};

export const getClient = async ({
  network,
  ...options
}: WalletOrSignerOption & Partial<NetworkOption>): Promise<Client> => {
  if (!isWalletOption(options)) throw new Error("Please supply an encrypted wallet path");

  let client: Client;
  if (network === "mainnet") {
    client = Client.forMainnet();
  } else if (network === "testnet") {
    client = Client.forTestnet();
  } else {
    client = Client.forPreviewnet();
  };

  const file = await readOpenAttestationFile(options.encryptedWalletPath);

  return client.setOperator(
    AccountId.fromString(file.operator.accountId),
    PrivateKey.fromString(file.operator.privateKey)
  );

};
