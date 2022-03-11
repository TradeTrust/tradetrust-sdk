import { TitleEscrowClonerFactory, addressToContractId } from "@tianhr/hedera-token-registry";
import { getClient, getGas } from "../../utils/wallet";
import signale from "signale";
import { getLogger } from "../../../logger";
import { DeployTitleEscrowCommand } from "../../../commands/deploy/deploy.types";
import {  ContractId, } from "@hashgraph/sdk";

const { trace } = getLogger("deploy:title-escrow");

export const deployTitleEscrow = async ({
  tokenRegistry,
  beneficiary,
  holder,
  titleEscrowFactory,
  network,
  ...rest
}: DeployTitleEscrowCommand): Promise<ContractId> => {
  // validateAddress(tokenRegistry);
  // validateAddress(beneficiary);
  // validateAddress(holder);
  // validateAddress(titleEscrowFactoryAddress);
  const client = await getClient({ network, ...rest });

  signale.await(`Sending transaction to pool`);
  const factory = new TitleEscrowClonerFactory(client,ContractId.fromString(tokenRegistry));
  const titleEscrowTx = await factory.deployNewTitleEscrow(
    ContractId.fromString(tokenRegistry),
    ContractId.fromString(beneficiary),
    ContractId.fromString(holder),
    getGas()
  );
  var txRecord = await titleEscrowTx.getRecord(client);
  if (!txRecord.contractFunctionResult) throw new Error("unknown transaction record.");
  trace(`Tx contractId: ${addressToContractId(txRecord.contractFunctionResult.getAddress())}`);
  // const event = await getEventsFromRecord(txRecord, "TitleEscrowDeployed", "TitleEscrowCloner");
  // const escrowAddress = (addressToContractId(event.escrowAddress));
  return addressToContractId(txRecord.contractFunctionResult.getAddress());
};
