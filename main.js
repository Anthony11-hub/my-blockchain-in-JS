const {Blockchain, Transaction} = require('./blockchain')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('16e5a7ae1f91eeadc208e5158cd80a9db41e313bf400d6b1e75b5bb94ce46f99')
const myWalletAddress = myKey.getPublic('hex');



//testing it -- my coin is called tcoin
let tcoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'Public key goes here', 10);
tx1.signTransaction(myKey);
tcoin.addTransaction(tx1);

// tcoin.createTransaction(new Transaction('address1', 'address2', 100));
// tcoin.createTransaction(new Transaction('address2', 'address1', 50));
//in reality address 1 and 2 would be the public key of someones wallet

console.log('\n Starting the miner...');
tcoin.minePendingTransactions(myWalletAddress);

console.log('\nBalance of anthony is', tcoin.getBalanceOfAddress(myWalletAddress))

//mining another block so that the reward in the pending transactions area is rewarded to the miner
// console.log('\n Starting the miner again...');
// tcoin.minePendingTransactions('anthony-address');

// console.log('\nBalance of anthony is', tcoin.getBalanceOfAddress('anthony-address'))


// console.log('Mining block 1....');
// tcoin.addBlock(new Block(1, "07/05/2022", { amount: 4 }));

// console.log('Mining block 2....');
// tcoin.addBlock(new Block(2, "04/05/2022", { amount: 7 }));

// console.log('Is blockchain valid? ' + tcoin.isChainValid());

// console.log(JSON.stringify(tcoin, null, 4)); 