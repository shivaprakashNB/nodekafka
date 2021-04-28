const demoJobDao = require("./enginehour.dao");
const isEmpty = require("is-empty");
const DATA_FREQUENCY = 30;

const updateEngineHoursAndReturnDeltaV1 = async (deviceData) => {
    try {
        let response = {};
        let engineStatus = deviceData.engineStatus;
        let eventTime = deviceData.devicePublishTime;
        let eventTimeSeconds = parseInt(new Date(deviceData.devicePublishTime).valueOf() / 1000);
        if(engineStatus === "ON"){
            response = await processOnEvent(deviceData, eventTime, eventTimeSeconds);
        }
        if(engineStatus === "OFF"){
            response = await processOffEvent(deviceData, eventTime, eventTimeSeconds);
        }
        return response;
    } catch(error) {
        console.log("Error while processing engine hours data. Supress this error and proceed",error);
    }
}

const processOnEvent = async (deviceData, eventTime, eventTimeSeconds) => {
    console.log("Event processing started for ON event");
    let response = {};
    // Calculate time of previous and next events
    let previousOnTime = eventTimeSeconds - DATA_FREQUENCY;
    let previousOffTime = eventTimeSeconds - DATA_FREQUENCY;
    let nextOnTime = eventTimeSeconds + DATA_FREQUENCY;
    let nextOffTime = eventTimeSeconds + DATA_FREQUENCY;
    let nextOffTimestamp = new Date(nextOffTime * 1000).toISOString();
    let nextOnTimestamp = new Date(nextOnTime * 1000).toISOString();

    console.log("deviceData : ", deviceData);
    console.log("eventTime : ", eventTime);
    console.log("eventTimeSeconds : ", eventTimeSeconds);
    console.log("previousOnTime : ", previousOnTime);
    console.log("previousOffTime : ", previousOffTime);
    console.log("nextOnTime : ", nextOnTime);
    console.log("nextOffTime : ", nextOffTime);
    console.log("nextOffTimestamp : ", nextOffTimestamp);
    console.log("nextOnTimestamp : ", nextOnTimestamp);

    // Find immediate previous ON event
    let criteria = { deviceID: deviceData.deviceID, lastOnTime: previousOnTime };
    let previousOnEvent = await demoJobDao.fetchEngineHoursByCriteria(criteria);

    // Find immediate previous OFF event
    criteria = { deviceID: deviceData.deviceID, lastOffTime: previousOffTime };
    let previousOffEvent = await demoJobDao.fetchEngineHoursByCriteria(criteria);
    console.log("checking previous on and off event",previousOnEvent,previousOffEvent);
    if(isEmpty(previousOnEvent) && isEmpty(previousOffEvent)) {
        console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent));
        // no previous event exist. Take action based on available next events.
        
        // Check if there is a next event
        criteria = { deviceID: deviceData.deviceID, '$or': [{lastOffTime: nextOffTime}, {offTimestamp: nextOffTimestamp}]};
        let nextOffEvent = await demoJobDao.fetchEngineHoursByCriteria(criteria);

        criteria = { deviceID: deviceData.deviceID, '$or': [{lastOnTime: nextOnTime}, {onTimestamp: nextOnTimestamp}] };
        let nextOnEvent = await demoJobDao.fetchEngineHoursByCriteria(criteria);

        if(!isEmpty(nextOnEvent)) {
            console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent), ", nextOnEvent : ", !isEmpty(nextOnEvent));
            // Since there exists a nextOnEvent so we will see if this window is closed. If yes then recalculate the engine hours
            // If not then just combine this window with nextOnEvent and update the lastOnTime
            if(isEmpty(nextOnEvent.offTimestamp)) {
                console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent), ", nextOnEvent : ", !isEmpty(nextOnEvent), ", nextOnEvent.offTimestamp : ", !isEmpty(nextOnEvent.offTimestamp));
                // Update nextOnEvent time to merge the current event data
                console.log('No previous event exists. Only nextOnEvent exists. Next on event do not have a offTimestamp meaning it is an open window.');
                console.log("So Updating the onTimestamp of nextOnEvent : ", nextOnEvent);
                let updateCriteria = {_id: nextOnEvent._id};
                let updateObj = {'$set': { onTimestamp: eventTime }};
                await demoJobDao.updateEngineHours(updateCriteria, updateObj);
            } else {
                console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent), ", nextOnEvent : ", !isEmpty(nextOnEvent), ", nextOnEvent.offTimestamp : ", !isEmpty(nextOnEvent.offTimestamp));
                // Take previous engineHours
                let existingEngineSeconds = nextOnEvent.seconds;
                // Calculate new engine hours from current event time to nextOffTimestamp
                let newTime = await calculateHoursAndSeconds((eventTimeSeconds * 1000), nextOnEvent.offTimestamp);
                // Update nextOnEvent window parameters and close the window
                let updateCriteria = {_id: nextOnEvent._id};
                let updateObj = {
                    "$set": {
                        onTimestamp: eventTime,
                        seconds: newTime.seconds,
                        engineHours: newTime.hours
                    }
                }
                console.log('No previous event exists. Only nextOnEvent exists with a offTimestamp.');
                console.log("So recalculating the window time of nextOnEvent : ", updateObj);

                await demoJobDao.updateEngineHours(updateCriteria, updateObj);

                // Update delta in response
                newTime.deltaSeconds = existingEngineSeconds;
                response = newTime;
            }
        } else if(!isEmpty(nextOffEvent)) {
            console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent), ", nextOffEvent : ", !isEmpty(nextOffEvent));
            // So there exists a nextOffEvent of which the onTime will sure be not available since that is the current event.
            // So we just have to calculate the new window 
            
            // Calculate new engine hours from current event time to nextOffTimestamp
            let newTime = await calculateHoursAndSeconds((eventTimeSeconds * 1000), nextOffEvent.offTimestamp);
            // Update nextOffEvent window parameters and close the window
            let updateCriteria = {_id: nextOffEvent._id};
            let updateObj = {
                "$set": {
                    onTimestamp: eventTime,
                    seconds: newTime.seconds,
                    engineHours: newTime.hours,
                    lastOnTime: eventTimeSeconds
                }                
            }
            console.log('No previous event exist. Next event is OFF event.');
            console.log('So calculating window time of next OFF event based on current ON time : ', updateObj);

            await demoJobDao.updateEngineHours(updateCriteria, updateObj);

            // Update delta in response
            // newTime.deltaSeconds = existingEngineSeconds;
            response = newTime;
        } else {
            console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent), ", nextOffEvent : ", !isEmpty(nextOffEvent), ", nextOnEvent : ", !isEmpty(nextOnEvent));
            // No next event is available after previous off. So this is a new ON. Open a new window.
            let engineHoursData = {
                deviceID: deviceData.deviceID,
                companyID: deviceData.companyID,
                onTimestamp: eventTime,
                lastOnTime: eventTimeSeconds
            }
            console.log("No previous or next event is available. So just open a new window : ", engineHoursData);
            await demoJobDao.createEngineHours(engineHoursData);
        }
    } else if(isEmpty(previousOnEvent) && !isEmpty(previousOffEvent)) {
        console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent));
        // So there is no previousOnEvent but a previousOffEvent exists. So the current event is ON after OFF.
        // So let us check if there exists a immediate next event
        criteria = { deviceID: deviceData.deviceID, '$or': [{lastOffTime: nextOffTime}, {offTimestamp: nextOffTimestamp}]};
        let nextOffEvent = await demoJobDao.fetchEngineHoursByCriteria(criteria);

        criteria = { deviceID: deviceData.deviceID, '$or': [{lastOnTime: nextOnTime}, {onTimestamp: nextOnTimestamp}] };
        let nextOnEvent = await demoJobDao.fetchEngineHoursByCriteria(criteria);

        if(!isEmpty(nextOnEvent)) {
            console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent), ", nextOnEvent : ", !isEmpty(nextOnEvent));
            // Since there exists a nextOnEvent so we will see if this window is closed. If yes then recalculate the engine hours
            // If not then just combine this window with nextOnEvent and update the lastOnTime
            if(isEmpty(nextOnEvent.offTimestamp)) {
                console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent), ", nextOnEvent : ", !isEmpty(nextOnEvent), ", nextOnEvent.offTimestamp : ", !isEmpty(nextOnEvent.offTimestamp));
                // Update nextOnEvent time to merge the current event data
                console.log('PreviousOffEvent and nextOnEvent exists. Next on event do not have a offTimestamp meaning it is an open window.');
                console.log("So Updating the onTimestamp of nextOnEvent : ", nextOnEvent);
                await demoJobDao.updateEngineHours({_id: nextOnEvent._id}, {"$set": {onTimestamp: eventTime}});
            } else {
                console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent), ", nextOnEvent : ", !isEmpty(nextOnEvent), ", nextOnEvent.offTimestamp : ", !isEmpty(nextOnEvent.offTimestamp));
                // Take previous engineHours
                let existingEngineSeconds = nextOnEvent.seconds;
                // Calculate new engine hours from current event time to nextOffTimestamp
                let newTime = await calculateHoursAndSeconds((eventTimeSeconds * 1000), nextOnEvent.offTimestamp);
                // Update nextOnEvent window parameters and close the window
                let updateCriteria = {_id: nextOnEvent._id};
                let updateObj = {
                    "$set": {
                        onTimestamp: eventTime,
                        seconds: newTime.seconds,
                        engineHours: newTime.hours,
                    }                
                }

                console.log('PreviousOffEvent and nextOnEvent exists. Next on event have a offTimestamp meaning it is a closed window.');
                console.log("So recalculating the window time of nextOnEvent : ", updateObj);
                await demoJobDao.updateEngineHours(updateCriteria, updateObj);

                // Update delta in repose
                newTime.deltaSeconds = existingEngineSeconds;
                response = newTime;
            }
        } else if(!isEmpty(nextOffEvent)) {
            console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent), ", nextOffEvent : ", !isEmpty(nextOffEvent));
            // So there exists a nextOffEvent of which the onTime will sure be not available since that is the current event.
            // So we just have to calculate the new window 
            
            // Calculate new engine hours from current event time to nextOffTimestamp
            let newTime = await calculateHoursAndSeconds((eventTimeSeconds * 1000), nextOffEvent.offTimestamp);
            
            // Update nextOffEvent window parameters and close the window
            let updateCriteria = {_id: nextOffEvent._id};
            let updateObj = {
                "$set": {
                    onTimestamp: eventTime,
                    seconds: newTime.seconds,
                    engineHours: newTime.hours,
                    lastOnTime: eventTimeSeconds
                }                
            }
            console.log('PreviousOffEvent and nextOffEvent exists. On time of next OFF event is current ON event.');
            console.log('So calculating window time of current ON event and next OFF event : ', updateObj);
            await demoJobDao.updateEngineHours(updateCriteria, updateObj);

            // Update delta in respnose
            // newTime.deltaSeconds = existingEngineSeconds;
            response = newTime;
        } else {
            console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent), ", nextOffEvent : ", !isEmpty(nextOffEvent), ", nextOnEvent : ", !isEmpty(nextOnEvent));
            // No next event is available after previous off. So this is a new ON. Open a new window.
            let engineHoursData = {
                deviceID: deviceData.deviceID,
                companyID: deviceData.companyID,
                onTimestamp: eventTime,
                lastOnTime: eventTimeSeconds
            }
            console.log("No next event is available after previous off. So this is a new ON. Open a new window : ", engineHoursData);
            await demoJobDao.createEngineHours(engineHoursData);
        }
    } else if(!isEmpty(previousOnEvent) && isEmpty(previousOffEvent)) {
        console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent));
        // See if there is a immediate next OFF event in which case we will have to recalculate the engine hours.
        // If not then just have to update the lastOnTime of open window
        criteria = { deviceID: deviceData.deviceID, '$or': [{lastOffTime: nextOffTime}, {offTimestamp: nextOffTimestamp}]};
        let nextOffEvent = await demoJobDao.fetchEngineHoursByCriteria(criteria);

        criteria = { deviceID: deviceData.deviceID, '$or': [{lastOnTime: nextOnTime}, {onTimestamp: nextOnTimestamp}] };
        let nextOnEvent = await demoJobDao.fetchEngineHoursByCriteria(criteria);

        // It is obvious that only either nextOnEvent or nextOffEvent will exist. so we will act individually on them.

        // If there is a nextOffEvent this means we will have to combine the previousOnEvent with nextOffEvent and close the window
        if(!isEmpty(nextOffEvent)) {
            console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent), ", nextOffEvent : ", !isEmpty(nextOffEvent));
            // So a previousOnEvent is present and a nextOffEvent is present. This means the current event is an ON event between
            // Previous on event and next off event. The onTime of the nextOffEvent will not be available since that is the current ON
            // event which has just arrived. So just merge previousOnEvent and nextOffEvent.
            
            // Calculate new engine hours from previousOnTimestamp to nextOffTimestamp
            let newTime = await calculateHoursAndSeconds(previousOnEvent.onTimestamp, nextOffEvent.offTimestamp);
            
            // Update offTimestamp and lastOffTime of previousOnEvent and close the window
            let updateCriteria = {_id: previousOnEvent._id};
            let updateObj = {
                "$set": {
                    offTimestamp : nextOffEvent.offTimestamp,
                    lastOffTime : nextOffEvent.lastOffTime,
                    lastOnTime : eventTimeSeconds,
                    seconds : newTime.seconds,
                    engineHours : newTime.hours
                }                
            }
            
            console.log("So previousOnEvent and nextOffEvent exists. This means current ON event is missing one in these two");
            console.log("So update off time of previousOnEvent with nextOffEvent and calculate the window : ", previousOnEvent);
            await demoJobDao.updateEngineHours(updateCriteria, updateObj);

            // Delete nextOffEvent
            console.log("PreviousOnEvent is updated. Delete the nextOffEvent since that is merged with previousOnEvent");
            await demoJobDao.deleteEngineHoursRecordById(nextOffEvent._id);
            
            response = newTime;
            return response;
        } else if(!isEmpty(nextOnEvent)) {
            console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent), ", nextOnEvent : ", !isEmpty(nextOnEvent));
            // If there is a nextOnEvent this means that there were two open windows and an ON event was missing. This ON event has come now.
            // So we will combine these two open windows together
            // Since there exists a nextOnEvent so we will see if this window is closed. If yes then recalculate the engine hours
            // If not then just combine this window with previousOnEvent and update the lastOnTime
            if(isEmpty(nextOnEvent.offTimestamp)) {
                console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent), ", nextOffEvent : ", !isEmpty(nextOnEvent), ", isEmpty(nextOnEvent.offTimestamp) : ", !isEmpty(nextOnEvent.offTimestamp));
                // Update previousOnEvent window
                console.log("PreviousOnEvent and nextOnEvent exist. nextOnEvent does not have offTimeStamp so this is a open window. Just merge these two open windows");
                console.log("Updated previous on event with lastOnTime of nextOnEvent : ", previousOnEvent);
                 await demoJobDao.updateEngineHours({_id: previousOnEvent._id}, {"$set": {lastOnTime: nextOnEvent.lastOnTime}});

                // Delete nextOnEvent
                console.log("Deleting nextOnEvent after merge : ", nextOnEvent);
                await demoJobDao.deleteEngineHoursRecordById(nextOnEvent._id);
            } else {
                console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent), ", nextOffEvent : ", !isEmpty(nextOnEvent), ", isEmpty(nextOnEvent.offTimestamp) : ", !isEmpty(nextOnEvent.offTimestamp));
                // Take previous engineHours
                let existingEngineSeconds = nextOnEvent.seconds;
                // Calculate new engine hours from previousOnTimestamp to nextOffTimestamp
                let newTime = await calculateHoursAndSeconds(previousOnEvent.onTimestamp, nextOnEvent.offTimestamp);
                // Update nextOnEvent window parameters and close the window
                let updateCriteria = {_id: nextOnEvent._id};
                let updateObj = {
                    "$set": {
                        onTimestamp : previousOnEvent.onTimestamp,
                        seconds : newTime.seconds,
                        engineHours : newTime.hours
                    }                
                }

                console.log("PreviousOnEvent and nextOnEvent exist. nextOnEvent have offTimeStamp. So we have to update onTimestamp of nextOnEvent and recalculate hours");
                console.log("Updated onTimestamp of nextOnEvent with ON time of current event : ", updateObj);
                await demoJobDao.updateEngineHours(updateCriteria, updateObj);
                
                // Delete previousOnEvent
                console.log("Deleting previousOnEvent after merge : ", previousOnEvent);
                await demoJobDao.deleteEngineHoursRecordById(previousOnEvent._id);
                
                // Update delta in response
                newTime.deltaSeconds = existingEngineSeconds;
                response = newTime;
            }
        } else {
            console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent), ", nextOnEvent : ", !isEmpty(nextOnEvent), ", nextOffEvent : ", !isEmpty(nextOffEvent));
            // So a previous ON event is available but no next event is available. So this is a ON after ON. Just update lastOnTime of previousOnEvent
            console.log('previousOnEvent exist but no next event. So this an ON after ON.');
            console.log("Updating the lastOnTime of previousOnEvent with current event time : ", previousOnEvent);
            await demoJobDao.updateEngineHours({_id: previousOnEvent._id}, {"$set": {lastOnTime: eventTimeSeconds}});
        }
    } else if(!isEmpty(previousOnEvent) && !isEmpty(previousOffEvent)) {
        console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent));
        console.log("ALERT !! Previous ON and OFF event exists. This is a serious bug since it cannot be a real situation");
    } else {
        console.log("This block will be never reached");
    }
    console.log("Printing response",response);
    return response;
}

