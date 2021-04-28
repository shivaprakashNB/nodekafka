const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    deviceID:{
        type: 'string',
        required: false,
        minLength :1 
    },
    companyID:{
        type: 'string',
        required: false,
        minLength :1 
    },
    mobileNumber:{
        type: 'string',
        required: false,
        minLength :1 
    },
    machineno: {
        type: 'string',
        required: false,
        minLength :1
    },
    type:{
        type: 'string',
        required: false,
        minLength :1 
    },
    title:{
        type: 'string',
        required: false,
        minLength :1 
    },
    pinno: {
        type: 'string',
        required: false,
        minLength :1
    },
    message: {
        type: 'string',
        required: false,
        minLength :1
    },
    createdAt: {
        type: 'string',
        required: false,
        minLength :1
    },
    updatedAt: {
        type: 'date',
        required: false,
        minLength :1
    }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
    }
});

const mydb = mongoose.connection.useDb('ATIOT_DB');
module.exports = mydb.model('notifications', schema,'notifications');