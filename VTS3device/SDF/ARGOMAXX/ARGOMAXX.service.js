///Listener service for SDF-VTS3 devices
var moment = require("moment")
var db = require('../../../_helpers/db');
const Helper = require('../../../_helpers/helper');


module.exports.split = split;
async function split(data){
    var convertjson = JSON.parse(data);
    console.log('lll',convertjson)
    var dataArr = convertjson.Raw.split(',');
    var dataarr = dataArr.shift();
    console.log('len',dataArr.length)
    console.log(dataArr[0].trim().substring(1))
    var data = dataArr[0].trim().substring(1)
    if(data.replace(/\[|\]/g,'') == 'SDF1'){
        enrichItem(convertjson.Raw, function(err, retItems) {})
       
    }
    

}


function enrichItem(message, next) {
    var dataArray = message.split(',');
    console.log(dataArray.length)

    var dataarr = dataArray.shift();
    console.log(dataArray[0])
    console.log(dataArray[0].trim().substring(1))

    if (dataArray.length != 46) {
         return next("Invalid data format")
    }
    var companyID = 'SDF';
    var customerID = dataArray[0];
    var deviceID = dataArray[1];
    var deviceModel = dataArray[2];
    if(deviceModel === "AGROMAXX"){
        var deviceModel = dataArray[2];
    }
    else{
        console.log('do noth3')
    }
    console.log(customerID)
    if (!(dataArray[3] && dataArray[3].length >= 14)) {
        console.log ("Invalid date format")
    }
    var dateString = dataArray[3].substring(0, 14);
    console.log(dateString)
	var date =  moment(dateString + "UTC", "YYYYMMDDHHmmssZ");
    var timestamp = date.toISOString()
    var obj = {
        "companyID": companyID,
        "deviceID": deviceID,
        "deviceModel":deviceModel,
        "customerID":customerID,
        "devicePublishTime": timestamp,
        "rawData": message,
        "lat": dataArray[7],
        "lng": dataArray[9],
        "timeZone" : "+05:30",
        "uploadInterval" : dataArray[4],
        
    };
    var dvquery = {};
    dvquery.deviceID = deviceID;
    db.mst_data.findOne({ deviceID:deviceID },function(err, retDvmap) {
        if (err) {
           return (err)
       };
        console.log(retDvmap)
        var vehicleNumber = null;
        if (retDvmap) {
            
           obj.pinno = retDvmap.pinno;
       }
        // In prepare
        var newObj = {};
        newObj.travelSpeed = dataArray[10].trim(),
        newObj.GSMSiganlStrength = dataArray[11].trim(),
        newObj.GPSStatus = dataArray[5].trim(),
        newObj.powerSource = dataArray[13].trim(),
        newObj.batteryLevel = dataArray[14]/1000,
        newObj.fuelLevel = dataArray[17]/1000,
        newObj.coolantTemp = dataArray[18]/1000,
        newObj.airFilterChoke = dataArray[27].trim()
        newObj.hydralicOilFilterChoke = dataArray[28].trim(),
        newObj.oilpressure = dataArray[29].trim()
        newObj.AI1 = dataArray[17].trim(),
        newObj.AI2 = dataArray[18].trim(),
        newObj.ignitionStatus = dataArray[25].trim(),
        newObj.rpm = dataArray[26]/100,
        newObj.DO1 = dataArray[27].trim();
        newObj.DO2 = dataArray[28].trim();
        newObj.DO3 = dataArray[29].trim();
        newObj.fv = dataArray[43].trim();
        newObj.hv = dataArray[44].trim();
        newObj.CRC = dataArray[45].trim();
        obj.extras = newObj;
        console.log(obj);

            processItems(obj, function(err, response) {
                if (err) {
                    return (err);
                };
                return (response);
            })
        })
        return;

}


function processItems(heartbeat, next) {
    createItem(heartbeat, function( retResp,err) {
        if (err) {
            return next(err);
        }
        if (retResp) {
          
            const timestamp1 = Helper.date(new Date(retResp.createdAt))
            var timestamp =timestamp1;
            updateLastDataReceived(heartbeat.deviceID, heartbeat.lat, heartbeat.lng); 
            doEngineHoursCreateAndUpdate(heartbeat.extras.rpm, heartbeat.deviceID, heartbeat.pinno, timestamp,retResp);
            return next(retResp);
        };
    });
}

