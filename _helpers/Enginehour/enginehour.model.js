const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    deviceID:{
        type: 'string',
        required: true,
        minLength :1 
    },
    companyID: {
        type: 'string',
        required: false
    },
    onTimestamp: {
        type: 'string',
        required: false
    },
    offTimestamp: {
        type: 'string',
        required: false
    },
    lastOnTime: {
        type: 'number',
        required: false
    },
    lastOffTime: {
        type: 'number',
        required: false
    },
    pinno: {
        type: 'string',
        required: false
    },
    engineHours: {
        type: 'string',
        required: false
    },
    seconds: {
        type: 'string',
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
    }
});

const mydb = mongoose.connection.useDb('ATIOTdata_DB');
module.exports = mydb.model('enginehours', schema,'enginehours');