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
    deviceID: {
            type: 'string',
            required: false,
            minLength :1 
        },
        devicePublishTime: {
            type: 'string',
            required: false,
            minLength :1 
        },
		rawData: {
            type: 'string',
            required: false,
            minLength :1 
        },
		lat: {
            type: 'string',
            required: false,
            minLength :1 
        },
		lng: {
            type: 'string',
            required: false,
            minLength :1 
        },
        type: {
            type: 'string',
            required: false,
            minLength :1 
        },
	totalDistance: {
            type: 'string',
            required: false,
            minLength :1
        },
        timeZone: {
            type: 'string',
            required: false,
            minLength :1 
        },
        uploadInterval: {
            type: 'string',
            required: false,
            minLength :1 
        },
        travelSpeed: {
            type: 'string',
            required: false,
            minLength :1 
        },
        GSMSiganlStrength: {
            type: 'string',
            required: false,
            minLength :1 
        },
        GPSStatus: {
            type: 'string',
            required: false,
            minLength :1 
        },
        powerSource: {
            type: 'string',
            required: false,
            minLength :1 
        },
        batteryLevel: {
            type: 'string',
            required: false,
            minLength :1 
        },
        internalBL: {
            type: 'string',
            required: false,
            minLength :1 
        },
        runHours: {
            type: 'string',
            required: false,
            minLength :1 
        },
        fuelLevel: {
            type: 'string',
            required: false,
            minLength :1 
        },
        coolantTemp: {
            type: 'string',
            required: false,
            minLength :1 
        },
        opsStatus: {
            type: 'string',
            required: false,
            minLength :1 
        },
        hydralicOilFilterChoke: {
            type: 'string',
            required: false,
            minLength :1 
        },
        lowLubricationOilLevel: {
            type: 'string',
            required: false,
            minLength :1 
        },
        AI6: {
            type: 'string',
            required: false,
            minLength :1 
        },
        AI7: {
            type: 'string',
            required: false,
            minLength :1 
        },
        AI8: {
            type: 'string',
            required: false,
            minLength :1 
        },
        ignitionStatus: {
            type: 'string',
            required: false,
            minLength :1 
        },
        alertMobile:{
            type: 'string',
            required: true,
            minLength :1 
        },
        pinno: {
            type: 'string',
            required: false,
            minLength :1 
        },
        engineLastOn:{
            type: 'string',
            required: false,
            minLength :1 

        },
        alerts: {
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

        totalSeconds:{
            type: 'string',
            required: false,
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
        totalEngineHours:{
            type: 'string',
            required: false,
            minLength :1 

        },
        engineOn:{
            type: 'string',
            required: false,
            minLength :1 
        },
        extras: {
            type: 'array',
            required: false
        },
        createdAt:{
            type: 'string',
            required: false,
            minLength :1 
        },
        lastupdatedSecond:{
            type: 'string',
            required: false,
            minLength :1 
        },
        lastSumSecond: {
            type: 'string',
            required: false,
            minLength :1 
        },
        engineStatus:{
            type: 'string',
            required: false,
            minLength :1 
        },
	lastDataReceivedAt:{
            type: 'string',
            required: false,
            minLength :1 

        },
        updatedAt:{
            type: 'string',
            required: false,
            minLength :1 
        },

    //  createdAt: { type: Date, default: Date.now },
    // updateddAt: { type: Date, default: Date.now }
});



const mydb = mongoose.connection.useDb('ATIOT_DB');
module.exports = mydb.model('items', schema,'items');

