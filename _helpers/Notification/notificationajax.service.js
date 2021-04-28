
const itemsDao = require("./items.dao");
const notificationDao = require("./notification-dao");
const constants = require("./constantsajax");
const responseMessage = require('../responseMessage');
const smsService = require("./sms.service");
const moment = require('moment');


const sendNotification = (devices) => {
    console.log('llllllllllll',devices)
    if(devices.engineStatus==="ON"){
    return new Promise(async (resolve, reject) => {
        try {
            
            // Create time interval in UTC
            const timeZoneOffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
            let currentSeconds = new Date().valueOf();
            let prevSeconds = currentSeconds - constants.TIME_INTERVAL_SECONDS;
            let currentDate = moment(currentSeconds - timeZoneOffset).toISOString();
            let prevDate = moment(prevSeconds- timeZoneOffset).toISOString();

            // Create search criteria            
            const criteria = await createSearchCriteria(currentDate, prevDate);
            
            // find eligible records
            if(devices) {
                 let deviceMap = {};
                let deviceIds = [];
                for(let record of [devices]) {
                    console.log(record)
                    deviceIds.push(record.deviceID);
                    deviceMap[record.deviceID] = record;

                }

                const itemsCriteria = {
                    "deviceID": devices.deviceID,
                    "type": /^dvmap/
                }

                const customerData = await itemsDao.findItemsbyCriteria(itemsCriteria);

                // combine the customer data with device data
                for(let customer of customerData) {
                    let deviceRecord = deviceMap[customer.deviceID];
                    console.log("lllkkkk",deviceRecord)
                    const coolantTemp = deviceRecord.extras.coolantTemp;
                    const oilpressure = deviceRecord.extras.oilpressure;
                    const fuellevel = deviceRecord.extras.fuelLevel;
                    const hydralicOilFilterChoke = deviceRecord.extras.hydralicOilFilterChoke;
                    const LowBatteryVoltag = deviceRecord.extras.batteryLevel;
                    console.log('fl',fuellevel)
                    //coolant 
                    console.log('customer',customer)
		    var HIGH = "high";
                    var MID = "mid"
                    
                    if(coolantTemp > constants.COOLANT_TEMP_WARN_LEVEL_1 
                        && coolantTemp < constants.COOLANT_TEMP_WARN_LEVEL_2) {
                        await checkAndSendNotificationcoolantTemp(customer.alertsCoolant,constants.COOLANT_TEMP_NOTIFICATION_TYPE_MEDIUM, coolantTemp, customeri,MID);
                    } else if(coolantTemp >= constants.COOLANT_TEMP_WARN_LEVEL_2) {
                        await checkAndSendNotificationcoolantTemp(customer.alertsCoolant,constants.COOLANT_TEMP_NOTIFICATION_TYPE_HIGH, coolantTemp, customer,HIGH);  
                    } else {
                        console.log("No need to send notification !!coolantTemp")
                    }
                    //oilpressure
                    
                    if(oilpressure <= constants.ENGINE_OIL_PRESSURE_WARN_LEVEL) {
                       await checkAndSendNotificationoilPressure(customer.alertsOILPRESSURE,constants.ENGINE_OIL_PRESSURE_NOTIFICATION_TYPE_HIGH, oilpressure, customer,HIGH);
                    } else {
                        console.log("No need to send notification !!oilpressureoilpressure")
                    }
                    //fuel level
                    if(fuellevel === constants.FUEL_LEVEL_WARN_LEVEL_1 ) {
			    console.log('hhhhhhh',customer.alertsFUELLEVEL);
                        await checkAndSendNotificationfuellevel(customer.alertsFUELLEVEL,constants.FUEL_LEVEL_NOTIFICATION_TYPE_MEDIUM, fuellevel, customer,MID);
                    } else if(fuellevel === constants.FUEL_LEVEL_WARN_LEVEL_2) {
			    console.log('hhhhhhh',customer.alertsFUELLEVEL);
                        await checkAndSendNotificationfuellevel(customer.alertsFUELLEVEL,constants.FUEL_LEVEL_NOTIFICATION_TYPE_HIGH, fuellevel, customer,HIGH);  
                    } else {
                        console.log("No need to send notification !!fuellevel")
                    }
                    //Hydraulic Filter choke
                    if(hydralicOilFilterChoke == constants.HYDRAULIC_FILTER_CHOKE_WARN_LEVEL) {
                        await checkAndSendNotificationHydraulicFilterchoke(customer.alertshydralicOilFilterChoke,constants.HYDRAULIC_FILTER_CHOKE_NOTIFICATION_TYPE_HIGH, hydralicOilFilterChoke, customer,HIGH);
                     } else {
                         console.log("No need to send notification !!hydralicOilFilterChoke")
                     }
                     //Low Battery Voltage (v)
                     if(LowBatteryVoltag > constants.LOW_BATTERY_VOLTAGE_WARN_LEVEL_1
                        && LowBatteryVoltag < constants.LOW_BATTERY_VOLTAGE_WARN_LEVEL_2) {
                        await checkAndSendNotificationLowBatteryVoltag(customer.alertsLowBatteryVoltag,constants.LOW_BATTERY_VOLTAGE_NOTIFICATION_TYPE_MEDIUM , LowBatteryVoltag, customer,HIGH);
                    } else {
                        console.log("No need to send notification !!LowBatteryVoltag")
                    }
                    

                }
            } else {
                console.log("No eligible device found");
            }
            console.log("Notification job completed : Success : ", getLocalTime());
            resolve(responseMessage.coolantNotificationSuccess);
        } catch(error) {
            console.log("Error while sending notification for the coolant tempeerature : ", error);
            console.log("Notification job completed : Failure : ", getLocalTime());
            reject(error);
        }
    });
}else{
    console.log("do nothing")
}
}


