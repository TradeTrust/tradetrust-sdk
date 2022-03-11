// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.6.10;
pragma experimental ABIEncoderV2;

import "./UpgradableDocumentStore.sol";

contract DocumentStoreWithRevokeReasons is UpgradableDocumentStore {
  /// A mapping of the document hash to the block number that was issued
  mapping(bytes => uint256) public revokeReason;

  event DocumentRevokedWithReason(bytes indexed document, uint256 reason);

  function revoke(bytes memory document, uint256 reason) public onlyOwner onlyNotRevoked(document) returns (bool) {
    revoke(document);
    revokeReason[document] = reason;
    emit DocumentRevokedWithReason(document, reason);
  }

  function bulkRevoke(bytes[] memory documents, uint256 reason) public {
    for (uint256 i = 0; i < documents.length; i++) {
      revoke(documents[i]);
      revokeReason[documents[i]] = reason;
      emit DocumentRevokedWithReason(documents[i], reason);
    }
  }
}
