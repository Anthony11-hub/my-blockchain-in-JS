const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){//returns the sha-256 hash of that transaction
        //this hash is the one we are going to sign with the private key
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey){
        //signingKey will be the object that we pull out from ec.genKeyPait()
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('You cannot sign transactions for other wallets');
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.sgnature = sig.toDER('hex');
    }

    isValid(){
        //check if fromAddress is null, if it is then its valid
        if(this.fromAddress === null) return true;
        //check if there is a signature
        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature in this transaction')
        }
        //if there is a signature, we are going to extract the public key
        //and verify that this transaction has indeed been signed by that key
        const publicKey = ec.keyfromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

class Block{
    constructor(Timestamp, transaction, previousHash = ''){
        /**index is optional and it tell us where the block sits on the chain
        timestamptells us when the block was created
        data includes any type of data associated witt the block --- in case of recurrency, 
        the details of a transaction are stored e.g money transferred, sender and receiver
        String that contains the hash of the previos block before this one ---ensures integrity
        */
       this.transaction = transaction;
       this.Timestamp = Timestamp;
       this.previousHash = previousHash;
       this.hash = this.calculateHash();//contains the hash of our block
       this.nonce = 0;//random no that doesn't have anything to do with your block
        
    }

    calculateHash(){//will take properties of this block, run it through hash fn and return the hash
        //this identifies our block on the blockchain
        //sha256 is used
        return SHA256(this.index + this.previousHash +this.Timestamp + JSON.stringify(this.data) + this.nonce).toString();

    }
    mineBlock(difficulty){
        //while loop runs until our hash block starts with enough zeros --kinda like bitcoin :)
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;//incremented as long as our hash doesn't start with enough zeros
            this.hash = this.calculateHash();
        }
        console.log("Block mined! " + this.hash);
    }

    hasValidTransaction(){
        //method verifies all the transactions in the current block
        for(const tx of this.transaction){
            if(!tx.isValid()){
                return false;
            }
        }

        return true;
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];//initialize our chain as array containing our genesis block
        this.difficulty = 2; //now we have 4 zeros, with this we can control time taken to mine a block
        this.pendingTransactions = [];
        this.miningReward = 100;//miners get 100 coins for succesful mining
    }

    createGenesisBlock(){
        //index, date, data = > string, previousBlock(in this case zero since its the first) 
        return new Block("01/01/2022", "Genesis Block", "0");
    }
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress){
        //when method is called it will pass along its wallet address
        //in real world coins adding all pending transactions to a block is not possible
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);
        
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block succesfully mined!')
        this.chain.push(block);

        this.pendingTransactions = [];
    }

    addTransaction(transaction){//receive transaction and add to pending transaction area
        
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transaction must include from and to address');
        }

        if(!transaction.isValid()){
            throw new Error('Cannot add invalid transaction to the chain');
        }

        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transaction){
                //logic = if from address then reduce wallet amt, if to address increase wallet amt
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    // addBlock(newBlock){//receives a block
    //     newBlock.previousHash = this.getLatestBlock().hash;// gets previous block and sets it to last block on our chain
    //     newBlock.mineBlock(this.difficulty);
    //     // newBlock.hash = newBlock.calculateHash();// after changing our block, we have to recalculate its hash
    //     this.chain.push(newBlock);//pushes it to the chain
    //     //in reality we cannot add new blocks so easily since there are so many checks in place
    // }

    isChainValid(){//Verify integrity
        //goes over all the blocks in our chain and verifies that the hashes are correct and each block links to the previous block
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[1];
            const previousBlock = this.chain[i - 1];

            if(!currentBlock.hasValidTransaction()){
                return false;
            }

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
             }
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;

    }
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;
