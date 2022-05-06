const sha256 = require('crypto-js/sha256');

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
       this.hash = '';//contais the hash of our block

    }

    calculateHash(){//will take properties of this block, run it through hash fn and return the hash
        //this identifies our block on the blockchain
        //sha256 is used

    }
}