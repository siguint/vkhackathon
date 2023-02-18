// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Owned } from "contracts/lib/solmate.git/src/auth/Owned.sol";

import { Clones } from "contracts/lib/openzeppelin-contracts.git/contracts/proxy/Clones.sol";
import { Pausable } from "contracts/lib/openzeppelin-contracts.git/contracts/security/Pausable.sol";

import { LibString } from "contracts/lib/solady.git/src/utils/LibString.sol";

import { NFTickets } from "./NFTickets.sol";

contract NFTicketsFactory is Owned, Pausable {
    struct Event {
        address event_;
    }

    Event[] private _events;
    mapping(address => uint256) private _eventIndexes;

    string public uri;
    address private _implementation;

    constructor(string memory _uri) Owned(msg.sender) {
        uri = _uri;
        _implementation = address(new NFTickets());
    }

    function createEvent() external whenNotPaused returns (address) {
        address event_ = Clones.clone(_implementation);
        NFTickets(event_).initialize(msg.sender);

        _eventIndexes[event_] = _events.length;
        _events.push(Event({ event_: event_ }));

        return event_;
    }

    function eventURI(
        address event_
    ) external view returns (string memory uri_) {
        uri_ = LibString.concat(uri, LibString.toHexString(event_));
    }

    function getEvents(
        uint256 cursor,
        uint256 amount
    ) external view returns (Event[] memory events, uint256 newCursor) {
        unchecked {
            uint256 numEvents = _events.length;
            if (numEvents == 0) {
                return (new Event[](0), 0);
            }
            if (cursor >= numEvents) {
                return (new Event[](0), numEvents);
            }

            uint256 length = numEvents - cursor;
            if (length > amount) {
                length = amount;
            }

            events = new Event[](length);
            for (uint256 i; i != length; ++i) {
                events[i] = _events[cursor];
                ++cursor;
            }

            newCursor = cursor;
        }
    }

    function setURI(string memory uri_) external onlyOwner {
        uri = uri_;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
