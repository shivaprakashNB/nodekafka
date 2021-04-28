const isEmpty = require('is-empty');
var cron = require('node-cron');
var shortId = require('shortid');
const responseMessage = require('../_helpers/responseMessage');
const demoJobDao = require("./demo-job.dao");
const engineHoursService = require("./engine-hours.service");
const START = "START";
const STOP = "STOP";
const DATA_FREQUENCY = 30;

let jobStore = {};
let jobRunningConfig = {};

const startDemoJob = async (companyID) => {
    try {
        // Pull devices from database
        let devices = await demoJobDao.findByCriteria({});
        if(!isEmpty(devices)) {   
            // Start job
            var task = cron.schedule('*/30 * * * * *', () =>  {
                console.log('Task started : ', new Date());    
                processDeviceData(jobId);
            });
            await task.start();

            // Generate Id
            let jobId = shortId.generate();
            console.log("ID : ", jobId);
            
            // Store in memory
            const jobData = {jobId: jobId, job: task};
            let jobs = jobStore[companyID];
            if(isEmpty(jobs)) {
                jobs = [];
            }
            jobs.push(jobData);            
            jobStore[companyID] =  jobs;

            // Store job data in memory for local config
            jobRunningConfig[jobId] = devices;      
            
            // Return job id in response
            return {jobId: jobId};
        } else {
            console.log("No devices found for demo data");
            throw responseMessage.validationError("No device found for demo job");
        }
    } catch(error) {
        console.log("Error while starting the job : ", error);
        throw error;
    } 
};

const stopDemoJob = async (req, companyID) => {
    try {
        // Validate jobid
        let jobId = req.body.jobId;
        console.log(jobId);
        if(isEmpty(jobId)) {
            throw responseMessage.validationError("Job Id not provided");
        }

        // Stop job
        let jobs = jobStore[companyID];
        if(isEmpty(jobs)) {
            throw responseMessage.validationError("No jobs found for the company");
        } else {
            let jobFound = false;
            for(let job of jobs) {
                if(job.jobId === jobId) {
                    console.log("Job found with provided id");
                    jobFound = true;
                    job.job.stop();
                    break;
                }
            }
            if(jobFound === false) {
                console.log("Job not found with provided id");
                throw responseMessage.validationError("Job not found with provided id");
            } else {
                console.log("Job stopped successfully");
                return;
            }
        }
    } catch(error) {
        console.log(error);
        throw error;
    } 
};

const getAllJobs = (companyID) => {
    try {
        let jobs = jobStore[companyID];
        if(isEmpty(jobs)) {
            throw responseMessage.validationError("No jobs found for the company");
        } else {
            return jobs;
        }
    } catch(error) {
        console.log("Error while processing the device data : ", error);
        throw error;
    }
}

