// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.6.10;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";

contract BaseDocumentStore is Initializable {
  string public name;
  string public version;

  /// A mapping of the document hash to the block number that was issued
  mapping(bytes => uint) public documentIssued;
  /// A mapping of the hash of the claim being revoked to the revocation block number
  mapping(bytes => uint) public documentRevoked;

  event DocumentIssued(bytes indexed document);
  event DocumentRevoked(bytes indexed document);

  function initialize(string memory _name) public initializer {
    version = "2.3.0";
    name = _name;
  }

  function _issue(bytes memory document) internal onlyNotIssued(document) {
    documentIssued[document] = block.timestamp;
    emit DocumentIssued(document);
  }

  function _bulkIssue(bytes[] memory documents) internal {
    for (uint256 i = 0; i < documents.length; i++) {
      _issue(documents[i]);
    }
  }

  // function getIssuedBlock(bytes memory document) public view onlyIssued(document) returns (uint256) {
  //   return documentIssued[document];
  // }

  function isIssued(bytes memory document) public view returns (bool) {
    return (documentIssued[document] != 0);
  }

  // function isIssuedBefore(bytes32 document, uint256 blockNumber) public view returns (bool) {
  //   return documentIssued[document] != 0 && documentIssued[document] <= blockNumber;
  // }

  function _revoke(bytes memory document) internal onlyNotRevoked(document) returns (bool) {
    documentRevoked[document] = block.timestamp;
    emit DocumentRevoked(document);
  }

  function _bulkRevoke(bytes[] memory documents) internal {
    for (uint256 i = 0; i < documents.length; i++) {
      _revoke(documents[i]);
    }
  }

  function isRevoked(bytes memory document) public view returns (bool) {
    return documentRevoked[document] != 0;
  }

  // function isRevokedBefore(bytes32 document, uint256 blockNumber) public view returns (bool) {
  //   return documentRevoked[document] <= blockNumber && documentRevoked[document] != 0;
  // }

  // modifier onlyIssued(bytes memory document) {
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
