///Listener service for AJAX-VTS3 devices
var moment = require("moment")
var db = require('../../../_helpers/db');
const Helper = require('../../../_helpers/helper');
//const Notification = require('../../../_helpers/Notification/notification.service')

module.exports.split = split;
async function split(data){
    var convertjson = JSON.parse(data);
    console.log('lll',convertjson)
    var dataArr = convertjson.Raw.split(',');
    var dataarr = dataArr.shift();
    console.log('len',dataArr.length)
    console.log(dataArr[0].trim().substring(1))
    var data = dataArr[0].trim().substring(1)
    if(data.replace(/\[|\]/g,'') == 'AJAX'){
        enrichItem(convertjson.Raw, function(err, retItems) {})       
    }else if(data.replace(/\[|\]/g,'') == 'AJAX-1'){
        enrichBatch(convertjson.Raw, function(err, retItems) {})
       
    }
}
function enrichBatch(message, next){
    console.log("batch")
    var dataArray = message.split(',');
    console.log(dataArray.length)

    var dataarr = dataArray.shift();
    console.log(dataArray[0])
    console.log('jjj',dataArray[0].trim().substring(1))

    if (dataArray.length != 22) {
        return next("Invalid data format")
    }
    var companyID = 'AJAXFIORI';
    var customerID = dataArray[0].trim().substring(1);
    var deviceID = dataArray[1];
    var companyID = 'AJAXFIORI';
    var deviceID = dataArray[1];
    if (!(dataArray[3] && dataArray[3].length >= 14)) {
        return next("Invalid date format")
    }
    var DT = dataArray[7].trim().split('-');
    var bDT = new Date(DT[1]+'/'+DT[0]+'/'+DT[2]);

    var dateString = dataArray[3].substring(0, 14);
    var convertedDate = moment(dateString + "IST", "YYYYMMDDHHmmssZ");
    convertedDate =new Date(convertedDate);
    devpub =  Helper.cuurrentdate(convertedDate);
    db.mst_data.findOne({ deviceID:deviceID,type:"machinemaster" },function(err, retDvmap) {
        if (err) {
           return (err)
       };
        console.log(retDvmap)
        var vehicleNumber = null;
        if (retDvmap) {

           var pinno = retDvmap.pinno;
       }else{
           console.log("no pinno")
       }


    var newObj = {};

    newObj.companyID= companyID;
    newObj.customerID= dataArray[0].slice(1);
    newObj.productID= dataArray[2];
    newObj.deviceID= deviceID;
    newObj.pinno = pinno;
    newObj.devicePublishTime= devpub;
    // "timeZone": timeZone,
    newObj.rawData = message;
    newObj.batchNo = dataArray[4].trim();
    newObj.machineID = dataArray[5].trim();
    newObj.batchTime = dataArray[6].trim();
    newObj.batchDate = bDT;
    newObj.aggt10mm = parseFloat(dataArray[8].trim());
    newObj.aggt20mm = parseFloat(dataArray[9].trim());
    newObj.aggt30mm = parseFloat(dataArray[10].trim());
    newObj.cement01mm = parseFloat(dataArray[11].trim());
    newObj.cement02mm = parseFloat(dataArray[12].trim());
    newObj.sand01mm = parseFloat(dataArray[13].trim());
    newObj.sand02mm = parseFloat(dataArray[14].trim());
    newObj.water = parseFloat(dataArray[15].trim());
    newObj.additive = parseFloat(dataArray[16].trim());
    newObj.totalWT = parseFloat(dataArray[17].trim());
    newObj.cum = parseFloat(dataArray[18].trim());
    newObj.fv = dataArray[19].trim();
    newObj.hv = dataArray[20].trim();
    newObj.crc = dataArray[21].trim();
    const Datetime = Helper.cuurrentdate(new Date())
    newObj.createdAt= Datetime;

    console.log('Batchreport :',newObj);
    createBranchrepot(newObj, function(err, retHeartbeat) {
        if (retHeartbeat) {
            return next(null, retHeartbeat);
        } else {
            return next(null, err);
        }

    });
});
}

function createBranchrepot(newObj, next) {


    const Batch = new db.batchdata(newObj);

    Batch.save(function (err,item){
        if (err) {
            console.log('Error..........', err)
            return next({
                "status": "Failed to query DB"
            })
        };
        if (!item) {
            next({
                "status": "No data found"
            });
            return;
        };
        next(null, {
            'status': 'success'
        });

    })
}