const processOffEvent = async (deviceData, eventTime, eventTimeSeconds) => {
    console.log("Event processing started for OFF event");
    let response = {};
    // Calculate time of previous and next events
    let previousOnTime = eventTimeSeconds - DATA_FREQUENCY;
    let previousOffTime = eventTimeSeconds - DATA_FREQUENCY;
    let nextOnTime = eventTimeSeconds + DATA_FREQUENCY;
    let nextOffTime = eventTimeSeconds + DATA_FREQUENCY;
    let nextOffTimestamp = new Date(nextOffTime * 1000).toISOString();
    let nextOnTimestamp = new Date(nextOnTime * 1000).toISOString();
    
    console.log("deviceData : ", deviceData);
    console.log("eventTime : ", eventTime);
    console.log("eventTimeSeconds : ", eventTimeSeconds);
    console.log("previousOnTime : ", previousOnTime);
    console.log("previousOffTime : ", previousOffTime);
    console.log("nextOnTime : ", nextOnTime);
    console.log("nextOffTime : ", nextOffTime);
    console.log("nextOffTimestamp : ", nextOffTimestamp);
    console.log("nextOnTimestamp : ", nextOnTimestamp);
    
    // Find immediate previous ON event
    let criteria = { deviceID: deviceData.deviceID, lastOnTime: previousOnTime };
    let previousOnEvent = await demoJobDao.fetchEngineHoursByCriteria(criteria);

    // Find immediate previous OFF event
    criteria = { deviceID: deviceData.deviceID, lastOffTime: previousOffTime };
    let previousOffEvent = await demoJobDao.fetchEngineHoursByCriteria(criteria);

    if(isEmpty(previousOnEvent) && isEmpty(previousOffEvent)) {
        console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent));
        // no previous event exist. Take action based on available next events.
        
        // Check if there is a next event
        criteria = { deviceID: deviceData.deviceID, '$or': [{lastOffTime: nextOffTime}, {offTimestamp: nextOffTimestamp}]};
        let nextOffEvent = await demoJobDao.fetchEngineHoursByCriteria(criteria);

        criteria = { deviceID: deviceData.deviceID, '$or': [{lastOnTime: nextOnTime}, {onTimestamp: nextOnTimestamp}] };
        let nextOnEvent = await demoJobDao.fetchEngineHoursByCriteria(criteria);

        if(!isEmpty(nextOffEvent)) {
            console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent), ", nextOffEvent : ", !isEmpty(nextOffEvent));
            // No previous event but only next off event exists. So we will update the startTime of nextOffEvent
            console.log("No previous event exist only next off event which may or may not have the ontime. Check for onTimestamp availability and proceed");
            if(isEmpty(nextOffEvent.onTimestamp)) {
                console.log("No onTimestamp exist for the nextOffEvent. This means this is an open window")
                console.log("So updating the nextOffEvent offTimestamp with current event time : ", nextOffEvent);
                await demoJobDao.updateEngineHours({_id: nextOffEvent._id}, {"$set": {offTimestamp: eventTime}});
            } else {
                console.log("OnTimestamp exist for the nextOffEvent. So recalculate the window time based on onTimestamp and current event time");
                let existingEngineSeconds = nextOffEvent.seconds;
                let newTime = await calculateHoursAndSeconds(nextOffEvent.onTimestamp, eventTime);
                let updateCriteria = {_id: nextOffEvent._id};
                let updateObj = {
                    "$set": {
                        offTimestamp : eventTime,
                        seconds : newTime.seconds,
                        engineHours : newTime.hours
                    }                
                }
                await demoJobDao.updateEngineHours(updateCriteria, updateObj);
                
                // Update delta in response
                newTime.deltaSeconds = existingEngineSeconds;
                response = newTime;
            }
        } else if(!isEmpty(nextOnEvent)) {
            console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent), ", nextOnEvent : ", !isEmpty(nextOnEvent));
            // So no previous but nextOnEvent exist. State of that window does not matter to use. So let us just open a new window with only offTimeStamp.
            // This will help us to corelate the upcoming records with current OFF event.
            let engineHoursData = {
                deviceID: deviceData.deviceID,
                companyID: deviceData.companyID,
                offTimestamp: eventTime,
                lastOffTime: eventTimeSeconds
            }
            console.log("No previous event, only next on event. So creating new record with off time only : ", engineHoursData);
            await demoJobDao.createEngineHours(engineHoursData);
        } else {
            console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent), ", nextOnEvent : ", !isEmpty(nextOnEvent), ", nextOffEvent : ", !isEmpty(nextOffEvent));
            // Neither previous nor next event exists. Just create a new window with off time only.
            let engineHoursData = {
                deviceID: deviceData.deviceID,
                companyID: deviceData.companyID,
                offTimestamp: eventTime,
                lastOffTime: eventTimeSeconds
            }
            console.log("No previous or next event exists. So creating new record with off time only : ", engineHoursData);
            await demoJobDao.createEngineHours(engineHoursData);
        }
        
    } else if(isEmpty(previousOnEvent) && !isEmpty(previousOffEvent)) {
        console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent));
        // So there is no previousOnEvent but a previousOffEvent exists. So the current event is OFF after OFF.
        // So let us check if there exists a immediate next off event
        criteria = { deviceID: deviceData.deviceID, '$or': [{lastOffTime: nextOffTime}, {offTimestamp: nextOffTimestamp}]};
        let nextOffEvent = await demoJobDao.fetchEngineHoursByCriteria(criteria);

        if(!isEmpty(nextOffEvent)) {
            console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent), ", nextOffEvent : ", !isEmpty(nextOffEvent));
            // So there exists a nextOffEvent of which the onTime will sure be not available since that is the current OFF event.
            // So we will just update the lastOffTime of previousOffEvent and delete the nextOffEvent 
            
            // Update lastOffTime of previousOffEvent
            console.log("previousOffEvent and nextOffEvent exist. So this is a mising OFF event between two OFF events");
            console.log("Updating the lastOffTime of previousOffEvent : ", previousOffEvent);
            await demoJobDao.updateEngineHours({_id: previousOffEvent._id}, {"$set": {lastOffTime: nextOffEvent.lastOffTime}});

            // Delete nextOffEvent
            console.log('Deleting the nextOffEvent after updating the previousOffEvent');
            await demoJobDao.deleteEngineHoursRecordById(nextOffEvent._id);
        } else {
            console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent), ", nextOffEvent : ", !isEmpty(nextOffEvent));
            // Only previousOffEvent exist no nextOffEvent. So this is OFF after OFF.
            // Just update the lastOffTime of previousOffEvent
            console.log("previousOffEvent exist but no nextOffEvent. So this is OFF after OFF. No need to check nextOnEvent");
            console.log('Updating the lastOffTime of the previousOffEvent with current event time : ', previousOffEvent);
            await demoJobDao.updateEngineHours({_id: previousOffEvent._id}, {"$set": {lastOffTime: eventTimeSeconds}});
        }
    } else if(!isEmpty(previousOnEvent) && isEmpty(previousOffEvent)) {
        console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent));
        // See if there is a next off event which exists. In that case we will combine the previousOnEvent and nextOffEvent
        // We will calculate the engine hours also.
        // We need not to check the nextOnEvent since that will be an open window for which the current off event does not matter.
        criteria = { deviceID: deviceData.deviceID, '$or': [{lastOffTime: nextOffTime}, {offTimestamp: nextOffTimestamp}]};
        let nextOffEvent = await demoJobDao.fetchEngineHoursByCriteria(criteria);

        // If there is a nextOffEvent this means we will have to combine the previousOnEvent with nextOffEvent and close the window
        if(!isEmpty(nextOffEvent)) {
            console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent), " nextOffEvent : ", !isEmpty(nextOffEvent));
            // So a previousOnEvent is present and a nextOffEvent is present. This means the current event is an OFF event between
            // Previous on event and next off event. The onTime of the nextOffEvent will not be available since that is the previousOnEvent.
            // The current off event is immediately after previouOnEvent
            
            // Calculate new engine hours from previousOnTimestamp to current off event
            let newTime = await calculateHoursAndSeconds(previousOnEvent.onTimestamp, eventTime);
            
            // Update offTimestamp and lastOffTime of previousOnEvent and close the window
            let updateCriteria = {_id: previousOnEvent._id};
            let updateObj = {
                "$set": {
                    offTimestamp : eventTime,
                    lastOffTime: nextOffEvent.lastOffTime,
                    seconds : newTime.seconds,
                    engineHours : newTime.hours
                }                
            }
            console.log("PreviousOnEvent exists and nextOffEvent exist. So the current OFF is between previous ON and next OFF");
            console.log("So calculate the time between previous on and current OFF and update the lastOfftime with nextOffEvent last off time");
            console.log("Updating the previousOnEvent with new hours time : ", previousOnEvent);
            await demoJobDao.updateEngineHours(updateCriteria, updateObj);

            // Delete nextOffEvent
            console.log("Deleting the nextOffEvent after merging : ", nextOffEvent);
            await demoJobDao.deleteEngineHoursRecordById(nextOffEvent._id);
            
            response = newTime;
        } else {
            console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent), " nextOffEvent : ", !isEmpty(nextOffEvent));
            // So there is a previousOnEvent but no nextOffEvent. So this means this is OFF event after previous ON.
            // So just close the window and calculate engine hours
            
            // Calculate new engine hours from previousOnTimestamp to current off event
            let newTime = await calculateHoursAndSeconds(previousOnEvent.onTimestamp, eventTime);
            
            // Update offTimestamp and lastOffTime of previousOnEvent and close the window
            let updateCriteria = {_id: previousOnEvent._id};
            let updateObj = {
                "$set": {
                    offTimestamp : eventTime,
                    lastOffTime: eventTimeSeconds,
                    seconds : newTime.seconds,
                    engineHours : newTime.hours
                }                
            }
            console.log("previousOnEvent exist and current is OFF event. So no need to check nextOnEvent. Just close the previousOnEvent window with current event OFF time");
            console.log("Updating previousOnEvent with new hours : ", previousOnEvent);
            await demoJobDao.updateEngineHours(updateCriteria, updateObj);

            response = newTime;
        }
    } else if(!isEmpty(previousOnEvent) && !isEmpty(previousOffEvent)) {
        console.log("previousOnEvent : ", !isEmpty(previousOnEvent), ", previousOffEvent : ", !isEmpty(previousOffEvent));
        console.log("ALERT !! Previous ON and OFF event exists. This is a serious bug since it cannot be a real situation");
    } else {
        console.log("This block will be never reached");
    }
    return response;
}

const calculateHoursAndSeconds = (onTimestamp, offTimestamp) => {
    try {
        let startTime = parseInt(new Date(onTimestamp).valueOf() / 1000);
        let endTime = parseInt(new Date(offTimestamp).valueOf() / 1000);

        console.log("Time calculation : Start time : ", startTime, ", End time : ", endTime);

        let totalSeconds = (endTime - startTime);

        var hours = Math.floor(totalSeconds / (60 * 60));
        var divisor_for_minutes = totalSeconds % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);
        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);
        let totalHours =  hours + ":" + minutes + ":" + seconds; 

        return {
            hours: totalHours,
            seconds: totalSeconds
        };
    } catch(error) {
        console.log("Error while converting milliseconds to hours");
    }
}

module.exports = {
    updateEngineHoursAndReturnDeltaV1
}