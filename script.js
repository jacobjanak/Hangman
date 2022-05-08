
// User Ethereum wallet public address.
let walletAddress = '';

// Smart contract.
const contract = {
	chainId: '0x4', // Rinkeby test network.
	address: '0xEcb6f4CE53a36943B801659c9719d84eca970eD6', // Contract public address

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
	},

	sellBull: async function(numerator, denominator, callback) {
		const methodAddress = '0x594da77f';

		// convert inputs to be 64 digit hexadecimal strings
		numerator = numerator.toString(16);
		denominator = denominator.toString(16);
		while (numerator.length < 64) numerator = '0' + numerator;
		while (denominator.length < 64) denominator = '0' + denominator;

		const txHash = await ethereum.request({
		  	method: 'eth_sendTransaction',
		  	params: [{
			  	to: this.address,
			  	from: walletAddress,
			  	data: methodAddress + numerator + denominator,
			}],
		});
		if (callback) callback(txHash);
	},

	sellBear: async function(numerator, denominator, callback) {
		const methodAddress = '0xdde1aa11';

		// convert inputs to be 64 digit hexadecimal strings
		numerator = numerator.toString(16);
		denominator = denominator.toString(16);
		while (numerator.length < 64) numerator = '0' + numerator;
		while (denominator.length < 64) denominator = '0' + denominator;

		const txHash = await ethereum.request({
		  	method: 'eth_sendTransaction',
		  	params: [{
			  	to: this.address,
			  	from: walletAddress,
			  	data: methodAddress + numerator + denominator,
			}],
		});
		if (callback) callback(txHash);
	},
};

// Check if user has MetaMask installed.
function hasMetamask () {
	return window.ethereum ? ethereum.isMetaMask : false;
};

// Prompt user to enable MetaMask through the extension.
async function enableMetamask(callback) {
	const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
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
	  	window.alert("No Ethereum wallet detected. Please install MetaMask.");
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

// Enable all tooltips.
$(document).ready(function() {
	$('[data-toggle="tooltip"]').tooltip();
});