function enrichItem(message, next) {
    var dataArray = message.split(',');
    console.log(dataArray.length)

    var dataarr = dataArray.shift();
    console.log(dataArray[0])
    console.log('jjj',dataArray[0].trim().substring(1))

    if (dataArray.length == 47) {
         return next("Invalid data format")
    }
    var companyID = 'AJAXFIORI';
    var customerID = dataArray[0].trim().substring(1);
    var deviceID = dataArray[1];
    var deviceModel = dataArray[2];
    var ARGO = deviceModel.slice(0,4);
    if(ARGO === "ARGO"){
        deviceModel = dataArray[2];
   

    if (!(dataArray[3] && dataArray[3].length >= 17)) {
        console.log ("Invalid date format")
    }
    if(dataArray[3].length==17){
        var dateString = dataArray[3].substring(0, 14);
        console.log(dateString)
        var date =  moment(dateString + "UTC", "YYYYMMDDHHmmssZ");
        var timestamp = date.toISOString();
        timestamp= Helper.date(new Date(timestamp))

    }
    else{
        var dateString = dataArray[3].substring(0, 14);
        console.log(dateString)
        var date =  moment(dateString + "UTC", "YYYYMMDDHHmmssZ");
        var timestamp = date.toISOString();
        
    }
    //var dateString = dataArray[3].substring(0, 14);
    //console.log(dateString)
//	var date =  moment(dateString + "UTC", "YYYYMMDDHHmmssZ");
  //  var timestamp = date.toISOString()
    var obj = {
        "companyID": companyID,
        "deviceID": deviceID,
        "deviceModel":deviceModel,
        "customerID":customerID,
        "devicePublishTime": timestamp,
        "rawData": message,
        "latPrevious":dataArray[6],
        "latCurrent": dataArray[7],
        "lngPrevious": dataArray[8],
        "lngCurrent": dataArray[9],
        "timeZone" : "+05:30",
        "uploadInterval" : dataArray[4],
        
    };
    var dvquery = {};
    dvquery.deviceID = deviceID;
    db.mst_data.findOne({ deviceID:deviceID,type:"machinemaster" },function(err, retDvmap) {
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
        newObj.parkingSwitch = dataArray[27].trim()
        newObj.hydralicOilFilterChoke = dataArray[28].trim(),
        newObj.oilpressure = dataArray[19]/1000
        newObj.AI1 = dataArray[18].trim(),
        newObj.AI2 = dataArray[17].trim(),
        newObj.distance = 0;
        newObj.ignitionStatus = dataArray[25].trim(),
        newObj.rpm = dataArray[26]/100,
        newObj.DO1 = dataArray[27].trim();
        newObj.DO2 = dataArray[28].trim();
        newObj.DO3 = dataArray[29].trim();
        newObj.fv = dataArray[43].trim();
        newObj.hv = dataArray[44].trim();
        newObj.CRC = dataArray[45].trim();
        obj.extras = newObj;
        console.log('jhjh',obj);

            processItems(obj, function(err, response) {
                if (err) {
                    return (err);
                };
                return (response);
            })
        })
        return;
    }
    else{
        console.log('stop data')
    }

}


function processItems(heartbeat, next) {
    createItem(heartbeat, function( retResp,err) {
        if (err) {
            return next(err);
        }
        if (retResp) {
          
            const timestamp1 = retResp.devicePublishTime;
            var timestamp =timestamp1;
            updateLastDataReceived(heartbeat.deviceID, heartbeat.latCurrent, heartbeat.lngCurrent); 
	  //  Notification.sendNotification(heartbeat);
            doEngineHoursCreateAndUpdate(heartbeat.extras.rpm, heartbeat.deviceID, heartbeat.pinno, timestamp,retResp,heartbeat.latPrevious,heartbeat.lngPrevious,heartbeat.latCurrent,heartbeat.lngCurrent);
            return next(retResp);
        };
    });
}

