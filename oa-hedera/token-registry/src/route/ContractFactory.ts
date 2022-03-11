
import {
    Client,
    ContractFunctionParameters,
    ContractId,
    Hbar,
    ContractCallQuery,
    ContractCreateTransaction,
    FileCreateTransaction,
    FileAppendTransaction,
    ContractExecuteTransaction,
    TransactionReceipt,
    ContractFunctionResult,
    FileContentsQuery,
    TransactionResponse,
} from "@hashgraph/sdk";
// import { logger } from "../utils";
const MAX_FILE_SIZE = 4000;
const MAX_TX_FEE = new Hbar(5);

export class ContractFactory {

    readonly contractId?:ContractId;
    readonly client: Client;
    readonly _bytecode:string;

    constructor(client: Client,_bytecode:string,contractId?: ContractId) {
        this.contractId = contractId;
        this.client = client;
        this._bytecode = _bytecode;
    };
    
    async _deploy(gas:number,parameters?: ContractFunctionParameters,): Promise<TransactionReceipt> {

        // The contract bytecode is located on the `_bytecode` field
        let createSegment = this._bytecode.substring(0, MAX_FILE_SIZE);
        let appendSegment = this._bytecode.substring(MAX_FILE_SIZE, this._bytecode.length);

        // Create a file on Hedera which contains the contact bytecode.
        // Note: The contract bytecode **must** be hex encoded, it should not
        // be the actual data the hex represents
        if(this.client.operatorPublicKey==null)throw new Error("unknown client operator publicKey.");
        const fileCreateTransaction = await new FileCreateTransaction()
        .setKeys([this.client.operatorPublicKey])
        .setContents(createSegment)
        .setMaxTransactionFee(MAX_TX_FEE)
        .execute(this.client);

        // Fetch the receipt for transaction that created the file
        const receipt = await fileCreateTransaction.getReceipt(this.client);

        // The file ID is located on the transaction receipt
        const fileId = receipt.fileId;

        if (fileId == null) throw new Error("unknown first fileReceipt.");
        // logger.debug(`contract bytecode file: ${fileId.toString()}`);

        let nIters = Math.ceil(appendSegment.length / MAX_FILE_SIZE);
        for (var i = 0; i < nIters; i++) {
            let from = MAX_FILE_SIZE * i;
            let to = (i == nIters) ? from + appendSegment.length % MAX_FILE_SIZE : MAX_FILE_SIZE * (i + 1);
            let segment = appendSegment.substring(from, to);
            await (
                await new FileAppendTransaction()
                    .setNodeAccountIds([fileCreateTransaction.nodeId])
                    .setFileId(fileId)
                    .setContents(segment)
                    .setMaxTransactionFee(MAX_TX_FEE)
                    .execute(this.client)
            ).getReceipt(this.client);
            await new FileContentsQuery()
            .setFileId(fileId)
            .execute(this.client);
            // const contents = await new FileContentsQuery()
            // .setFileId(fileId)
            // .execute(this.client);
            // logger.debug(`File content length according to \`FileInfoQuery\`: ${contents.length}`);
        }
        // if (appendSegment){
        //     await (
        //         await new FileAppendTransaction()
        //             .setNodeAccountIds([fileCreateTransaction.nodeId])
        //             .setFileId(fileId)
        //             .setContents(appendSegment)
        //             .setMaxTransactionFee(MAX_TX_FEE)
        //             .execute(this.client)
        //     ).getReceipt(this.client);
        //     const contents = await new FileContentsQuery()
        //     .setFileId(fileId)
        //     .execute(this.client);
        //     logger.debug(`File content length according to \`FileInfoQuery\`: ${contents.length}`);
        // }

        // Create the contract
        const txResponse = await new ContractCreateTransaction()
        // Set gas to create the contract
        .setGas(gas)
        // The contract bytecode must be set to the file ID containing the contract bytecode
        .setBytecodeFileId(fileId)
        // Set the admin key on the contract in case the contract should be deleted or
        // updated in the future
        .setAdminKey(this.client.operatorPublicKey);
        
        // Set the parameters that should be passed to the contract constructor
        // as the only parameter that is passed to the contract
        if (parameters) {
            txResponse.setConstructorParameters(parameters);
        };

        let contractTransactionResponse = await txResponse.execute(this.client)

        // Fetch the receipt for the transaction that created the contract
        const contractReceipt = await contractTransactionResponse.getReceipt(
            this.client
        );

        // The conract ID is located on the transaction receipt
        const contractId = contractReceipt.contractId;
        
        if(contractId==null)throw new Error("unknown contractId.");
        // logger.debug(`new contract ID: ${contractId.toString()}`);

        return contractReceipt
    }

    // Call a method on a contract that exists on Hedera
    // Note: `ContractCallQuery` cannot mutate a contract, it will only return the last state
    // of the contract
    async _callQuery(functionName: string,gas:number, parameters?: ContractFunctionParameters): Promise<ContractFunctionResult> {
        if (!this.contractId) throw new Error("unknown contractId.");
        // logger.debug("Hedera callQuery contract function: ", functionName);
        const contractCallResult = await new ContractCallQuery()
            // Set the gas to execute a contract call
            .setGas(gas)
            // Set which contract
            .setContractId(this.contractId)
            // Set the function and parameters to call on the contract
            .setFunction(functionName, parameters)
            .setQueryPayment(new Hbar(3))
            .execute(this.client);
        
        if(contractCallResult.errorMessage != null &&
            contractCallResult.errorMessage != "")throw new Error(`error calling contract: ${contractCallResult.errorMessage}`);
        return contractCallResult;
    }

    // Call a method on a contract exists on Hedera, but is allowed to mutate the contract state
    async _executeTransaction(functionName: string,gas:number, parameters?: ContractFunctionParameters): Promise<TransactionResponse> {
        if (!this.contractId) throw new Error("unknown contractId.");
        // logger.debug("Hedera execute contract transaction: ", functionName);
        const contractExecTransactionResponse = await new ContractExecuteTransaction()
            .setContractId(this.contractId)
            .setGas(gas)
            .setFunction(functionName, parameters)
            .execute(this.client);

        await contractExecTransactionResponse.getReceipt(this.client);

        return contractExecTransactionResponse;
    }

}
