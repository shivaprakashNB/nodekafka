const responseMessage = require('../responseMessage');
const items = require('../../Model/items.model');
const isEmpty = require('is-empty');

const findItemsbyCriteria = (criteria) => {
    return new Promise(async (resolve, reject) => {
        try {
            let itemsData = await items.find(criteria, {"alertMobile": 1, "machineno": 1, "pinno": 1,"companyID":1,"title":1,"type":1, "deviceID": 1, "alertsCoolant": 1,"alertsOILPRESSURE":1,"alertsFUELLEVEL":1,"alertshydralicOilFilterChoke":1,"alertsLowBatteryVoltag":1,"alertsTravelSpeed":1}).exec();
            console.log("Items data : ", itemsData);
            resolve(itemsData);
        } catch (error) {
            console.log("Error while fetching data from database : ", error);
            reject(responseMessage.dataRetrieveError);
        }        
    })
}
const updateItems = (criteria, data) => {
    console.log(criteria,data)
    return new Promise(async (resolve, reject) => {
        try {
            let updatedData = await items.updateOne(criteria, {"$set": data}).exec();
            console.log("Updated data : ", updatedData);
            resolve(updatedData);
        } catch (error) {
            console.log("Error while updating data to database : ", error);
            reject(responseMessage.dataUpdateError);
        }        
    })
}
module.exports = {
    findItemsbyCriteria,
    updateItems
}