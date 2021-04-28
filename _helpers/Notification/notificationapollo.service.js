
const itemsDao = require("./items.dao");
const notificationDao = require("./notification-dao");
const constants = require("./constantsapollo");
const responseMessage = require('../responseMessage');
const smsService = require("../Notification/sms.service");
const moment = require('moment');



const sendNotification = (devices) => {
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
                    const LowBatteryVoltag = deviceRecord.extras.batteryLevel;
                    const travelSpeed = parseInt(deviceRecord.extras.travelSpeed);

                    //coolant 
                    console.log('customer',customer)
		            var HIGH = "high";
                    var MID = "mid"
                    //Coolant Temp
                    if(coolantTemp > constants.COOLANT_TEMP_WARN_LEVEL_1 
                        && coolantTemp < constants.COOLANT_TEMP_WARN_LEVEL_2) {
                        await checkAndSendNotificationcoolantTemp(customer.alertsCoolant,constants.COOLANT_TEMP_NOTIFICATION_TYPE_MEDIUM, coolantTemp, customer,MID);
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
                     //Low Battery Voltage (v)
                     if(LowBatteryVoltag > constants.LOW_BATTERY_VOLTAGE_WARN_LEVEL_1
                        && LowBatteryVoltag < constants.LOW_BATTERY_VOLTAGE_WARN_LEVEL_2) {
                        await checkAndSendNotificationLowBatteryVoltag(customer.alertsLowBatteryVoltag,constants.LOW_BATTERY_VOLTAGE_NOTIFICATION_TYPE_MEDIUM , LowBatteryVoltag, customer,HIGH);
                    } else {
                        console.log("No need to send notification !!LowBatteryVoltag")
                    }
                    //Travel Speed
                    if(devices.deviceModel==="25FX"){
                        if(travelSpeed > constants.TRAVEL_SPEED_25FX_WARN_LEVEL_1 
                            && travelSpeed < constants.TRAVEL_SPEED_25FX_WARN_LEVEL_2) {
                            await checkAndSendNotificationTravelSpeed25FX(customer.alertsTravelSpeed,constants.TRAVEL_SPEED_25FX_NOTIFICATION_TYPE_MEDIUM, travelSpeed, customer,MID);
                        } else if(travelSpeed >= constants.TRAVEL_SPEED_25FX_WARN_LEVEL_2) {
                            await checkAndSendNotificationTravelSpeed25FX(customer.alertsTravelSpeed,constants.TRAVEL_SPEED_25FX_NOTIFICATION_TYPE_HIGH, travelSpeed, customer,HIGH);  
                        } else {
                            console.log("No need to send notification !!coolantTemp");
                        }

                    }else if(devices.deviceModel==="45FX" || devices.deviceModel==="4TT" ){
                        if(travelSpeed > constants.TRAVEL_SPEED_45FX_WARN_LEVEL_1 
                            && travelSpeed < constants.TRAVEL_SPEED_45FX_WARN_LEVEL_2) {
                            await checkAndSendNotificationTravelSpeed45FX4TT(customer.alertsTravelSpeed,constants.TRAVEL_SPEED_45FX_NOTIFICATION_TYPE_MEDIUM, travelSpeed, customer,MID);
                        } else if(travelSpeed >= constants.TRAVEL_SPEED_45FX_WARN_LEVEL_2) {
                            await checkAndSendNotificationTravelSpeed45FX4TT(customer.alertsTravelSpeed,constants.TRAVEL_SPEED_45FX_NOTIFICATION_TYPE_HIGH, travelSpeed, customer,HIGH);  
                        } else {
                            console.log("No need to send notification !!coolantTemp");
                        }
                
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

const checkAndSendNotificationTravelSpeed25FX = (notificationTime, notificationType, TravelSpeed, customer,Status) => {
    console.log('b',notificationTime, notificationType, TravelSpeed)
	if(notificationTime=== undefined){
        notificationTime = undefined;
    }
	else if(Status==="high"){
        notificationTime = notificationTime.TravelSpeed25FXNotificationHighTime.time;
    }
    else if(Status==="mid"){
        notificationTime = notificationTime.TravelSpeed25FXNotificationMediumTime.time;
    }
    return new Promise(async (resolve, reject) => {
        try {
            console.log("Input values : ", notificationTime, " : ", notificationType, " : ", TravelSpeed, " : ", customer);
            let currentTime = new Date().valueOf();
            if(notificationTime === undefined || ((notificationTime + constants.TWELVE_HOUR_INTERVAL_SECONDS) <= currentTime)) {
                let message;
                let alertData = {};
                console.log(constants.TRAVEL_SPEED_25FX_NOTIFICATION_TYPE_HIGH)
                //TravelSpeed
                if(notificationType === constants.TRAVEL_SPEED_25FX_NOTIFICATION_TYPE_MEDIUM) {
                    message = constants.TRAVEL_SPEED_25FX_NOTIFICATION_TEMPLATE_MEDIUM.replace(constants.PLACEHOLDER_PINNO, customer.pinno).replace(constants.TRAVEL_SPEED_25FX_PLACEHOLDER_LEVEL, TravelSpeed);
                    alertData[notificationType] = {time: currentTime, TravelSpeed: TravelSpeed};
                } else if(notificationType === constants.TRAVEL_SPEED_25FX_NOTIFICATION_TYPE_HIGH) {
                    message = constants.TRAVEL_SPEED_25FX_NOTIFICATION_TEMPLATE_HIGH.replace(constants.PLACEHOLDER_PINNO, customer.pinno).replace(constants.TRAVEL_SPEED_25FX_PLACEHOLDER_LEVEL, TravelSpeed);
                    alertData[notificationType] = { time: currentTime, TravelSpeed: TravelSpeed};
            
                } else {
                    console.log("No matching alert type found");
                }
                console.log("Message : ", message);
                await smsService.sendSmsAPOLLO(customer, message);
                const notificationData = {
                    title:"Travel Speed",
                    type:customer.type,
                    companyID:customer.companyID,
                    pinno: customer.pinno,
                    deviceID: customer.deviceID,
                    mobileNumber: customer.alertMobile,
                    message: message,
                    createdAt: getLocalTime(),
                    updatedAt: getLocalTime()
                };
                console.log('notif',notificationData)
                await notificationDao.saveNotification(notificationData);
                console.log('alerdata',alertData)
                const updateCriteria = {deviceID: customer.deviceID};
                const dataToUpdate = {alertsTravelSpeed: alertData};
                itemsDao.updateItems(updateCriteria, dataToUpdate);
                await smsService.sendVoice(customer, message);
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

const checkAndSendNotificationTravelSpeed45FX4TT = (notificationTime, notificationType, TravelSpeed, customer,Status) => {
    console.log('b',notificationTime, notificationType, TravelSpeed)
	if(notificationTime=== undefined){
        notificationTime = undefined;
    }
	else if(Status==="high"){
        notificationTime = notificationTime.TravelSpeedNotificationHighTime.time;
    }
    else if(Status==="mid"){
        notificationTime = notificationTime.TravelSpeedNotificationMediumTime.time;
    }
    return new Promise(async (resolve, reject) => {
        try {
            console.log("Input values : ", notificationTime, " : ", notificationType, " : ", TravelSpeed, " : ", customer);
            let currentTime = new Date().valueOf();
            if(notificationTime === undefined || ((notificationTime + constants.TWELVE_HOUR_INTERVAL_SECONDS) <= currentTime)) {
                let message;
                let alertData = {};
                console.log(constants.TRAVEL_SPEED_45FX_NOTIFICATION_TYPE_HIGH)
                //TravelSpeed
                if(notificationType === constants.TRAVEL_SPEED_45FX_NOTIFICATION_TYPE_MEDIUM) {
                    message = constants.TRAVEL_SPEED_45FX_NOTIFICATION_TEMPLATE_MEDIUM.replace(constants.PLACEHOLDER_PINNO, customer.pinno).replace(constants.TRAVEL_SPEED_45FX_PLACEHOLDER_LEVEL, TravelSpeed);
                    alertData[notificationType] = {time: currentTime, TravelSpeed: TravelSpeed};
                } else if(notificationType === constants.TRAVEL_SPEED_45FX_NOTIFICATION_TYPE_HIGH) {
                    message = constants.TRAVEL_SPEED_45FX_NOTIFICATION_TEMPLATE_HIGH.replace(constants.PLACEHOLDER_PINNO, customer.pinno).replace(constants.TRAVEL_SPEED_45FX_PLACEHOLDER_LEVEL, TravelSpeed);
                    alertData[notificationType] = { time: currentTime, TravelSpeed: TravelSpeed};
            
                } else {
                    console.log("No matching alert type found");
                }
                console.log("Message : ", message);
                await smsService.sendSmsAPOLLO(customer, message);

                const notificationData = {
                    title:"Travel Speed",
                    type:customer.type,
                    companyID:customer.companyID,
                    pinno: customer.pinno,
                    deviceID: customer.deviceID,
                    mobileNumber: customer.alertMobile,
                    message: message,
                    createdAt: getLocalTime(),
                    updatedAt: getLocalTime()
                };
                console.log('notif',notificationData)
                await notificationDao.saveNotification(notificationData);
                console.log('alerdata',alertData)
                const updateCriteria = {_id: customer._id};
                const dataToUpdate = {alertsTravelSpeed: alertData};
                itemsDao.updateItems(updateCriteria, dataToUpdate);
                await smsService.sendVoice(customer, message);
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
                await smsService.sendSmsAPOLLO(customer, message);

                const notificationData = {
                    title:"COOLANT TEMPERATURE",
                    type:customer.type,
                    companyID:customer.companyID,
                    pinno: customer.pinno,
                    deviceID: customer.deviceID,
                    mobileNumber: customer.alertMobile,
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
                await smsService.sendVoice(customer, message);
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
                await smsService.sendSmsAPOLLO(customer, message);

                const notificationData = {
                    title:"OIL PRESSURE",
                    type:customer.type,
                    companyID:customer.companyID,
                    machineno: customer.machineno,
                    pinno: customer.pinno,
                    deviceID: customer.deviceID,
                    mobileNumber: customer.alertMobile,
                    message: message,
                    createdAt: getLocalTime(),
                    updatedAt: getLocalTime()
                };
                console.log('notif',notificationData)
                await notificationDao.saveNotification(notificationData);

                const updateCriteria = {_id: customer._id};
                const dataToUpdate = {alertsOILPRESSURE: alertData};
                itemsDao.updateItems(updateCriteria, dataToUpdate);
                await smsService.sendVoice(customer, message);
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
                await smsService.sendSmsAPOLLO(customer.alertMobile, message);

                const notificationData = {
                    title:"BATTERY VOLTAGE",
                    type:customer.type,
                    companyID:customer.companyID,
                    machineno: customer.machineno,
                    pinno: customer.pinno,
                    deviceID: customer.deviceID,
                    mobileNumber: customer.alertMobile,
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
                await smsService.sendVoice(customer, message);
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
