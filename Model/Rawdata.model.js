const mongoose = require('mongoose');
var shortId = require('shortid');
const Schema = mongoose.Schema;

const schema = new Schema({
    
        Rawdata: {
            type: 'string',
            required: false,
            minLength :1 
        },
        createdAt:{
            type: Date,
            required: false,
            minLength :1 
        },

   // createdAt: { type: Date, default: Date.now }
});



const mydb = mongoose.connection.useDb('admin');
module.exports = mydb.model('admin', schema,'receiverdata');