function createItem(newObj, next) {
    const rpm = Helper.VTS3RPM(newObj.deviceModel,newObj.extras.rpm)
    console.log('jkjkjkjkjkjkj',rpm)
    newObj.extras.rpm = rpm; 
    if(newObj.extras.rpm==0){
        newObj.engineStatus='OFF';
    }else{
        newObj.engineStatus='ON';
    }
    const devicePublishTime = Helper.cuurrentdate(new Date(newObj.devicePublishTime))
    newObj.devicePublishTime= devicePublishTime;
    const VTS3fuel= Helper.VTS3fuellevel(newObj.extras.fuelLevel,newObj.deviceModel,newObj.engineStatus)
    console.log('hhjhjhjh',VTS3fuel)
    newObj.extras.fuelLevel = VTS3fuel.fuelLevel;
    newObj.extras.fuelInLitres= VTS3fuel.fuelInLitres;
    const VTS3Distance= Helper.getDistanceFromLatLonInKm(newObj.latPrevious,newObj.lngPrevious,newObj.latCurrent,newObj.lngCurrent)
    console.log('distance',VTS3Distance)
    newObj.lat = newObj.latCurrent;
    newObj.lng = newObj.lngCurrent;
    newObj.extras.distance = VTS3Distance;
    
    var coolanttemp = Helper.VTS3coolanttemp(newObj.extras.coolantTemp,newObj.deviceModel);
    if(newObj.extras.rpm==0){
        coolanttemp = 40;
        newObj.extras.coolantTemp= coolanttemp;
        
    }else{
        
        newObj.extras.coolantTemp= coolanttemp
    }
    const digitalinput1 = Helper.VTS3digitalinput1(newObj.extras.DO1);
    newObj.extras.parkingSwitch= digitalinput1;
    const digitalinput2 = Helper.VTS3digitalinput2(newObj.extras.DO2);
    newObj.extras.hydralicOilFilterChoke= digitalinput2;
    const digitalinput3 = Helper.VTS3oilpressure(newObj.extras.oilpressure,newObj.deviceModel);
    newObj.extras.oilpressure= digitalinput3;
    const Datetime = Helper.cuurrentdate(new Date())
    newObj.createdAt= Datetime;
    console.log('llllllll',newObj);
	var devicePublishTime1 = new Date(newObj.devicePublishTime);
    console.log("devicePublishTime",devicePublishTime1)
    devicePublishTime1 = devicePublishTime1.valueOf()
    console.log(devicePublishTime1);
    datetime = new Date();
    datetime.setHours(datetime.getHours() + 5);
    datetime.setMinutes(datetime.getMinutes() + 30);
    datetime.setMinutes(datetime.getMinutes() - 15);
    let olddata = datetime.valueOf();
    console.log("time1",olddata)
     if(devicePublishTime1 <= olddata ){
         newObj.Status = "VTS3OLD";
        const dev = new db.datadeffered(newObj);
            dev.save(function (err,retResp){
                if (err) {
                    return next(err);
                }
               console.log("datadeffered",retResp)
            })
    }else if(devicePublishTime1 >= olddata){
        newObj.Status = "VTS3LIVE";
        const dev = new db.datalive(newObj);
            dev.save(function (err,retResp){
                if (err) {
                    return next(err);
                }

               console.log("datalive",retResp)
               return next(retResp);
            })

    }else{
	    console.log("do nothing")
    }
 //   const dev = new db.datalive(newObj);
   //         dev.save(function (err,retResp){
     //           if (err) {
       //             return next(err);
         //       }
           //    console.log('hhhjjj',retResp)
             //  return next(retResp);
          //  })
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

function doEngineHoursCreateAndUpdate(rpm, deviceID, pinno, timestamp,retResp,latPrevious,lngPrevious,latCurrent,lngCurrent) {
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
//                enginehours.offTimestamp = timestamp;
                db.datalive.findOne({"deviceID":retObj.deviceID,engineStatus:"ON",companyID:"AJAXFIORI"}).sort({devicePublishTime:-1}).limit(1).exec(function(err, ret) {
                console.log('l',ret.devicePublishTime,retObj.onTimestamp);
			enginehours.offTimestamp = ret.devicePublishTime;
                getEngineHours(ret.devicePublishTime, retObj.onTimestamp, function(err, retHours) {
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
                        console.log('jjjjjjjj',itemObj);

                        db.items.findOne(itemObj, function(err, retDvmap) {
                            console.log('items',retDvmap)

                            if (err) {};
				if (retDvmap && retDvmap.totalSeconds) {
                                itemObj.totalSeconds = parseInt(retDvmap.totalSeconds) + parseInt(enginehours.seconds) - parseFloat(retDvmap.lastSumSecond);
                            } else {
                                itemObj.totalSeconds = parseInt(enginehours.seconds);
                            }
                            console.log('totalSeconds',retDvmap.totalSeconds , enginehours.seconds)
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
                enginehours.companyID = 'AJAXFIORI';
                enginehours.deviceID = deviceID;
                enginehours.closed = false;
                enginehours.engineStatus=retResp.engineStatus;
                enginehours.lastDataReceivedAt=retResp.devicePublishTime;
                enginehours.onTimestamp = timestamp;
                console.log(enginehours.onTimestamp)
                enginehours.pinno = pinno;
                
                const Datetime = Helper.cuurrentdate(new Date())
                enginehours.createdAt= Datetime;
                createEngineHours(enginehours,enginehours.lastDataReceivedAt);
                
                
            } else {
                console.log(retObj)
                const Datetime = Helper.cuurrentdate(new Date())
                console.log(Datetime)
                console.log(retObj.deviceID)
                db.enginehours.findOne({"deviceID":retObj.deviceID,closed:"false",companyID:"AJAXFIORI"}).sort({onTimestamp:-1}).limit(1).exec(function(err, ret) {
                    console.log(ret.onTimestamp)

                getEngineHours(Datetime, ret.onTimestamp, function(err, retHours) {
                    if (err) {
                        console.log(err);
                    };
                    console.log('return',retHours)
                    if (retHours) {
                        const engineHours = retHours.hours;
                        const seconds = retHours.seconds;

                        console.log("seconds",seconds)

            	deltadistance={};
                deltadistance.pinno = retObj.pinno;
                deltadistance.deviceID = retObj.deviceID
                deltadistance.type="dvmap"
                db.items.findOne(deltadistance,{totalDistance:1,totalEngineHours:1,totalSeconds:1,deviceID:1,lastupdatedSecond:1,lastSumSecond:1}, function(err, retDvmap) {
                    var stringJson = JSON.stringify(retDvmap);
                    var Json = JSON.parse(stringJson);
			console.log("previous data",Json)
                    var itemobj ={}
                    itemobj.deviceID= retDvmap.deviceID;
		     const VTS3Distance= Helper.getDistanceFromLatLonInKm(latPrevious,lngPrevious,latCurrent,lngCurrent)
                    console.log('VTSD',VTS3Distance)
                    if(retDvmap.lastupdatedSecond===undefined){
                        retDvmap.lastupdatedSecond="0.00"
                    }
		    if(retDvmap.lastSumSecond===undefined){
                        retDvmap.lastSumSecond="0.00"
                    }
                    if (err) {};
                            if (retDvmap && Json.totalDistance && retDvmap.totalSeconds) {
				itemobj.lastSumSecond = parseInt(retDvmap.lastSumSecond) + parseInt(seconds) - parseFloat(retDvmap.lastupdatedSecond);
                                itemobj.totalSeconds = parseInt(retDvmap.totalSeconds) + parseInt(seconds) - parseFloat(retDvmap.lastupdatedSecond);
                                console.log("sss",itemobj.totalSeconds)
                               
				totaldistance = parseFloat(Json.totalDistance) + parseFloat(VTS3Distance);
                                console.log('totaldistanc',totaldistance)
                                itemobj.totalDistance= totaldistance
                                

                            } else {
                                itemobj.totalSeconds = parseInt(enginehours.seconds);
                               
                            }
                            console.log('itemObj.totalSeconds',retDvmap.totalSeconds , seconds)
                            itemobj.totalEngineHours = secondsToHHMMSS(itemobj.totalSeconds);
                            itemobj.lastupdatedSecond = seconds;
                            console.log('total enon',itemobj.totalEngineHours);
                            console.log('dataaa',itemobj)
                            updateDVMAPItem(itemobj)
                            //updateDistanceItem(itemobj.deviceID,totaldistance);
                        }) 
                    }
                });  
            });  
	    }
    
        });
        
    }
}



function updateDistanceItem(deviceID,distance) {
    console.log('ddd',deviceID,parseFloat(distance))
    var query = {};
    query.deviceID = deviceID;
    query.type = 'dvmap';
    var obj ={};
    const Datetime = Helper.cuurrentdate(new Date())
    obj.updatedAt= Datetime;
    obj.totalDistance = distance

    console.log(query, obj)
    db.items.update(query, obj, function(err, retItem) {
        if (err) {
            console.log('dvmap item update failed');
        };
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
            obj.lastupdatedSecond = "0.00";   
		obj.lastSumSecond = "0.00";
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
    db.items.update(query, {'$set' : obj}, function(err, retItem) {
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


