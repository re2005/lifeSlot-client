const abi = [{
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "bytes32"}],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "max_fee",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "destruct",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "last_result",
    "outputs": [{"name": "", "type": "bytes1"}],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "create_block",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_start", "type": "bytes1"}, {"name": "_end", "type": "bytes1"}],
    "name": "play",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": true,
    "type": "function"
}, {"inputs": [], "payable": false, "type": "constructor"}, {"payable": true, "type": "fallback"}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "_balance", "type": "uint256"}],
    "name": "Balance",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "name": "_sender", "type": "address"}, {
        "indexed": false,
        "name": "_start",
        "type": "bytes1"
    }, {"indexed": false, "name": "_end", "type": "bytes1"}, {
        "indexed": false,
        "name": "_result",
        "type": "bytes1"
    }, {"indexed": false, "name": "_winner", "type": "bool"}, {"indexed": false, "name": "_time", "type": "uint256"}],
    "name": "Play",
    "type": "event"
}, {"anonymous": false, "inputs": [], "name": "Destroy", "type": "event"}];

module.exports = abi;