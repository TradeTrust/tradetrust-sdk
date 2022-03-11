import { Argv } from "yargs";

export const command = "wallet <method>";

export const describe = "Manage Hedera Account";

export const builder = (yargs: Argv): Argv => yargs.commandDir("wallet", { extensions: ["ts", "js"] });

export const handler = (): void => {};
