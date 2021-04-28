
var moment = require("moment")
var db = require('../../../_helpers/db');
const Helper = require('../../../_helpers/helper');
//const Notification = require('../../../_helpers/Notification/notification.service');


// async function multibatch(packet) {
//     var i=1;
//     var devicedata = packet;

//     var convertjson = JSON.parse(devicedata);
//     console.log(devicedata)
//     var array = convertjson.Raw.split(',');
//     console.log(array)
//     if(array[1]==='$Augtrans1'){
//     var raw = convertjson.Raw.split(array[1]);
//      var a = raw[1].split(',')

//  function multiTosinglebatch() {         //  create a loop function
//         setTimeout(function() {   //  call a 3s setTimeout when the loop is called
//             var Raw = raw[i];
//             splitbatch(Raw, function(err, retItems) {});   //  your code here
//           i++;                    //  increment the counter
//           if (i < raw.length) {           //  if the counter < 10, call the loop function
//             multiTosinglebatch();             //  ..  again which will trigger another
//           }                       //  ..  setTimeout()
//         }, 3000)
//       }

//       multiTosinglebatch();

//    }else{
//        console.log("packet false")
//    }



// }


async function multibatch(packet) {
    var i=1;
    var devicedata = packet;
   
    var convertjson = JSON.parse(devicedata);
    console.log(devicedata)
    var array = convertjson.Raw.split(',');
    console.log(array)
    var slice = array[9].slice(0,2)
    console.log('hsda',slice)
    if(array[1]==='$iTriangle1' && slice === "42"){
    var raw = convertjson.Raw.split(array[1]); 
     var a = raw[1].split(',')
      
     for(i=1;i<raw.length;i++){
         var Raw = raw[i];
 console.log(Raw)
        splitbatch(Raw, function(err, retItems) {})
     }
 

   }else{
       console.log("packet false")
   }

    
    
}
async function splitbatch(Raw) {
    console.log(Raw)
    
    enrichBatchformat2(Raw, function(err, retItems) {})
    //enrichBatchformat1(dataArr, function(err, retItems) {})
    
}



async function multipacket(packet) {
    i=1;
    var devicedata = packet;
   
    var convertjson = JSON.parse(devicedata);
   var array = convertjson.Raw.split(',');
   console.log(array[1])
   if(array[1]==='$Header'){
    var raw = convertjson.Raw.split('$Header'); 
    
     var a = raw[1].split(',')
 
for(i=1;i<raw.length;i++){
         var Raw = raw[i];
 
         split(Raw, function(err, retItems) {})
     }
   }else{
       console.log("packet false")
   }
    
    
}

async function split(data){
    var convertjson = data;
   console.log('lll',convertjson)
  
    var dataArr = convertjson.split(',');
    
    console.log('len',dataArr.length)
    console.log('jj',dataArr[1])
    if(dataArr[1].replace(/\[|\]/g,'') == 'Augtrans1'){
        enrichItem(convertjson, function(err, retItems) {})
       
    }

    
        
}


function enrichItem(message, next) {
    console.log('hhjjjj',message)
   
    var dataArray = message.split(',');
    
    console.log(dataArray.length)


    if (dataArray.length != 55) {
         return next("Invalid data format")
        
    }
    var companyID = 'AJAXFIORI';
   
    var deviceModel = 'ARGO4000'
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
       
        "devicePublishTime": timestamp,
        "rawData": message,
        "lat": dataArray[11],
        "lng": dataArray[13],
        "timeZone" : "+05:30",
        
        
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
            
           obj.pinno = retDvmap.pinno;
       }
        
        var newObj = {};

        newObj.travelSpeed = dataArray[15].trim(),
        newObj.ignitionStatus = dataArray[22].trim(),
        newObj.batteryLevel = dataArray[24].trim(),
        newObj.GSMSiganlStrength = dataArray[30].trim(),
        
        newObj.fuelLevel = dataArray[48].trim(),
        newObj.coolantTemp = dataArray[49].trim(),
        newObj.oilpressure = dataArray[50].trim()

        newObj.AI1 = dataArray[48].trim(),
        newObj.AI2 = dataArray[49].trim(),
        newObj.AI3 = dataArray[50].trim(),
        
        newObj.rpm = dataArray[54],
       newObj.distance = dataArray[52]/1000;
        newObj.DI = dataArray[45].trim();
        

       
        obj.extras = newObj;
        

            processItems(obj, function(err, response) {
                if (err) {
                    return (err);
                };
                return (response);
            })
       
   })
        return;

}




