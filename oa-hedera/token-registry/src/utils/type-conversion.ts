import { ContractId } from "@hashgraph/sdk";

export const stringToUint8Array = (str: string): Uint8Array => {
  const arr = [];
  for (let i = 0, j = str.length; i < j; ++i) {
    arr.push(str.charCodeAt(i));
  }
  const tmpUint8Array = new Uint8Array(arr);
  return tmpUint8Array;
};

export const stringListToUint8ArrayList = (str: string[]): Uint8Array[] => {
  const tmpUint8Array: Uint8Array[] = [];
  for (let i = 0, j = str.length; i < j; ++i) {
    tmpUint8Array.push(stringToUint8Array(str[i]))
  }
  return tmpUint8Array;
};

const pad = (num: string, n: any): string => {
  let len = num.length;
  while (len < n) {
    num = "0" + num;
    len++;
  }
  return num;
};

export const addressToContractId = (address: string): ContractId => {
  address = address.startsWith("0X") ? address.replace("0x", "") : address;
  return ContractId.fromString("0.0." + parseInt(address, 16).toString(10));
};

export const contractIdToAddress = (contractId: ContractId): string => {
  let contractId_ = contractId.toString();
  contractId_ = contractId_.startsWith("0.0.") ? contractId_.replace("0.0.", "") : contractId_;
  return "0x" + pad(parseInt(contractId_, 10).toString(16), 40);
};