function createItem(newObj, next) {
    const rpm = Helper.SDFRPM(newObj.deviceModel,newObj.extras.rpm)
    newObj.extras.rpm = rpm; 
    if(newObj.extras.rpm==0){
        newObj.engineStatus='OFF';
    }else{
        newObj.engineStatus='ON';
    }
    const devicePublishTime = Helper.cuurrentdate(new Date(newObj.devicePublishTime))
    newObj.devicePublishTime= devicePublishTime;
    const SDFfuellevel = Helper.SDFfuellevel(newObj.extras.fuelLevel,newObj.deviceModel,newObj.engineStatus)
    newObj.extras.fuelLevel = SDFfuellevel;
   

    var coolanttemp = Helper.SDFcoolanttemp(newObj.extras.coolantTemp,newObj.deviceModel);
    if(newObj.extras.rpm==0){
        coolanttemp = 40;
        newObj.extras.coolantTemp= coolanttemp;
        
    }else{
        
        newObj.extras.coolantTemp= coolanttemp
    }
    const digitalinput1 = Helper.SDFdigitalinput1(newObj.extras.DO1);
    newObj.extras.airFilterChoke= digitalinput1;
    const digitalinput2 = Helper.SDFdigitalinput2(newObj.extras.DO2);
    newObj.extras.hydralicOilFilterChoke= digitalinput2;
    const digitalinput3 = Helper.SDFdigitalinput2(newObj.extras.DO3);
    newObj.extras.oilpressure= digitalinput3;
    const Datetime = Helper.cuurrentdate(new Date())
    newObj.createdAt= Datetime;
    console.log('llllllll',newObj)
    const dev = new db.datalive(newObj);
            dev.save(function (err,retResp){
                if (err) {
                    return next(err);
                }
               console.log('hhhjjj',retResp)
               return next(retResp);
            })
}


function updateLastDataReceived(deviceID, lat, lng) {
        var lastDataReceivedAt = Helper.cuurrentdate(new Date());
        var updateObj = {};
        updateObj.deviceID = deviceID;
        updateObj.lastDataReceivedAt = lastDataReceivedAt;
        updateObj.lat = lat;
        updateObj.lng = lng;
        console.log('lastdaterecd',updateObj)
        updateDVMAPItem(updateObj);

}

function doEngineHoursCreateAndUpdate(rpm, deviceID, pinno, timestamp,retResp) {
    var rpm = parseInt(rpm);
    console.log('rpm',rpm,timestamp);
    if (rpm<= 0 ) {
        checkIsEngineClosed(deviceID, pinno, function(err, retObj) {
    
            if (err) {
                console.log(err);
            };
console.log('ifrmmm',retObj)
            if (retObj && retObj.closed=='false') {
                
                var enginehours = {};
                enginehours.closed = true;
                enginehours.deviceID = deviceID;
                enginehours.offTimestamp = timestamp;
                console.log('l',enginehours.offTimestamp,retObj.onTimestamp)
                getEngineHours(enginehours.offTimestamp, retObj.onTimestamp, function(err, retHours) {
                    if (err) {
                        console.log(err);
                    };
                    console.log('return',retHours)
                    if (retHours) {
                        enginehours.engineHours = retHours.hours;
                        enginehours.seconds = retHours.seconds;
                        if (pinno) {
                            enginehours.pinno = pinno;
                        };
                        updateEngineHours(enginehours);
                        var itemObj = {};
                        itemObj.deviceID = deviceID;
                        itemObj.pinno = pinno;
                        itemObj.type = 'dvmap';
                        console.log('jjjjjjjj',itemObj)
                        db.items.findOne(itemObj, function(err, retDvmap) {
                            console.log('items',retDvmap)
                            if (err) {};
                            if (retDvmap && retDvmap.totalSeconds) {
                                itemObj.totalSeconds = parseInt(retDvmap.totalSeconds) + parseInt(enginehours.seconds);
                            } else {
                                itemObj.totalSeconds = parseInt(enginehours.seconds);
                            }
                            console.log('itemObj.totalSeconds',retDvmap.totalSeconds , enginehours.seconds)
                            itemObj.totalEngineHours = secondsToHHMMSS(itemObj.totalSeconds);
                            console.log('total enon',itemObj.totalEngineHours)
                            itemObj.engineOn = false;
                            console.log(retResp);
                            itemObj.engineStatus=retResp.engineStatus;
                            itemObj.lat=retResp.lat;
                            itemObj.lng=retResp.lng;
                            itemObj.lastDataReceivedAt=retResp.devicePublishTime;
                            itemObj.currentFuelStatus=retResp.fuelLevel;
                            
                            updateDVMAPItem(itemObj);
                        })
                    }
                });
            } else {
                console.log('kkk')
                console.log('::::::::::do nothing');
            }
        });
    } else {
        checkIsEngineClosed(deviceID, pinno, function(err, retObj) {
            if (err) {
                console.log(err);
            };
            console.log('kkkkkkkkkkkkkkkkkk',retObj)
            if (!retObj || retObj.closed=='true') {
                var enginehours = {};
                enginehours.companyID = 'SDF';
                enginehours.deviceID = deviceID;
                enginehours.closed = false;
                enginehours.engineStatus=retResp.engineStatus;
                enginehours.lastDataReceivedAt=retResp.devicePublishTime;
                enginehours.onTimestamp = timestamp;
                console.log('hdhdhdhd',enginehours.onTimestamp)
                enginehours.pinno = pinno;
                
                const Datetime = Helper.cuurrentdate(new Date())
                enginehours.createdAt= Datetime;
                createEngineHours(enginehours,enginehours.lastDataReceivedAt);
                //// upadte  items when engine off
                // enginstatus,lastdaterecived at,updatedAT
            } else {
                 console.log('lll::::::::::do nothing')
            }
        });
    }
}