function enrichBatchformat1(message, next){
    dataArray = message
    console.log(dataArray.length)
    if (dataArray.length != 13) {
        return next("Invalid data format")
    }

    var companyID = 'AJAXFIORI';
    var productID = "AJAXFIORI";
    var deviceID = dataArray[1];

 var pinno;
    if (!(dataArray[5] && dataArray[5].length >= 14)) {
         return next("Invalid date format")
    }
    db.items.findOne({ deviceID:deviceID },function(err, retDv) {
        if (err) {
           return (err)
       };
    db.mst_data.findOne({ deviceID:deviceID,type:"machinemaster" },function(err, retDvmap) {
        if (err) {
           return (err)
       };
        console.log('jjjbatch',retDvmap,retDv)
        var vehicleNumber = null;
        if (retDvmap && retDv ) {
            
           pinno = retDvmap.pinno;
           deviceModel = retDv.deviceModel
       }

    if (!(dataArray[5] && dataArray[5].length >= 14)) {
         return next("Invalid date format")
    }
    
    

    var dateString = dataArray[5].substring(0, 14);
    
    
    var convertedDate =  moment(dateString + "UTC", "DDMMYYYYHHmmssZ");
    convertedDate = new Date (convertedDate)
    convertedDate.setHours(convertedDate.getHours() + 5);
    convertedDate.setMinutes(convertedDate.getMinutes() + 30);
    convertedDate = convertedDate.toISOString();
    console.log(convertedDate)
    var newObj = {};

    newObj.companyID= companyID;
    newObj.productID= productID; 
    
    newObj.deviceID= deviceID;
    newObj.deviceModel=deviceModel;
    newObj.devicePublishTime= convertedDate;
     
    newObj.rawData = message;
    var HextoAscii = Helper.batchhextoascii(dataArray[8]);
    
    if(HextoAscii==="undefinded"){
        console.log("do nothing")
    }else{
    console.log('hextoascii',HextoAscii)
    newObj.batchNo = HextoAscii.BatchNo.trim();
    newObj.machineID = HextoAscii.MACHID.trim();
    newObj.batchTime = HextoAscii.Time.trim();
    newObj.batchDate = HextoAscii.Date;
    newObj.pinno = pinno;
    newObj.aggt10mm = parseFloat(HextoAscii.AGGT01mm.trim());
    newObj.aggt20mm = parseFloat(HextoAscii.AGGT02mm.trim());
    newObj.aggt30mm = parseFloat(HextoAscii.AGGT03mm.trim());
    newObj.cement01mm = parseFloat(HextoAscii.CEMT01.trim());
    newObj.cement02mm = parseFloat(HextoAscii.CEMT02.trim());
    newObj.sand01mm = parseFloat(HextoAscii.SAND01.trim());
    newObj.sand02mm = parseFloat(HextoAscii.SAND02.trim());
    newObj.water = parseFloat(HextoAscii.WATER.trim());
    newObj.additive1 = parseFloat(HextoAscii.ADTV1.trim());
    newObj.additive2 = parseFloat(HextoAscii.ADTV2.trim());
    newObj.totalWT = parseFloat(HextoAscii.TOTALWT.trim());
    newObj.cum = parseFloat(HextoAscii.CuM.trim());
   
    
    const Datetime = Helper.cuurrentdate(new Date())
    newObj.createdAt= Datetime;
    console.log('full data1',newObj);
    createBranchrepot(newObj, function(err, retHeartbeat) {
        if (retHeartbeat) {
            return next(null, retHeartbeat);
        } else {
            return next(null, err);
        }
    });
    }
})
    })
}

