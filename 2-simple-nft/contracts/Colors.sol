pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

import "hardhat/console.sol";


contract Colors is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter public tokenIds;

  string[] private colors = ["red", "blue", "green", "yellow", "purple", "violet", "black", "white"];
  
  string start_svg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='";
  string middle_svg = "' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";
  string end_svg = "</text></svg>";

  event MintedNFT(uint256 tokenId);

  constructor() ERC721("Colors", "COL") {
    console.log("init ERC721 contract creation...");
  }

  function mint() public {
    uint256 tokenId = tokenIds.current();

    _safeMint(msg.sender, tokenId);

    string memory tokenURI = getTokenURI(tokenId);
    _setTokenURI(tokenId, tokenURI);

    emit MintedNFT(tokenId);
    tokenIds.increment();
  }

  function getTokenURI(uint256 tokenId) private view returns (string memory) {
    string memory randomColor = getRandomColor(tokenId);
    string memory svgImage = getSVGImage(randomColor); 

    string memory dataJSON = string(
      abi.encodePacked(
      '{ "name": "', randomColor , '",',
      '"image" :"data:image/svg+xml;base64,', Base64.encode(bytes(svgImage)), '"}'
    ));

    return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(dataJSON))));
  }

  function getSVGImage(string memory randomColor) private view returns (string memory) {
    return string(abi.encodePacked(start_svg, randomColor, middle_svg, randomColor, end_svg));
  }

  function getRandomColor(uint256 tokenId) private view returns (string memory) {
    uint256 randomNumber = uint(keccak256(abi.encodePacked(string(abi.encodePacked("NUMBER", tokenId)))));
    uint256 colorIdx = randomNumber % colors.length;
    
    return colors[colorIdx];
  }

}