const createSearchCriteria = (currentDate, prevDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            let criteria = {
                devicePublishTime: {'$gt': prevDate, '$lt': currentDate},
                '$or': [
                    {'extras.0.coolantTemp': {'$gt': constants.COOLANT_TEMP_WARN_LEVEL_1, '$lt': constants.COOLANT_TEMP_WARN_LEVEL_2}},
                    {'extras.0.coolantTemp': {'$gt': constants.COOLANT_TEMP_WARN_LEVEL_2}}
                ]
            }
            resolve(criteria);
        } catch(error) {
            console.log("Error while creating search criteria for coolant notification : ", error);
            reject(responseMessage.coolantNotifyCreateCriteriaFailed);
        }
    });
}

const checkAndSendNotificationcoolantTemp = (notificationTime, notificationType, coolantTemp, customer,Status) => {
    console.log('b',notificationTime, notificationType, coolantTemp)
	if(notificationTime=== undefined){
        notificationTime = undefined;
    }
	else if(Status==="high"){
        notificationTime = notificationTime.coolantNotificationHighTime.time;
    }
    else if(Status==="mid"){
        notificationTime = notificationTime.coolantNotificationMediumTime.time;
    }
    return new Promise(async (resolve, reject) => {
        try {
            console.log("Input values : ", notificationTime, " : ", notificationType, " : ", coolantTemp, " : ", customer);
            let currentTime = new Date().valueOf();
            if(notificationTime === undefined || ((notificationTime + constants.TWELVE_HOUR_INTERVAL_SECONDS) <= currentTime)) {
                let message;
                let alertData = {};
                console.log(constants.COOLANT_TEMP_NOTIFICATION_TYPE_HIGH)
                //COOLANT_TEMP
                if(notificationType === constants.COOLANT_TEMP_NOTIFICATION_TYPE_MEDIUM) {
                    message = constants.COOLANT_TEMP_NOTIFICATION_TEMPLATE_MEDIUM.replace(constants.PLACEHOLDER_PINNO, customer.pinno).replace(constants.PLACEHOLDER_TEMPERATURE, coolantTemp);
                    alertData[notificationType] = {time: currentTime, coolantTemp: coolantTemp};
                } else if(notificationType === constants.COOLANT_TEMP_NOTIFICATION_TYPE_HIGH) {
                    message = constants.COOLANT_TEMP_NOTIFICATION_TEMPLATE_HIGH.replace(constants.PLACEHOLDER_PINNO, customer.pinno).replace(constants.PLACEHOLDER_TEMPERATURE, coolantTemp);
                     alertData[notificationType] = { time: currentTime, coolantTemp: coolantTemp};
            
                } else {
                    console.log("No matching alert type found");
                }
                console.log("Message : ", message);
                await smsService.sendSms(customer, message);

                const notificationData = {
                    title:"COOLANT TEMPERATURE",
                    type:customer.type,
                    companyID:customer.companyID,
                    pinno: customer.pinno,
                    deviceID: customer.deviceID,
                    mobileNumber: customer.cutomerMobile,
                    message: message,
                    createdAt: getLocalTime(),
                    updatedAt: getLocalTime()
                };
                console.log('notif',notificationData)
                await notificationDao.saveNotification(notificationData);
                console.log('alerdata',alertData)
                const updateCriteria = {_id: customer._id};
                const dataToUpdate = {alertsCoolant: alertData};
                itemsDao.updateItems(updateCriteria, dataToUpdate);
            } else {
                console.log("Notification sent in less than 12 hours ago");
            }    
            resolve();
        } catch(error) {
            console.log("Error while creating search criteria for coolant notification : ", error);
            reject(responseMessage.coolantNotifyCreateCriteriaFailed);
        }
    });
}