const processDeviceData = async (jobId) => {
    try {
        let devices = jobRunningConfig[jobId];
        for(let device of devices) {
            console.log("Device data : ", device);
            
            // Create default data to insert
            let deviceData = device.deviceData;
            deviceData.deviceID = device.deviceID;
            deviceData.devicePublishTime = getCurrentTime();
            delete deviceData._id;
            delete deviceData.deviceConfig;            

            let deviceConfig = device.deviceConfig;
            if(isEmpty(deviceConfig)) {
                console.log("No config found to generate the device data");
            } else {                
                for(let devConfig of deviceConfig) {
                    // Process each parameter
                    let parameterName = devConfig.parameterName;
                    let parameterConfig = devConfig.parameterConfig;
                    let inExtras = devConfig.extras;
                    console.log("parameterName : ", parameterName, ", parameterConfig : ", parameterConfig);
                    if(isEmpty(parameterConfig) || isEmpty(parameterName)) {
                        console.log("Either parameter name or parameter config are not defined");
                    } else {
                        let configSize = parameterConfig.length;
                        for(let paramConfig of parameterConfig) {
                            console.log("ParamConfig : ", paramConfig, " Index : ", parameterConfig.indexOf(paramConfig));
                            if(paramConfig.status === START || isEmpty(paramConfig.status)) {
                                // Update config status
                                if(isEmpty(paramConfig.status)) {
                                    console.log("Config status not set, setting it now to start");
                                    paramConfig.status = START;
                                }
                                // Variable to keep track of processing of current config
                                let processedCount = paramConfig.processedCount;
                                console.log("processedCount : ", processedCount);
                                if(isEmpty(processedCount) || processedCount === 0) {
                                    console.log("First time processing config");
                                    processedCount = paramConfig.count;
                                }
                                processedCount--;
                                paramConfig.processedCount = processedCount;

                                // Update parameter value in device data
                                if(inExtras) {
                                    if(isEmpty(deviceData.extras)) {
                                        deviceData.extras = [{}];
                                    }
                                    deviceData.extras[0][parameterName] = paramConfig.value;
                                } else {
                                    deviceData[parameterName] = paramConfig.value;
                                }                                

                                // Update status and count to continue cycle for next 
                                console.log("processedCount : ", processedCount);
                                if(paramConfig.processedCount === 0) {
                                    paramConfig.status = STOP;
                                    let currentIndex = parameterConfig.indexOf(paramConfig);
                                    console.log("currentIndex : ", currentIndex);
                                    if(currentIndex === (configSize - 1)) {
                                        console.log("Last element of the config, update the first one");                                        
                                        parameterConfig[0].status = START;
                                    } else {
                                        console.log("Not last element, update next config element");
                                        parameterConfig[currentIndex + 1].status = START;
                                    }
                                } else {
                                    console.log("Processed count not yet reached 0, continue to next cycle");
                                }
                                console.log("Now exit from here since one value is determined for the parameter : ", parameterName);
                                break;
                            } else {
                                console.log("Status is not started, let it go to next config");
                            }
                        }                        
                    }
                }
                // Insert data into database
                console.log("Final data to insert : ", deviceData);
                // await demoJobDao.updateDataLive(deviceData);

                // calculate data to update in items collection
                const criteria = {deviceID : deviceData.deviceID};
                let itemData = await demoJobDao.findItemByCriteria(criteria);
                if(isEmpty(itemData)) {
                    console.log("No data found in items collection for the device id : ",itemData);
                } else {
                    let calculatedItemsData = await calculateItemsData(deviceData, itemData);
                    const updateData = {'$set': calculatedItemsData};
                    // await demoJobDao.updateItemsByCriteria(criteria, updateData);
                }
            
            }
        }
        jobRunningConfig[jobId] = devices;
    } catch(error) {
        console.log("Error while processing the device data : ", error);
    }
}

const calculateItemsData = async (deviceData, itemData) => {
    try{
        let deviceItem  = {
            lastDataReceivedAt : deviceData.devicePublishTime,
            lat : deviceData.lat,
            lng : deviceData.lng
        }
    
        // Update engine last on
        if((deviceData.engineStatus === "ON") && (itemData.engineStatus === "OFF")) {
            deviceItem.lastEngineOn = deviceData.devicePublishTime;
        }

        //update enginestatus
        if(deviceData.engineStatus != itemData.engineStatus ) {
            deviceItem.engineStatus = deviceData.engineStatus;
        }

        // Update distance travelled
        if(!isEmpty(deviceData.extras[0].distance)) {
            deviceItem.distance = deviceData.extras[0].distance + itemData.distance;
        } else {
            console.log("Distance data not found");
        }

        // Process engine hours and receive the delta time and total seconds
        let hoursData = await engineHoursService.updateEngineHoursAndReturnDeltaV1(deviceData);
        if(isEmpty(hoursData)) {
            console.log("No ON-OFF event pair determined, no update in engine hours data");
        } else {
            let existingSeconds = itemData.totalSeconds;
            if(isEmpty(existingSeconds)) {
                console.log("No previous data exist for engine hours");
                deviceItem.totalSeconds = hoursData.totalSeconds;
                deviceData.totalEngineHours = await convertSecondsToHours(deviceItem.totalSeconds);
            } else {
                console.log("Previous data exists");
                if(!isEmpty(hoursData.deltaSeconds)) {
                    existingSeconds = parseFloat(existingSeconds);
                    existingSeconds = existingSeconds - hoursData.deltaSeconds;
                } 
                existingSeconds = existingSeconds + hoursData.totalSeconds;
                deviceItem.totalSeconds = existingSeconds;
                deviceData.totalEngineHours = await convertSecondsToHours(existingSeconds);
            }
        }
        console.log("updating device item", deviceItem); 
        return deviceItem;
    }
    catch(error){
        console.log("Error while processing the device Item data : ", error);
        throw error;
    }
}

const convertSecondsToHours = (totalSeconds) => {
    try {
        var hours = Math.floor(totalSeconds / (60 * 60));
        var divisor_for_minutes = totalSeconds % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);
        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);
        let totalHours =  hours + ":" + minutes + ":" + seconds; 

        return totalHours;
    } catch(error) {
        console.log("Error while converting milliseconds to hours");
    }
}

const getCurrentTime = () => {
    let currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 5);
    currentDate.setMinutes(currentDate.getMinutes() + 30);
    currentDate.setMilliseconds(0);
    return currentDate.toISOString();
}

module.exports = {
    startDemoJob, 
    stopDemoJob,
    getAllJobs
}