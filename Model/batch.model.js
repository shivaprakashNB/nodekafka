const mongoose = require('mongoose');
var shortId = require('shortid');
const Schema = mongoose.Schema;

const schema = new Schema({
    companyID:{
        type: 'string',
        required: false,
        minLength :1 
    },
    customerID:{
        type: 'string',
        required: false,
        minLength :1 
    },
	pinno:{
        type: 'string',
        required: false,
        minLength :1
    },
    deviceModel: {
        type: 'string',
        required: false,
        minLength :1 
    },
    deviceID: {
            type: 'string',
            required: false,
            minLength :1 
        },
        productID: {
            type: 'string',
            required: false,
            minLength :1 
        },
        devicePublishTime:{
            type: 'string',
            required: false,
            minLength :1 
        },
        rawData:{
            type: 'array',
            required: false,
            minLength :1 

        },
        batchNo: {
            type: 'string',
            required: false,
            minLength :1 
        },
		machineID: {
            type: 'string',
            required: false,
            minLength :1 
        },
		batchTime: {
            type: 'string',
            required: false,
            minLength :1 
        },
		batchDate: {
            type: 'string',
            required: false,
            minLength :1 
        },
        aggt10mm: {
            type: 'string',
            required: false,
            minLength :1 
        },
        aggt20mm: {
            type: 'string',
            required: false,
            minLength :1 
        },
        aggt30mm: {
            type: 'string',
            required: false,
            minLength :1 
        },
        cement01mm: {
            type: 'string',
            required: false,
            minLength :1 
        },
        cement02mm: {
            type: 'string',
            required: false,
            minLength :1 
        },
        sand01mm: {
            type: 'string',
            required: false,
            minLength :1 
        },
        sand02mm: {
            type: 'string',
            required: false,
            minLength :1 
        },
        water: {
            type: 'string',
            required: false,
            minLength :1 
        },
        additive1: {
            type: 'string',
            required: false,
            minLength :1 
        },
        additive2: {
            type: 'string',
            required: false,
            minLength :1 
        },
        totalWT: {
            type: 'string',
            required: false,
            minLength :1 
        },
        cum: {
            type: 'string',
            required: false,
            minLength :1 
        },
        StrTime: {
            type: 'string',
            required: false,
            minLength :1 
        },
        Endtime: {
            type: 'string',
            required: false,
            minLength :1 
        },
        createdAt:{
            type: 'date',
            required: false,
            minLength :1 
        },

   // createdAt: { type: Date, default: Date.now }
});



const mydb = mongoose.connection.useDb('ATIOTdata_DB');
module.exports = mydb.model('batchdata', schema,'batchdata');