function enrichBatchformat2(message, next){
    dataArr = message.split(',');
    console.log('ghg',message)
    dataArray = dataArr

    console.log(dataArray.length)
    if (dataArray.length != 13) {
        return next("Invalid data format")
    }

    var companyID = 'AJAXFIORI';
    var productID = "AJAXFIORI";
    var deviceID = dataArray[1];

 var pinno;
    if (!(dataArray[5] && dataArray[5].length >= 14)) {
         return next("Invalid date format")
    }
    db.items.findOne({ deviceID:deviceID },function(err, retDv) {
        if (err) {
           return (err)
       };
    db.mst_data.findOne({ deviceID:deviceID,type:"machinemaster" },function(err, retDvmap) {
        if (err) {
           return (err)
       };
        console.log('jjjbatch',retDvmap,retDv)
        var vehicleNumber = null;
        if (retDvmap && retDv ) {
            
           pinno = retDvmap.pinno;
           console.log('klkklk',pinno)
           //deviceModel = retDv.deviceModel
       }

    if (!(dataArray[5] && dataArray[5].length >= 14)) {
         return next("Invalid date format")
    }
    var dateString = dataArray[5].substring(0, 14);
    var convertedDate =  moment(dateString + "UTC", "DDMMYYYYHHmmssZ");
    convertedDate = new Date (convertedDate)
    convertedDate.setHours(convertedDate.getHours() + 5);
    convertedDate.setMinutes(convertedDate.getMinutes() + 30);
    convertedDate = convertedDate.toISOString();
    console.log(convertedDate)
    var newObj = {};

    newObj.companyID= companyID;
    newObj.productID= productID; 
    
    newObj.deviceID= deviceID;
   // newObj.deviceModel=deviceModel;
    newObj.devicePublishTime= convertedDate;
     
    newObj.rawData = message;
    var HextoAscii = Helper.batchhextoascii2(dataArray[8]);
    if(HextoAscii==="undefinded"){
        console.log("do nothing")
    }else{
    console.log('hextoascii',HextoAscii)
    newObj.batchNo = HextoAscii.batchno;
    newObj.machineID = HextoAscii.MACHID;
    newObj.batchTime = HextoAscii.Time;
    newObj.batchDate = HextoAscii.Date;
    newObj.pinno = pinno;
    newObj.aggt10mm = parseFloat(HextoAscii.AGGT10mm);
    newObj.aggt20mm = parseFloat(HextoAscii.AGGT20mm);
    newObj.aggt30mm = parseFloat(HextoAscii.AGGT30mm);
    newObj.cement01mm = parseFloat(HextoAscii.SAND01);
    newObj.cement02mm = parseFloat(HextoAscii.SAND02);
    newObj.sand01mm = parseFloat(HextoAscii.CEMT01);
    newObj.sand02mm = parseFloat(HextoAscii.CEMT02);
    newObj.water = parseFloat(HextoAscii.WATER);
    newObj.additive1 = parseFloat(HextoAscii.ADDITIVE);
    newObj.totalWT = parseFloat(HextoAscii.TOTALWT);
    newObj.cum = parseFloat(HextoAscii.CuM);
   
    
    const Datetime = Helper.cuurrentdate(new Date())
    newObj.createdAt= Datetime;
    console.log('full data2',newObj);
    createBranchrepot(newObj, function(err, retHeartbeat) {
        if (retHeartbeat) {
            return next(null, retHeartbeat);
        } else {
            return next(null, err);
        }
    });
    }
})
    })
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




function processItems(heartbeat, next) {
    createItem(heartbeat, function( retResp,err) {
        if (err) {
            return next(err);
        }
        if (retResp) {
            console.log('shiva123',retResp.createdAt)
            const timestamp1 = Helper.date(new Date(retResp.createdAt))
            var timestamp =timestamp1;
            console.log('noti',heartbeat);

            //updateLastDataReceived(heartbeat.deviceID, heartbeat.lat, heartbeat.lng);
            //checkMinMax and Send notification  
            //const Noti = Notification.sendNotification(heartbeat)
            Notification.sendNotification(heartbeat);        
            //doEngineHoursCreateAndUpdate(heartbeat.extras.rpm, heartbeat.deviceID, heartbeat.pinno, timestamp,retResp,heartbeat.extras.distance);
            return next(retResp);
        };
    });
}





function createItem(newObj, next) {
    console.log('jhcvsdc',newObj.deviceModel,newObj.extras.rpm)
    const rpm = Helper.RPMitri(newObj.deviceModel,newObj.extras.rpm)
    newObj.extras.rpm = rpm;
	console.log('ATAttttttttttttt',rpm);
    if(newObj.extras.rpm==0){
        newObj.engineStatus='OFF';
    }else{
        newObj.engineStatus='ON';
    }
    const devicePublishTime = Helper.cuurrentdate(new Date(newObj.devicePublishTime))
    newObj.devicePublishTime= devicePublishTime;
    const fuel = Helper.fuellevel(newObj.extras.AI1,newObj.deviceModel)
    newObj.extras.AI1 = fuel.fuelLevel;
    newObj.extras.fuelLevel= fuel.fuelLevel;
    newObj.extras.fuelInLitres= fuel.fuelInLitres;

    var coolanttemp = Helper.coolanttemp(newObj.extras.AI2,newObj.deviceModel);
    if(newObj.extras.rpm==0){
        coolanttemp = 60;
        newObj.extras.coolantTemp= coolanttemp;
        newObj.extras.AI2=coolanttemp;
    }else{
        newObj.extras.AI2=coolanttemp
        newObj.extras.coolantTemp= coolanttemp
    }
    const oilpressure = Helper.oilpressure(newObj.extras.AI3,newObj.deviceModel);
    newObj.extras.AI3=oilpressure
    newObj.extras.oilpressure= oilpressure
    const DIdata = newObj.extras.DI.split('');
    newObj.extras.DI1=DIdata[0];
 
	newObj.extras.DI2=DIdata[1];
    const digitalinput1 = Helper.digitalinput1(newObj.extras.DI1);
    newObj.extras.parkingSwitch= digitalinput1;
    const digitalinput2 = Helper.digitalinput2(newObj.extras.DI2);
    newObj.extras.hydralicOilFilterChoke= digitalinput2;
    const Datetime = Helper.cuurrentdate(new Date())
    newObj.createdAt= Datetime;
    
        
    console.log('shiva',newObj)
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
                enginehours.companyID = 'AJAXFIORI';
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
                
                
            } else {
            	deltadistance={};
                deltadistance.pinno = retObj.pinno;
                deltadistance.deviceID = retObj.deviceID
                deltadistance.type="dvmap"
                db.items.findOne(deltadistance,{totalDistance:1,deviceID:1}, function(err, retDvmap) {
                    console.log("kkll",retDvmap.totalDistance)
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
                            console.log(itemobj.deviceID,totaldistance)
                            updateDistanceItem(itemobj.deviceID,totaldistance);
                        })     
	    }
        });
    }
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

module.exports.multipacket = multipacket;
module.exports.multibatch = multibatch;