const checkAndSendNotificationfuellevel = (notificationTime, notificationType, fuellevel, customer,Status) => {
    console.log('a',notificationTime, notificationType, fuellevel)
	if(notificationTime=== undefined){
        notificationTime = undefined;
    }
     else if(Status==="high"){
        notificationTime = notificationTime.fuellevelNotificationHighTime.time;
    }
    else if(Status==="mid"){
        notificationTime = notificationTime.fuellevelNotificationMediumTime.time;
    }
    return new Promise(async (resolve, reject) => {
        try {
            console.log("Input values fuel level : ", notificationTime, " : ", notificationType, " : ", fuellevel, " : ", customer);
            let currentTime = new Date().valueOf();
            if(notificationTime === undefined || ((notificationTime + constants.FUEL_TWENTY_HOUR_INTERVAL_SECONDS) <= currentTime)) {
                let message;
                let alertData = {};
                console.log(constants.FUEL_LEVEL_NOTIFICATION_TYPE_HIGH)
                //COOLANT_TEMP
                if(notificationType === constants.FUEL_LEVEL_NOTIFICATION_TYPE_MEDIUM) {
                    message = constants.FUEL_LEVEL_NOTIFICATION_TEMPLATE_MEDIUM.replace(constants.PLACEHOLDER_PINNO, customer.pinno).replace(constants.PLACEHOLDER_LEVEL, fuellevel);
                    alertData[notificationType] = {time: currentTime, fuellevel: fuellevel};
                } else if(notificationType === constants.FUEL_LEVEL_NOTIFICATION_TYPE_HIGH) {
                    message = constants.FUEL_LEVEL_NOTIFICATION_TEMPLATE_HIGH.replace(constants.PLACEHOLDER_PINNO, customer.pinno).replace(constants.PLACEHOLDER_LEVEL, fuellevel);
                     alertData[notificationType] = { time: currentTime, fuellevel: fuellevel};
            
                } else {
                    console.log("No matching alert type found");
                }
                console.log("Message : ", message);
                await smsService.sendSms(customer, message);

                const notificationData = {
                    title:"FUEL LEVEL",
                    type:customer.type,
                    companyID:customer.companyID,
                    machineno: customer.machineno,
                    pinno: customer.pinno,
                    deviceID: customer.deviceID,
                    mobileNumber: customer.customerMobile,
                    message: message,
                    createdAt: getLocalTime(),
                    updatedAt: getLocalTime()
                };
                console.log('notif',notificationData)
                await notificationDao.saveNotification(notificationData);

                const updateCriteria = {_id: customer._id};
                const dataToUpdate = {alertsFUELLEVEL: alertData};
                itemsDao.updateItems(updateCriteria, dataToUpdate);
            } else {
                console.log("Notification sent in less than 12 hours ago");
            }    
            resolve();
        } catch(error) {
            console.log("Error while creating search criteria for coolant notification : ", error);
            reject(responseMessage.coolantNotifyCreateCriteriaFailed);
        }
    });
}



