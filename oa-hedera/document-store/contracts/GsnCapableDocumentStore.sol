// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.6.10;
pragma experimental ABIEncoderV2;

import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "@opengsn/gsn/contracts/interfaces/IKnowForwarderAddress.sol";

import "./OwnableDocumentStore.sol";
import "./GsnCapable.sol";

contract GsnCapableDocumentStore is OwnableDocumentStore, BaseRelayRecipient, IKnowForwarderAddress, GsnCapable {
  string public override versionRecipient = "2.0.0";

  constructor(string memory _name, address _forwarder) public OwnableDocumentStore(_name) {
    trustedForwarder = _forwarder;
  }

  function _msgSender() internal view override(Context, BaseRelayRecipient) returns (address payable) {
    return BaseRelayRecipient._msgSender();
  }

  function _msgData() internal view override(Context, BaseRelayRecipient) returns (bytes memory) {
    return BaseRelayRecipient._msgData();
  }

  function getTrustedForwarder() public view override returns (address) {
    return trustedForwarder;
  }

  function setTrustedForwarder(address _forwarder) public onlyOwner {
    trustedForwarder = _forwarder;
  }
}
