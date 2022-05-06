const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, Timestamp, data, previousHash = ''){
        /**index is optional and it tell us where the block sits on the chain
        timestamptells us when the block was created
        data includes any type of data associated witt the block --- in case of recurrency, 
        the details of a transaction are stored e.g money transferred, sender and receiver
        String that contains the hash of the previos block before this one ---ensures integrity
        */
       this.index = index;
       this.data = data;
       this.Timestamp = Timestamp;
       this.previousHash = previousHash;
       this.hash = this.calculateHash();//contains the hash of our block

    }

    calculateHash(){//will take properties of this block, run it through hash fn and return the hash
        //this identifies our block on the blockchain
        //sha256 is used
        return SHA256(this.index + this.previousHash +this.Timestamp + JSON.stringify(this.data));

    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];//initialize our chain as array containing our genesis block
    }

    createGenesisBlock(){
        //index, date, data = > string, previousBlock(in this case zero since its the first) 
        return new Block(0, "01/01/2022", "Genesis Block", "0");
    }
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }
    addBlock(newBlock){//receives a block
        newBlock.previousHash = this.getLatestBlock().hash;// gets previous block and sets it to last block on our chain
        newBlock.hash = newBlock.calculateHash();// after changing our block, we have to recalculate its hash
        this.chain.push(newBlock);//pushes it to the chain
        //in reality we cannot add new blocks so easily since there are so many checks in place
    }
}

//testing it -- my coin is called tcoin
let tcoin = new Blockchain();
tcoin.addBlock(new Block(1, "07/05/2022", { amount: 4 }));
tcoin.addBlock(new Block(2, "04/05/2022", { amount: 7 }));

console.log(JSON.stringify(tcoin, null, 4)); 