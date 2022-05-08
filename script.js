// Enable all tooltips.
$(document).ready(function() {
	$('[data-toggle="tooltip"]').tooltip();
});

// User Ethereum wallet public address.
let walletAddress = '';

// Smart contract.
const contract = {
	chainId: '0x4', // Kovan test network.
	address: '0xEcb6f4CE53a36943B801659c9719d84eca970eD6', // Contract public address
	// writeAddress: '0xfcc74f71', // Hex address of the write method of the contract.
	// storage: { text: null }, // Contract storage contains only bytes32 public text.

	buyBull: async function(amount, callback) {
		const methodAddress = '0x349a363f';
		const txHash = await ethereum.request({
		  	method: 'eth_sendTransaction',
		  	params: [{
			  	to: this.address,
			  	from: walletAddress,
			  	data: methodAddress,
			  	value: amount.toString(16),
			}],
		});
		if (callback) callback(txHash);
	},

	buyBear: async function(amount, callback) {
		const methodAddress = '0x0072060b';
		const txHash = await ethereum.request({
		  	method: 'eth_sendTransaction',
		  	params: [{
			  	to: this.address,
			  	from: walletAddress,
			  	data: methodAddress,
			  	value: amount.toString(16),
			}],
		});
		if (callback) callback(txHash);
	}
};

// Check if user has MetaMask installed.
function hasMetamask () {
	return window.ethereum ? ethereum.isMetaMask : false;
};

// Prompt user to enable MetaMask through the extension.
async function enableMetamask(callback) {
	const accounts = await ethereum.request({
		method: 'eth_requestAccounts'
	});
	walletAddress = accounts[0];
	
	// Update DOM.
	$('#connect-wallet').hide();
	$('#wallet-address').text(walletAddress.slice(-4));
	$('#wallet-display').show();
	if (callback) callback();
};

async function switchChain(chainId, callback) {
	await ethereum.request({
		method: 'wallet_switchEthereumChain',
		params: [{ chainId }],
	});
	if (callback) callback();
};

// Button to prompt user to enable metamask.
$('#connect-wallet').on('click', function() { 
	if (!hasMetamask()) {
	  	window.alert("No wallet detected. Please install MetaMask or another Ethereum wallet.");
	} else {
		enableMetamask(function() {
			if (ethereum.chainId != contract.chainId) {
				switchChain(contract.chainId, function() {
					$('#no-submit').hide();
					$('#submit').show();
					getContractData();
				})
			} else {
				$('#no-submit').hide();
				$('#submit').show();
			}
		});
	}
});
