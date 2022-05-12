const {Blockchain, Transaction} = require('./blockchain')

//testing it -- my coin is called tcoin
let tcoin = new Blockchain();

tcoin.createTransaction(new Transaction('address1', 'address2', 100));
tcoin.createTransaction(new Transaction('address2', 'address1', 50));
//in reality address 1 and 2 would be the public key of someones wallet

console.log('\n Starting the miner...');
tcoin.minePendingTransactions('anthony-address');

console.log('\nBalance of anthony is', tcoin.getBalanceOfAddress('anthony-address'))

//mining another block so that the reward in the pending transactions area is rewarded to the miner
console.log('\n Starting the miner again...');
tcoin.minePendingTransactions('anthony-address');

console.log('\nBalance of anthony is', tcoin.getBalanceOfAddress('anthony-address'))


// console.log('Mining block 1....');
// tcoin.addBlock(new Block(1, "07/05/2022", { amount: 4 }));

// console.log('Mining block 2....');
// tcoin.addBlock(new Block(2, "04/05/2022", { amount: 7 }));

// console.log('Is blockchain valid? ' + tcoin.isChainValid());

// console.log(JSON.stringify(tcoin, null, 4)); 