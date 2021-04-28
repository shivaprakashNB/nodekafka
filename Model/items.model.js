const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    _id: {
        type: 'object',
        required: true,
        minLength :1 
    },
    companyID:{
        type: 'string',
        required: true,
        minLength :1 
    },
    deviceID:{
        type: 'string',
        required: true,
        minLength :1 
    },
    alertMobile:{
        type: 'string',
        required: true,
        minLength :1 
    },
    type:{
        type: 'string',
        required: true,
        minLength :1 
    },
    title:{
        type: 'string',
        required: true,
        minLength :1 
    },
    machineno: {
        type: 'string',
        required: true,
        minLength :1
    },
    pinno: {
        type: 'string',
        required: true,
        minLength :1
    },
    alertsCoolant: {
        type: 'object',
        required: true,
        minLength :1
    },
    alertsOILPRESSURE: {
        type: 'object',
        required: true,
        minLength :1
    },
    alertsFUELLEVEL: {
        type: 'object',
        required: true,
        minLength :1
    },
    alertshydralicOilFilterChoke:{
        type: 'object',
        required: true,
        minLength :1
    },
    alertsLowBatteryVoltag:{
        type: 'object',
        required: true,
        minLength :1
    },
    alertsTravelSpeed:{
        type: 'object',
        required: true,
        minLength :1
    },
    pois: {
        type: 'object',
        required: true,
        minLength :1
    },
    summary: {
        type: 'object',
        required: true,
        minLength :1
    },
    engineLastOn: {
        type: 'string',
        required: true,
        minLength :1
    },
    services:{
        type: 'object',
        required: true,
        minLength :1
    },
    upcomingServices:{
        type: 'object',
        required: true,
        minLength :1
    },
    engineNumber: {
        type: 'string',
        required: true,
        minLength :1 
    },
    deliveryDate: {
        type: 'string',
        required: false,
        minLength :1 
    },
    deviceModel: {
        type: 'string',
        required: false,
        minLength :1 
    },
    lastupdatedSecond: {
        type: 'string',
        required: false,
        minLength :1 
    },
    lastSumSecond: {
        type: 'string',
        required: false,
        minLength :1 
    },
    totalSeconds: {
        type: 'number',
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
module.exports = mydb.model('items', schema,'items');