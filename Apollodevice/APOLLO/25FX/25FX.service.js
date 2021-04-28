///Listener service for AJAX-APOLLO(AT1022500) devices
var moment = require("moment")
var db = require('../../../_helpers/db');
const Helper = require('../../../_helpers/helper');


module.exports.multipacket = multipacket;

async function multipacket(packet) {
    var devicedata = packet;
    var convertjson = JSON.parse(devicedata);
    
   var array = convertjson.Raw.split(',');
   console.log(array[1])
   
   if(array[1]==='$Header'){
    
    var raw = convertjson.Raw.split('$Header'); 
    // console.log(raw)   
     for(let data of raw){
     //for(var i=1;i<raw.length;i++){
         var Raw = data;
         console.log(Raw)
        split(Raw, function(err, retItems) {});
     }

    //  function multiTosingle() {         //  create a loop function
    //     setTimeout(function() {  //  call a 3s setTimeout when the loop is called
    //       var Raw = raw[i];
    //       console.log(Raw)
    //       split(Raw, function(err, retItems) {});   //  your code here
    //       i++;                    //  increment the counter
    //       if (i < raw.length) {           //  if the counter < 10, call the loop function
    //         multiTosingle();             //  ..  again which will trigger another 
    //       }                       //  ..  setTimeout()
    //     }, 3000)
    //   }
      
    //   multiTosingle();
    
   }else{
       console.log("packet false")
   }
    
    
}

async function split(data){
    console.log('as123',data)
    var convertjson = data;
    var dataArr = convertjson.split(',');
    console.log('len',dataArr.length)
    console.log('jj',dataArr[1])
    if(dataArr[1].replace(/\[|\]/g,'') == 'AT1022500'){
        await enrichItem(convertjson, function(err, retItems) {})
       
    }
        
}


function enrichItem(message, next) {
    console.log('hhjjjj',message)
   
    var dataArray = message.split(',');
    console.log(dataArray.length)


    if (dataArray.length != 55) {
         return next("Invalid data format")
    }
    var companyID = 'APOLLO';
	
	var deviceModel = '25FX'
    var deviceID = dataArray[6];
    dataArray[9] = dataArray[9] + dataArray[10];
    console.log('kkll',dataArray[9])
    if (!(dataArray[9] && dataArray[9].length >= 14)) {
        console.log ("Invalid date format")
    }
    var dateString = dataArray[9].substring(0, 14);
    console.log('hhh',dateString)
    var timestamp =  moment(dateString + "UTC", "DDMMYYYYHHmmssZ");
    timestamp = new Date (timestamp)
    timestamp.setHours(timestamp.getHours() + 5);
    timestamp.setMinutes(timestamp.getMinutes() + 30);
    timestamp = timestamp.toISOString();
    console.log('om',timestamp)

    var obj = {
        "companyID": companyID,
        "deviceID": deviceID,
        "deviceModel":deviceModel,
       // "customerID":customerID,
        "devicePublishTime": timestamp,
        "rawData": message,
        "lat": dataArray[11],
        "lng": dataArray[13],
        "timeZone" : "+05:30",
        //"uploadInterval" : dataArray[4],
        
    };
    var dvquery = {};
    dvquery.deviceID = deviceID;
   

    db.mst_data.findOne({ deviceID:deviceID },function(err, retDvmap) {
        if (err) {
           return (err)
       };
        console.log('jjj',retDvmap)
        var vehicleNumber = null;
        if (retDvmap) {
            //obj.deviceModel = retDv.deviceModel
           obj.pinno = retDvmap.pinno;
       }
        // In prepare
        var newObj = {};

        newObj.travelSpeed = dataArray[15].trim(),
        newObj.ignitionStatus = dataArray[8].trim(),
        newObj.batteryLevel = dataArray[24],
        newObj.GSMSiganlStrength = dataArray[30].trim(),
        
        newObj.coolantTemp = dataArray[48],
        newObj.oilpressure = dataArray[49],

        newObj.AI1 = dataArray[48],
        newObj.AI2 = dataArray[49],
        newObj.distance = dataArray[52]/1000,
        newObj.rpm = dataArray[54],
       
        newObj.DI = dataArray[45].trim();
       
        obj.extras = newObj;
        console.log('hhhhhhhhhhhhhhhhhhhssssssss',obj)

            processItems(obj, function(err, response) {
                if (err) {
                    return (err);
                };
                return (response);
            })
       
   })
        return;

}



