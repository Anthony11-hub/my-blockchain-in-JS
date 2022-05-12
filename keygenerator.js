//file to generate a private and public key to make a wallet
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');//secp256k1 is used in bitcoin wallets

const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

console.log();
console.log('Private Key:', privateKey);

console.log();
console.log('Public Key:', publicKey);