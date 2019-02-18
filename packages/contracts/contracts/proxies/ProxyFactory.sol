pragma solidity 0.5.7;

import "./Proxy.sol";


/// @title Proxy Factory - Allows to create new proxy contact and execute a message call
/// to the new proxy within one transaction.
/// @author Stefan George - <stefan@gnosis.pm>
contract ProxyFactory {

  event ProxyCreation(Proxy proxy);

  /// @dev Allows to create new proxy contact and execute a message call to the new proxy within one transaction.
  /// @param masterCopy Address of master copy.
  /// @param data Payload for message call sent to new proxy contract.
  function createProxy(address masterCopy, bytes memory data)
    public
    returns (Proxy proxy)
  {
    bytes memory proxy_bytecode = type(Proxy).creationCode;

    bytes memory initcode = abi.encode(proxy_bytecode, masterCopy);

    assembly {
      proxy := create2(0, add(initcode, 0x20), mload(initcode), 0)
    }

    if (data.length > 0) {
      assembly {
        if eq(call(gas, proxy, 0, add(data, 0x20), mload(data), 0, 0), 0) { revert(0, 0) }
      }
    }

    emit ProxyCreation(proxy);
  }
}
