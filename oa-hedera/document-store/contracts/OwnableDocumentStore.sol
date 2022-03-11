// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.6.10;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./BaseDocumentStore.sol";

contract OwnableDocumentStore is BaseDocumentStore, Ownable {
  constructor(string memory _name) public {
    BaseDocumentStore.initialize(_name);
  }

  function issue(bytes memory document) public onlyOwner onlyNotIssued(document) {
    BaseDocumentStore._issue(document);
  }

  function bulkIssue(bytes[] memory documents) public onlyOwner {
    BaseDocumentStore._bulkIssue(documents);
  }

  function revoke(bytes memory document) public onlyOwner onlyNotRevoked(document) returns (bool) {
    return BaseDocumentStore._revoke(document);
  }

  function bulkRevoke(bytes[] memory documents) public onlyOwner {
    return BaseDocumentStore._bulkRevoke(documents);
  }
}
