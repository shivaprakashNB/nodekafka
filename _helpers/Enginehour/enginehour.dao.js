const responseMessage = require("../responseMessage");
const DataLive = require("../../Model/datalive.model");
const Items = require("../../Model/items.model");
const EngineHours = require('./enginehour.model');

const findByCriteria = async (criteria) => {
    try {
        let data = await DemoJob.find(criteria).exec();
        console.log("Device data : ", data);
        return data;
    } catch(error) {
        console.log("Error while pulling data from database : ", error);
        throw responseMessage.databaseError;
    }
}


const findItemByCriteria = async (criteria) => {
    try {
        let data = await Items.findOne(criteria).exec();
        console.log("Device data : ", data);
        return data;
    } catch(error) {
        console.log("Error while pulling data from database : ", error);
        throw responseMessage.databaseError;
    }
}

const updateDataLive = async (data) => {
    try {
        let dataLive = new DataLive(data);
        await dataLive.save();
        console.log("Device data : ", dataLive);
    } catch(error) {
        console.log("Error while pulling data from database : ", error);
        throw responseMessage.databaseError;
    }
}

const updateItemsByCriteria = async (criteria, updateObj) => {
    try {
        const updateData = await Items.updateOne(criteria, updateObj);
        console.log("Updated Item data : ", updateData);
        return updateData;
    } catch(error) {
        console.log("Error while pulling data from database : ", error);
        throw responseMessage.databaseError;
    }
}

const createEngineHours = async (engineHour) => {
    try {
        const engineHours = new EngineHours(engineHour);
        await engineHours.save();
    } catch(error) {
        console.log("Error while pulling data from database : ", error);
        throw responseMessage.databaseError;
    }
}

const updateEngineHours = async (criteria, updateObj) => {
    try {
        const updateData = await EngineHours.updateOne(criteria, updateObj);
        console.log("Updated engine hours data : ", updateData);
        return updateData;
    } catch(error) {
        console.log("Error while pulling data from database : ", error);
        throw responseMessage.databaseError;
    }
}

const fetchEngineHoursByCriteria = async (criteria) => {
    try {
        const engineHours = await EngineHours.findOne(criteria).exec();
        console.log("Engine hours data : ", engineHours);
        return engineHours;
    } catch(error) {
        console.log("Error while pulling data from database : ", error);
        throw responseMessage.databaseError;
    }
}

const updateEngineHoursRecord = async (data) => {
    try {
        await data.save();
    } catch(error) {
        console.log("Error while pulling data from database : ", error);
        throw responseMessage.databaseError;
    }
}

const deleteEngineHoursRecordById = async (id) => {
    try {
        let criteria = {_id: id};
        await EngineHours.deleteOne(criteria);
    } catch(error) {
        console.log("Error while pulling data from database : ", error);
        throw responseMessage.databaseError;
    }
}

module.exports = {
    findByCriteria,
    updateDataLive,
    updateItemsByCriteria,
    findItemByCriteria,
    createEngineHours,
    updateEngineHours,
    fetchEngineHoursByCriteria,
    updateEngineHoursRecord,
    deleteEngineHoursRecordById
}