function getLocationByLatLng(latlng, next) {
    var options = {
        url: "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng + "&sensor=true",
        method: 'GET'
    };
    request(options, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var location;
            try {
                apiResp = JSON.parse(body);
                location = apiResp.results[0].formatted_address;
                return next(location);
            } catch (ex) {
                return next(null);
            }
        } else {
            return next(null);
        }
    });
}

function checkIsEngineClosed(deviceID, pinno, next) {
    var query = {};
    query.deviceID = deviceID;
    if (pinno) {
        query.pinno = pinno;
    };
    query.closed = false;
    console.log('false',query)
    db.enginehours.findOne(query,function(err, retObj) {
        if (err) {
            console.log(err);
        };
        console.log('datatata',retObj)
        return next(null, retObj);
    });
}

function createEngineHours(engineHours,lastDataReceivedAt) {
    
    console.log('engih',engineHours)
    
    db.enginehours.create(engineHours, function(err, retObj) {
        if (err) {
            console.log(err);
        };
        if (retObj) {
            console.log('::::::::::::::::::::engineHours created');
            var obj = {};
            obj.deviceID = engineHours.deviceID;
            obj.engineLastOn = engineHours.onTimestamp;
            obj.engineStatus= engineHours.engineStatus;
            obj.lastDataReceivedAt = lastDataReceivedAt;
            obj.engineOn = true;
           
            updateDVMAPItem(obj);
        };
    })
}

function updateDVMAPItem(obj) {
    console.log('lllddd',obj)
    var query = {};
    query.deviceID = obj.deviceID;
    query.type = 'dvmap';
    const Datetime = Helper.cuurrentdate(new Date())
    obj.updatedAt= Datetime;
    console.log(query, obj)
    db.items.update(query, obj, function(err, retItem) {
        if (err) {
            console.log('dvmap item update failed');
        };
    });
}


function getEngineHours(offTimestamp, onTimestamp, next) {
    console.log('jjj',offTimestamp,onTimestamp)
    offTimestamp = new Date(offTimestamp)
    onTimestamp = new Date(onTimestamp)
    console.log('kjj',offTimestamp,onTimestamp)
    var seconds = (offTimestamp - onTimestamp) / 1000;
    var obj = secondsToHHMMSS(seconds);
    var newObj = {};
    newObj.hours = obj;
    newObj.seconds = seconds;
    console.log(newObj)
    return next(null, newObj);
}
function secondsToHHMMSS(totalSeconds) {
    console.log('secondddddddddd',totalSeconds)
    totalSeconds = Math.floor(totalSeconds);
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    var seconds = totalSeconds - (hours * 3600) - (minutes * 60);
    // round seconds
    seconds = Math.round(seconds * 100) / 100
    var result = (hours < 10 ? "0" + hours : hours);
    result += ":" + (minutes < 10 ? "0" + minutes : minutes);
    result += ":" + (seconds < 10 ? "0" + seconds : seconds);
    console.log('second',result)
    return result;
}

function updateEngineHours(enginehours) {
    var query = {};
    query.deviceID = enginehours.deviceID;
    if (enginehours.pinno) {
        query.pinno = enginehours.pinno;
    };
    query.closed = false;
    console.log('jj',enginehours)
    db.enginehours.update(query, enginehours, function(err, retObj) {
        if (err) {
            console.log(err);
        };
        if (retObj.length > 0) {
            console.log('::::::::::::::::::::engineHours updated');
        };
    })
}