const checkAndSendNotificationoilPressure = (notificationTime, notificationType, oilpressure, customer,Status) => {
    console.log('c',notificationTime, notificationType, oilpressure)
	if(notificationTime=== undefined){
        notificationTime = undefined;
    }
	else if(Status==="high"){
        notificationTime = notificationTime.oilpressureNotificationHighTime.time;
    }
    return new Promise(async (resolve, reject) => {
        try {
            console.log("Input values oil pressure : ", notificationTime, " : ", notificationType, " : ", oilpressure, " : ", customer);
            let currentTime = new Date().valueOf();
            if(notificationTime === undefined || ((notificationTime + constants.TWELVE_HOUR_INTERVAL_SECONDS) <= currentTime)) {
                let message;
                let alertData = {};
                //OIL PRESSURE
                if(notificationType === constants.ENGINE_OIL_PRESSURE_NOTIFICATION_TYPE_HIGH) {
                    message = constants.ENGINE_OIL_PRESSURE_NOTIFICATION_TEMPLATE_HIGH.replace(constants.PLACEHOLDER_PINNO, customer.pinno).replace(constants.PLACEHOLDER_BAR, oilpressure);
                    alertData[notificationType] = { time: currentTime, oilpressure: oilpressure};
                    console.log('jhhgcghc',alertData)
                } else {
                    console.log("oil pressure No matching alert type found");
                }
                
                console.log("Message : ", message);
                await smsService.sendSms(customer, message);

                const notificationData = {
                    title:"OIL PRESSURE",
                    type:customer.type,
                    companyID:customer.companyID,
                    machineno: customer.machineno,
                    pinno: customer.pinno,
                    deviceID: customer.deviceID,
                    mobileNumber: customer.cutomerMobile,
                    message: message,
                    createdAt: getLocalTime(),
                    updatedAt: getLocalTime()
                };
                console.log('notif',notificationData)
                await notificationDao.saveNotification(notificationData);

                const updateCriteria = {_id: customer._id};
                const dataToUpdate = {alertsOILPRESSURE: alertData};
                itemsDao.updateItems(updateCriteria, dataToUpdate);
            } else {
                console.log("Notification sent in less than 12 hours ago");
            }    
            resolve();
        } catch(error) {
            console.log("Error while creating search criteria for coolant notification : ", error);
            reject(responseMessage.coolantNotifyCreateCriteriaFailed);
        }
    });
}


const checkAndSendNotificationHydraulicFilterchoke = (notificationTime, notificationType, hydralicOilFilterChoke, customer,Status) => {
	if(notificationTime=== undefined){
        notificationTime = undefined;
    }
	else if(Status==="high"){
        notificationTime = notificationTime.HydraulicFilterchokeNotificationHighTime.time;
    }
    return new Promise(async (resolve, reject) => {
        try {
            console.log("Input values : ", notificationTime, " : ", notificationType, " : ", hydralicOilFilterChoke, " : ", customer);
            let currentTime = new Date().valueOf();
            if(notificationTime === undefined || ((notificationTime + constants.TWELVE_HOUR_INTERVAL_SECONDS) <= currentTime)) {
                let message;
                let alertData = {};
                console.log(constants.HYDRAULIC_FILTER_CHOKE_NOTIFICATION_TYPE_HIGH)
                //COOLANT_TEMP
                if(notificationType === constants.HYDRAULIC_FILTER_CHOKE_NOTIFICATION_TYPE_HIGH) {
                    message = constants.HYDRAULIC_FILTER_CHOKE_NOTIFICATION_TEMPLATE_HIGH.replace(constants.PLACEHOLDER_PINNO, customer.pinno).replace(constants.PLACEHOLDER_CHOKE, hydralicOilFilterChoke);
                     alertData[notificationType] = { time: currentTime, hydralicOilFilterChoke: hydralicOilFilterChoke};
            
                } else {
                    console.log("No matching alert type found");
                }
                console.log("Message : ", message);
               // await smsService.sendSms(customer, message);

                const notificationData = {
                    title:"HYDRAULIC FILTER",
                    type:customer.type,
                    companyID:customer.companyID,
                    machineno: customer.machineno,
                    pinno: customer.pinno,
                    deviceID: customer.deviceID,
                    mobileNumber: customer.cutomerMobile,
                    message: message,
                    createdAt: getLocalTime(),
                    updatedAt: getLocalTime()
                };
                console.log('notif',notificationData)
                await notificationDao.saveNotification(notificationData);
                console.log('alerdata',alertData)
                const updateCriteria = {_id: customer._id};
                const dataToUpdate = {alertshydralicOilFilterChoke: alertData};
                itemsDao.updateItems(updateCriteria, dataToUpdate);
            } else {
                console.log("Notification sent in less than 12 hours ago");
            }    
            resolve();
        } catch(error) {
            console.log("Error while creating search criteria for coolant notification : ", error);
            reject(responseMessage.coolantNotifyCreateCriteriaFailed);
        }
    });
}

