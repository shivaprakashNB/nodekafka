const responseMessage = require('../responseMessage');
const Notification = require('../../Model/notification.model');

const saveNotification = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let notification = new Notification(data);
            let dbResponse = await notification.save();
            resolve(dbResponse);
        } catch (error) {
            console.log("Error while fetching data from database : ", error);
            reject(responseMessage.dataRetrieveError);
        }        
    })
}

module.exports = {
    saveNotification
}