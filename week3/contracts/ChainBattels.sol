// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract ChainBattels is ERC721URIStorage {

    using Strings for uint256;
    using Strings for uint8;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct stats {
        uint8 level;
        uint8 life;
        uint8 speed;
        uint8 strength;
    }

    mapping(uint256 => stats) public tokenIdToStats;
    event Train(uint256 indexed tokenId);
    

    constructor() ERC721("ChainBattles", "CB") {

    }

    function generateCharacter(uint256 tokenId) public view returns(string memory){

    bytes memory svg = abi.encodePacked(
        '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
        '<style>.base { fill: white; font-family: serif; font-size: 14px; }</style>',
        '<rect width="100%" height="100%" fill="black" />',
        '<text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">',"Warrior",'</text>',
        '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">', "Levels: ",getLevels(tokenId),'</text>',
        '<text x="50%" y="60%" class="base" dominant-baseline="middle" text-anchor="middle">', "Energy: ",getLife(tokenId),'</text>',
        '<text x="50%" y="70%" class="base" dominant-baseline="middle" text-anchor="middle">', "Speed: ",getSpeed(tokenId),'</text>',
        '<text x="50%" y="80%" class="base" dominant-baseline="middle" text-anchor="middle">', "Strength: ",getStrength(tokenId),'</text>',

        '</svg>'
    );
    return string(
        abi.encodePacked(
            "data:image/svg+xml;base64,",
            Base64.encode(svg)
        )    
    );
}

    function random(uint number) public view returns(uint){
        return uint(keccak256(abi.encodePacked(block.timestamp,block.difficulty,  
        msg.sender))) % number;
    }


    function getLevels(uint256 _tokenId) public view returns (string memory) {
        uint8 level = tokenIdToStats[_tokenId].level;
        return level.toString();
    }
    function getLife(uint256 _tokenId) public view returns (string memory) {
       uint8 life = tokenIdToStats[_tokenId].life;
       return life.toString();
    }
    function getSpeed(uint256 _tokenId) public view returns (string memory) {
       uint8 speed = tokenIdToStats[_tokenId].speed;
       return speed.toString();
    }
    function getStrength(uint256 _tokenId) public view returns (string memory) {
       uint8 strength = tokenIdToStats[_tokenId].strength;
       return strength.toString();
    }

    function getTokenURI(uint256 _tokenId) public view returns (string memory) {
        bytes memory dataURI = abi.encodePacked(
            '{',
                '"name": "Chain Battles #', _tokenId.toString(), '",',
                '"description": "Battles on chain",',
                '"image": "', generateCharacter(_tokenId), '"',
            '}'
        );
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }

    function mint() public {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        tokenIdToStats[newItemId] = stats(0, uint8(random(10)), uint8(random(15)), uint8(random(20)));
        _setTokenURI(newItemId, getTokenURI(newItemId));
    }

    function train(uint256 _tokenId) public {
        require(_exists(_tokenId), "Token Id does not exists");
        require(msg.sender == ownerOf(_tokenId), "You are not owner of this NFT");
        stats storage Stats = tokenIdToStats[_tokenId];
        Stats.level++;
        Stats.life += uint8(random(20));
        Stats.speed += uint8(random(25));
        Stats.strength += uint8(random(30));
        _setTokenURI(_tokenId, getTokenURI(_tokenId));
        emit Train(_tokenId);
    }

}