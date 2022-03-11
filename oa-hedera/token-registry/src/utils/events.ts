import { TransactionRecord } from "@hashgraph/sdk";
// import { logger } from "./logger";
// import * as fs from "fs";
import Web3 from "web3";
import axios from "axios";
// import path from "path";
const web3 = new Web3;
import TitleEscrowCloneable from "../route/build/TitleEscrowCloneable.sol/TitleEscrowCloneable.json";
import TradeTrustERC721 from "../route/build/TradetrustERC721.sol/TradeTrustERC721.json";
import TitleEscrowCloner from "../route/build/TitleEscrowCloner.sol/TitleEscrowCloner.json";



// Gets events from a contract function invocation using a TransactionRecord
export const getEventsFromRecord = async (record: TransactionRecord, eventName: string, contractsName: string): Promise<{ [key: string]: string; }> => {
    // logger.debug(`Getting ${eventName} event(s) from record`);
    // let contractsPath = path.resolve(__dirname, '../route/build/' + contractsName + '.sol/' + contractsName + '.json');
    // let abi = JSON.parse(fs.readFileSync(contractsPath, 'utf8'));
    let contractsJson: any;
    switch (contractsName) {
        case "TitleEscrowCloneable":
            contractsJson = TitleEscrowCloneable;
            break;
        case "TradeTrustERC721":
            contractsJson = TradeTrustERC721;
            break;
        case "TitleEscrowCloner":
            contractsJson = TitleEscrowCloner;
            break;
        default:
            throw new Error(`No contracts name found：${contractsName} `);
    }
    if (record.contractFunctionResult == null) throw new Error("TransactionRecord contractFunctionResult is null.");
    let event: { [key: string]: string; } = {};
    record.contractFunctionResult.logs.forEach((log) => {
        // convert the log.data (uint8Array) to a string
        let logStringHex = '0x'.concat(Buffer.from(log.data).toString('hex'));
        // get topics from log
        let logTopics: string[] = [];
        log.topics.forEach(topic => {
            logTopics.push('0x'.concat(Buffer.from(topic).toString('hex')));
        });
        // decode the event data
        event = decodeEvent(contractsJson.abi, eventName, logStringHex, logTopics.slice(1));
    });
    return event;
};

export const getHederaMirrorAddress = (network: string): string =>
    `https://${network === "mainnet" ? "mainnet-public" : `${network}`}.mirrornode.hedera.com/api/v1`

/**
 * Gets all the events for a given ContractId from a mirror node
 * Note: To particular filtering is implemented here, in practice you'd only want to query for events
 * in a time range or from a given timestamp for example
 * @param contractId
 */
export const getEventsFromMirror = async (network: string, urlPath: string, contractsName: string, eventName: string): Promise<{ [key: string]: string; }[]> => {
    // logger.debug(`Getting event(s) from mirror`);
    // logger.debug(`Waiting 10s to allow transaction propagation to mirror`);
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    await delay(10000);
    const url = `${getHederaMirrorAddress(network)}` + urlPath
    // /contracts/${contractId.toString()}/results/logs?order=desc&timestamp=gte%3A${weekTime}&timestamp=lte%3A${curTime}&topic3=${tokenId}`;
    // let contractsPath = path.join(__dirname, '../route/build/' + contractsName + '.sol/' + contractsName + '.json');
    // let contractsJson = JSON.parse(fs.readFileSync(contractsPath, 'utf8'));
    let contractsJson: any;
    switch (contractsName) {
        case "TitleEscrowCloneable":
            contractsJson = TitleEscrowCloneable;
            break;
        case "TradeTrustERC721":
            contractsJson = TradeTrustERC721;
            break;
        case "TitleEscrowCloner":
            contractsJson = TitleEscrowCloner;
            break;
        default:
            throw new Error(`No contracts name found：${contractsName} `);
    }
    let event: { [key: string]: string; }[] = [];
    await axios.get(url).then(function (response) {
        const jsonResponse = response.data;
        jsonResponse.logs.forEach((log: any) => {
            // decode the event data
            let dEvent = decodeEvent(contractsJson.abi, eventName, log.data, log.topics.slice(1));
            event.push(dEvent)
        });
    }).catch(function (err) {
        // throw new Error(err);
        console.log("err:", err)
    });
    // console.log("event:",event)
    return event;
};

/**
 * Decodes event contents using the ABI definition of the event
 * @param eventName the name of the event
 * @param log log data as a Hex string
 * @param topics an array of event topics
 */
const decodeEvent = (abi: any[], eventName: string, log: string, topics: string[]): { [key: string]: string } => {
    const eventAbi = abi.find(event => (event.name === eventName && event.type === "event"));
    let decodedLog: { [key: string]: string } = {};
    try {
        decodedLog = web3.eth.abi.decodeLog(eventAbi.inputs, log, topics);
    } catch (error) {
        console.log("Abi cannot be found on eth.")
    } finally {
        return decodedLog;
    }
};