// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Owned } from "contracts/lib/solmate.git/src/auth/Owned.sol";

import { Clones } from "contracts/lib/openzeppelin-contracts.git/contracts/proxy/Clones.sol";
import { Pausable } from "contracts/lib/openzeppelin-contracts.git/contracts/security/Pausable.sol";

import { LibString } from "contracts/lib/solady.git/src/utils/LibString.sol";

import { NFTickets } from "./NFTickets.sol";

contract NFTicketsFactory is Owned, Pausable {
    error NoEvent();

    event CreateEvent(address event_, address owner, uint256 startDate);

    struct Event {
        address event_;
        address owner;
        uint256 startDate;
    }

    address[] private _events;
    mapping(address => uint256) private _eventIndexes;

    string public uri;
    address private _implementation;

    constructor(string memory _uri) Owned(msg.sender) {
        uri = _uri;
        _implementation = address(new NFTickets());
    }

    function createEvent(
        uint256 startDate
    ) external whenNotPaused returns (address) {
        address event_ = Clones.clone(_implementation);
        NFTickets(event_).initialize(msg.sender, startDate);

        _eventIndexes[event_] = _events.length;
        _events.push(event_);

        emit CreateEvent(event_, msg.sender, startDate);

        return event_;
    }

    function eventURI(
        address event_
    ) external view returns (string memory uri_) {
        if (event_ != _events[_eventIndexes[event_]] || event_ == address(0)) {
            revert NoEvent();
        }
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
            address curEvent;
            for (uint256 i; i != length; ++i) {
                curEvent = _events[cursor];

                events[i] = Event({
                    event_: curEvent,
                    owner: NFTickets(curEvent).owner(),
                    startDate: NFTickets(curEvent).startDate()
                });
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
