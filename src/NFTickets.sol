// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Owned } from "lib/solmate.git/src/auth/Owned.sol";
import { MerkleProofLib } from "lib/solmate.git/src/utils/MerkleProofLib.sol";
import { ERC1155 } from "lib/solmate.git/src/tokens/ERC1155.sol";

import { Initializable } from "lib/openzeppelin-contracts.git/contracts/proxy/utils/Initializable.sol";
import { Pausable } from "lib/openzeppelin-contracts.git/contracts/security/Pausable.sol";

import { NFTicketsFactory } from "./NFTicketsFactory.sol";

contract NFTickets is Initializable, ERC1155, Pausable  {
    error ImproperProof();
    error AlreadyClaimed();

    event OwnershipTransferred(address indexed user, address indexed newOwner);

    mapping(uint256 => string) private _tokenURIs;
    mapping(address => bool) public ticketClaimed;
    
    uint256[] private _tokenIds;
    mapping(uint256 => uint256) private _tokenIdIndexes;

    address public owner;
    address public factory;
    bytes32 public merkleRoot;

    modifier onlyOwner() {
        require(msg.sender == owner, "UNAUTHORIZED");

        _;
    }

    function initialize(address _owner) external initializer {
        owner = _owner;
        emit OwnershipTransferred(address(0), _owner);
        
        factory = msg.sender;
    }

    function claim(
        bytes32[] calldata merkleProof,
        uint256 tokenId
    ) external whenNotPaused {
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, tokenId));
        bool verified = MerkleProofLib.verify(merkleProof, merkleRoot, leaf);

        if (!verified) {
            revert ImproperProof();
        }

        if (ticketClaimed[msg.sender]) {
            revert AlreadyClaimed();
        }
        
        ticketClaimed[msg.sender] = true;

        _tokenIdIndexes[tokenId] = _tokenIds.length;
        _tokenIds.push(tokenId);

        _mint(msg.sender, tokenId, 1, "");
    }

    function getMintedTokenIds(uint256 cursor, uint256 amount) external view returns (uint256[] memory tokenIds, uint256 newCursor) {
        unchecked {
            uint256 numTokenIds = _tokenIds.length;
            if (numTokenIds == 0) {
                return (new uint256[](0), 0);
            }
            if (cursor >= numTokenIds) {
                return (new uint256[](0), numTokenIds);
            }

            uint256 length = numTokenIds - cursor;
            if (length > amount) {
                length = amount;
            }

            tokenIds = new uint256[](length);
            for (uint256 i; i != length; ++i) {
                tokenIds[i] = _tokenIds[cursor];
                ++cursor;
            }

            newCursor = cursor;
        }
    }

    function uri(uint256 id) public view override returns (string memory tokenURI) {
        tokenURI = string(abi.encodePacked(NFTicketsFactory(factory).uri(), factory, id));
    }

    function setMerkleRoot(bytes32 merkleRoot_) external onlyOwner {
        merkleRoot = merkleRoot_;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