const checkAndSendNotificationLowBatteryVoltag = (notificationTime, notificationType, LowBatteryVoltag, customer,Status) => {
    console.log('b',notificationTime, notificationType, LowBatteryVoltag)
	if(notificationTime=== undefined){
        notificationTime = undefined;
    }
	else if(Status==="high"){
        notificationTime = notificationTime.lowbatteryvoltagelNotificationMediumTime.time;
    }
    return new Promise(async (resolve, reject) => {
        try {
            console.log("Input values : ", notificationTime, " : ", notificationType, " : ", LowBatteryVoltag, " : ", customer);
            let currentTime = new Date().valueOf();
            if(notificationTime === undefined || ((notificationTime + constants.TWELVE_HOUR_INTERVAL_SECONDS) <= currentTime)) {
                let message;
                let alertData = {};
                //COOLANT_TEMP
                if(notificationType === constants.LOW_BATTERY_VOLTAGE_NOTIFICATION_TYPE_MEDIUM) {
                    message = constants.LOW_BATTERY_VOLTAGE_NOTIFICATION_TEMPLATE_MEDIUM .replace(constants.PLACEHOLDER_PINNO, customer.pinno).replace(constants.PLACEHOLDER_VOLTAGE, LowBatteryVoltag);
                     alertData[notificationType] = { time: currentTime, LowBatteryVoltag: LowBatteryVoltag};
            
                } else {
                    console.log("No matching alert type found");
                }
                console.log("Message : ", message);
               // await smsService.sendSms(customer.cutomerMobile, message);

                const notificationData = {
                    title:"BATTERY VOLTAGE",
                    type:customer.type,
                    companyID:customer.companyID,
                    machineno: customer.machineno,
                    pinno: customer.pinno,
                    deviceID: customer.deviceID,
                    mobileNumber: customer.cutomerMobile,
                    message: message,
                    createdAt: getLocalTime(),
                    updatedAt: getLocalTime()
                };
                console.log('notif',notificationData)
                await notificationDao.saveNotification(notificationData);
                console.log('alerdata',alertData)
                const updateCriteria = {_id: customer._id};
                const dataToUpdate = {alertsLowBatteryVoltag: alertData};
                itemsDao.updateItems(updateCriteria, dataToUpdate);
            } else {
                console.log("Notification sent in less than 12 hours ago");
            }    
            resolve();
        } catch(error) {
            console.log("Error while creating search criteria for coolant notification : ", error);
            reject(responseMessage.coolantNotifyCreateCriteriaFailed);
        }
    });
}

const getLocalTime = () => {
    var timeZoneOffset = (new Date()).getTimezoneOffset() * 60000;
    var localDateTime = (new Date(Date.now() - timeZoneOffset)).toISOString();
    return localDateTime;
}

module.exports = {
    sendNotification
}
