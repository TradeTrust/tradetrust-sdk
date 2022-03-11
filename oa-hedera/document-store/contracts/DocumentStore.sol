// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.6.10;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";

/*
 * Legacy version for reference and backward compatibility, similar to OwnableDocumentStore
 */
contract DocumentStore is Ownable {
  string public name;
  string public version = "2.3.0";

  /// A mapping of the document hash to the block number that was issued
  mapping(bytes => uint) public documentIssued;
  /// A mapping of the hash of the claim being revoked to the revocation block number
  mapping(bytes => uint) public documentRevoked;

  event DocumentIssued(bytes indexed document);
  event DocumentRevoked(bytes indexed document);

  constructor(string memory _name) public {
    name = _name;
  }

  function issue(bytes memory document) public onlyOwner onlyNotIssued(document) {
    documentIssued[document] = block.timestamp;
    emit DocumentIssued(document);
  }

  function bulkIssue(bytes[] memory documents) public {
    for (uint256 i = 0; i < documents.length; i++) {
      issue(documents[i]);
    }
  }

  // function getIssuedBlock(bytes32 document) public view onlyIssued(document) returns (uint256) {
  //   return documentIssued[document];
  // }

  function isIssued(bytes memory document) public view returns (bool) {
    return (documentIssued[document] != 0);
  }

  // function isIssuedBefore(bytes32 document, uint256 blockNumber) public view returns (bool) {
  //   return documentIssued[document] != 0 && documentIssued[document] <= blockNumber;
  // }

  function revoke(bytes memory document) public onlyOwner onlyNotRevoked(document) returns (bool) {
    documentRevoked[document] = block.timestamp;
    emit DocumentRevoked(document);
  }

  function bulkRevoke(bytes[] memory documents) public {
    for (uint256 i = 0; i < documents.length; i++) {
      revoke(documents[i]);
    }
  }

  function isRevoked(bytes memory document) public view returns (bool) {
    return documentRevoked[document] != 0;
  }

  // function isRevokedBefore(bytes32 document, uint256 blockNumber) public view returns (bool) {
  //   return documentRevoked[document] <= blockNumber && documentRevoked[document] != 0;
  // }

  // modifier onlyIssued(bytes32 document) {
  //   require(isIssued(document), "Error: Only issued document hashes can be revoked");
  //   _;
  // }

  modifier onlyNotIssued(bytes memory document) {
    require(!isIssued(document), "Error: Only hashes that have not been issued can be issued");
    _;
  }

  modifier onlyNotRevoked(bytes memory claim) {
    require(!isRevoked(claim), "Error: Hash has been revoked previously");
    _;
  }
}
