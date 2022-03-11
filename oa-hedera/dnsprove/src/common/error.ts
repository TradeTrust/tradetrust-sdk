export enum DnsproveStatusCode {
  IDNS_QUERY_ERROR_GENERAL = 0,
}
export class CodedError extends Error {
  code: number;

  codeString: string;

  constructor(message: string, code: DnsproveStatusCode, codeString: string) {
    super(message);
    this.code = code;
    this.codeString = codeString;
  }
}
