
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
		loadContractData();
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
		loadContractData();
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
		loadContractData();
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
		loadContractData();
	},

	getTotalEth: async function(callback) {
		const methodAddress = '0x88a01818';

		const txHash = await ethereum.request({
		  	method: 'eth_call',
		  	params: [{
			  	to: this.address,
			  	data: methodAddress,
			}, 'pending'],
		});
		if (callback) callback(txHash);
	},

	getBullEth: async function(callback) {
		const methodAddress = '0x1edc46ac';

		const txHash = await ethereum.request({
		  	method: 'eth_call',
		  	params: [{
			  	to: this.address,
			  	data: methodAddress,
			}, 'pending'],
		});
		if (callback) callback(txHash);
	},

	getBearEth: async function(callback) {
		const methodAddress = '0xdb4eaa5f';

		const txHash = await ethereum.request({
		  	method: 'eth_call',
		  	params: [{
			  	to: this.address,
			  	data: methodAddress,
			}, 'pending'],
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
	const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
	walletAddress = accounts[0];
	
	// Update DOM.
	$('.connect-wallet').hide();
	$('#wallet-address').text(walletAddress.slice(-4));
	$('#wallet-display').show();
	$('.wallet-connected').show()
	if (callback) callback();
};

async function switchChain(chainId, callback) {
	await ethereum.request({
		method: 'wallet_switchEthereumChain',
		params: [{ chainId }],
	});
	if (callback) callback();
};

// DOM stuff begins

// Button to prompt user to enable metamask.
$('.connect-wallet').on('click', function(e) {
	e.preventDefault();
	if (!hasMetamask()) {
	  	window.alert("No Ethereum wallet detected. Please install MetaMask.");
	} else {
		enableMetamask(function() {

			// add address as tooltip
			$('.address-tooltip').attr('title', walletAddress);
			$('.address-tooltip').attr('data-bs-original-title', walletAddress);
			$('.address-tooltip').tooltip();

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

$('.switch-button-checkbox').change(function() {
    if (this.checked) {
    	$('.switch-button').css({ color: 'black' });
    	$('#deposit-form').hide();
    	$('#withdrawal-form').show()
    } else {
    	$('.switch-button').css({ color: 'white' });
      $('#withdrawal-form').hide()
      $('#deposit-form').show();
    }
});

let isInWEI = false;
$('.dropdown-item').on('click', function() {
	const val = $(this).text();
	$('.dropdown-toggle').text(val);
	if (val === 'WEI') {
		isInWEI = true;
		$('#eth-amount').attr('step', '1'); // can't enter fractional wei
	}
	else {
		isInWEI = false;
		$('#eth-amount').attr('step', 'any');
	}
});

$('#deposit-form').on('submit', function(e) {
	e.preventDefault();
	if (walletAddress) {
		let amount = $('#eth-amount').val();
		if (amount > 0) {
			if (isInWEI === false) amount *= 1e18;
			amount = Math.floor(amount); // just in case
			if ($('#toggle').prop('checked')) {
				contract.buyBull(amount);
			} else {
				contract.buyBear(amount);
			}
		}
	} else {
		window.alert("Please connect your wallet.");
	}
});

$('#withdrawal-form').on('submit', function(e) {
	e.preventDefault();
	if (walletAddress) {
		let numerator = parseFloat($('#percentage').val());
		if (numerator > 0) {
			let denominator = 100;
			// convert floats to int while scaling denominator
			for (let i = 0; i < 16; i++) {
				if (Math.floor(numerator) !== numerator) {
					numerator *= 10;
					denominator *= 10;
				} else break;
			}
			numerator = Math.floor(numerator);
			if ($('#pool-select').val() === 'up') {
				contract.sellBull(numerator, denominator);
			}
			else if ($('#pool-select').val() === 'down') {
				contract.sellBear(numerator, denominator);
			}
		}
	} else {
		window.alert("Please connect your wallet.");
	}
});

// calls get requests of contract to get data
function loadContractData(animate = false) {
	contract.getTotalEth(total => {
		contract.getBullEth(bull => {
			total = parseInt(total);
			bull = parseInt(bull);
			const bullPercent = Math.round(bull/total*100);
			const bearPercent = 100-bullPercent;
			if (!animate) {
				$('#total-eth').text(total);
				$('#up-percent').text(bullPercent);
				$('#down-percent').text(bearPercent);

			// increasing number animation
			} else {
				let i = 0;
				let isTotalDone = false;
				let isPercentDone = false;
				const interval = setInterval(() => {
					if (isTotalDone && isPercentDone) clearInterval(interval);
					else if (!isTotalDone) {
						$('#total-eth').text(Math.round(total/10*Math.sqrt(i)));
						if (i === 100) {
							isTotalDone = true;
							i = 0;
						}
						else i++;
					} else {
						$('#up-percent').text(Math.round(bullPercent/10*Math.sqrt(i)));
						$('#down-percent').text(Math.round(bearPercent/10*Math.sqrt(i)));
						if (i === 100) isPercentDone = true;
						else i++;
					}
				}, 25)
			}
		});
	});
};

$(document).ready(function() {
	// Enable all tooltips.
	// $('[data-bs-toggle="tooltip"]').tooltip();

	// get total eth amount from contract
	loadContractData(true);
});