async function processItems(heartbeat, next) {
    createItem(heartbeat, function( retResp,err) {
        if (err) {
            return next(err);
        }
        if (retResp) {
            console.log(retResp.createdAt)
            const timestamp1 = Helper.date(new Date(retResp.createdAt))
            var timestamp =timestamp1;

            updateLastDataReceived(heartbeat.deviceID, heartbeat.lat, heartbeat.lng);
            doEngineHoursCreateAndUpdate(heartbeat.extras.rpm, heartbeat.deviceID, heartbeat.pinno, timestamp,retResp,heartbeat.extras.distance);
            return next(retResp);

            
        };
    });
}

function createItem(newObj, next) {
    console.log('jhcvsdc',newObj.deviceModel,newObj.extras.rpm)
    const rpm = Helper.RPMApollo(newObj.deviceModel,newObj.extras.rpm)
    newObj.extras.rpm = rpm;
	console.log('ATAttttttttttttt',rpm);
    if(newObj.extras.rpm==0){
        newObj.engineStatus='OFF';
    }else{
        newObj.engineStatus='ON';
    }
    const devicePublishTime = Helper.cuurrentdate(new Date(newObj.devicePublishTime))
    newObj.devicePublishTime= devicePublishTime;
    

    var coolanttemp = Helper.apollocoolanttemp(newObj.extras.AI1,newObj.deviceModel);
    if(newObj.extras.rpm==0){
        coolanttemp = 40;
        newObj.extras.coolantTemp= coolanttemp;
        newObj.extras.AI1=coolanttemp;
    }else{
        newObj.extras.AI1=coolanttemp
        newObj.extras.coolantTemp= coolanttemp
    }
    const oilpressure = Helper.apolloengineoil(newObj.extras.AI2,newObj.deviceModel);
    newObj.extras.AI2=oilpressure
    newObj.extras.oilpressure= oilpressure
    const DIdata = newObj.extras.DI.split('');
    newObj.extras.DI1=DIdata[0];
 

    


    const fuellevel = Helper.Apollodigitalinput(newObj.extras.DI1);
    newObj.extras.fuelLevel= fuellevel;

    const Datetime = Helper.cuurrentdate(new Date())
    newObj.createdAt= Datetime;
    
        
    console.log('shiva123',newObj)
    const dev = new db.datalive(newObj);
            dev.save(function (err,retResp){
                if (err) {
                    return next(err);
                }
               // console.log(item)
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

function doEngineHoursCreateAndUpdate(rpm, deviceID, pinno, timestamp,retResp,totalDistance) {
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
                enginehours.companyID = 'APOLLO';
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
			
                console.log(retObj)
                deltadistance={};
                deltadistance.pinno = retObj.pinno;
                deltadistance.deviceID = retObj.deviceID
                deltadistance.type="dvmap"
                console.log("jhh")
                db.items.findOne(deltadistance,{totalDistance:1,deviceID:1}, function(err, retDvmap) {
                    var stringJson = JSON.stringify(retDvmap);
                    var Json = JSON.parse(stringJson);
                    var itemobj ={}
                    itemobj.deviceID= retDvmap.deviceID;
                    if (err) {};
                            if (retDvmap && Json.totalDistance) {
                                totaldistance = parseFloat(Json.totalDistance) + parseFloat(totalDistance);
                                console.log(totaldistance)
                                itemobj.totalDistance= totaldistance
                                

                            } else {
                               
                            }
                            console.log('kk',itemobj.deviceID,totaldistance)
                            updateDistanceItem(itemobj.deviceID,totaldistance);
                })
               
                 
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

async function checkIsEngineClosed(deviceID, pinno, next) {
    var query = {};
    query.deviceID = deviceID;
    if (pinno) {
        query.pinno = pinno;
    };
    query.closed = false;
    console.log('false',query)
    
        await db.enginehours.findOne(query,function(err, retObj) {
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

