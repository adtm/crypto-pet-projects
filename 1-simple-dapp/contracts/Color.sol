// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Color {
	string color;

	function get() public view returns (string memory) {
			return color;
	}

	function set(string memory _color) public {
			color = _color;
	}
}
