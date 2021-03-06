// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.6.10;
pragma experimental ABIEncoderV2;

import "./UpgradableDocumentStore.sol";

// Naming this factory contract as DocumentStoreCreator so that typechain can name the factory of this
// contract as DocumentStoreCreatorFactory and it does not collide with the automatically generated
// DocumentStoreFactory automatically generated by typechain
contract DocumentStoreCreator {
  event DocumentStoreDeployed(address indexed instance, address indexed creator);

  function deploy(string memory name) public returns (address) {
    // solhint-disable-next-line mark-callable-contracts
    UpgradableDocumentStore instance = new UpgradableDocumentStore();
    instance.initialize(name, msg.sender);
    emit DocumentStoreDeployed(address(instance), msg.sender);
    return address(instance);
  }
}
