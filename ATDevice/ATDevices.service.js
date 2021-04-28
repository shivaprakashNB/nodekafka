var moment = require("moment")
var db = require('../_helpers/db');
const Helper = require('../_helpers/helper');
const NotificationAJAX = require('../_helpers/Notification/notificationajax.service');
const NotificationAPOLLO = require('../_helpers/Notification/notificationapollo.service');
const Enginehour = require('../_helpers/Enginehour/enginehour.service');

async function multibatch(packet) {
    var i=1;
    var devicedata = packet;
    var convertjson = JSON.parse(devicedata);
    console.log(devicedata);
    var array = convertjson.Raw.split(',');
    console.log(array)
    if(array[1] != null){
    var raw = convertjson.Raw.split(array[1]); 
    var a = raw[1].split(',');
    for(i=1;i<raw.length;i++){
         var Raw = raw[i];
        splitbatch(Raw, function(err, retItems) {})
     }

   }else{
       console.log("packet false")
   }

    
    
}
async function splitbatch(Raw) {
    dataArr = Raw.split(',');
    enrichBatchformat2(dataArr, function(err, retItems) {})
    enrichBatchformat1(dataArr, function(err, retItems) {})
    
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
    var dataArr = convertjson.split(',');
   if(dataArr[1].replace(/\[|\]/g,'') != null){
        enrichItem(convertjson, function(err, retItems) {})

    }
    
        
}


function enrichItem(message, next) {
    var dataArray = message.split(',');
    if (dataArray.length != 55) {
         return next("Invalid data format")    
    }
    var deviceID = dataArray[6];
    dataArray[9] = dataArray[9] + dataArray[10];
    if (!(dataArray[9] && dataArray[9].length >= 14)) {
        console.log ("Invalid date format")
    }
    var dateString = dataArray[9].substring(0, 14);
    var companyID;
    var deviceModel;
    var timestamp =  moment(dateString + "UTC", "DDMMYYYYHHmmssZ");
    timestamp = new Date (timestamp)
    timestamp.setHours(timestamp.getHours() + 5);
    timestamp.setMinutes(timestamp.getMinutes() + 30);
    timestamp = timestamp.toISOString();
    var lat;
    var lng;
    if(dataArray[11] === '0.000000' && dataArray[13]==="0.000000"){
        lat = "";
        lng= "";

    }
    else if(dataArray[11] === undefined && dataArray[13]=== undefined){
        lat = "";
        lng= "";

    }
    else{
        lat = dataArray[11];
        lng = dataArray[13];
    }
    var obj = {
        "companyID": companyID,
        "deviceID": deviceID,
        "deviceModel":deviceModel,
        "Status" : dataArray[5], 
        "devicePublishTime": timestamp,
        "rawData": message,
        "lat": lat,
        "lng": lng,
        "timeZone" : "+05:30",
        
        
    };
   
    var dvquery = {};
   
    dvquery.deviceID = deviceID;
    db.mst_data.findOne({ deviceID:deviceID,type:"machinemaster" },function(err, retDvmap) {
        if (err) {
           return (err)
       };
        var vehicleNumber = null;
        if (retDvmap) {
            
        obj.pinno = retDvmap.pinno;
	    obj.deviceModel = retDvmap.deviceModel;
        obj.companyID = retDvmap.companyID;
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
        // console.log(obj)

        if(obj.companyID==="AJAXFIORI"){
            // AJAXprocessItems(obj, function(err, response) {
            //     if (err) {
            //         return (err);
            //     };
            //     return (response);
            // })
        }else if(obj.companyID==="APOLLO"){
            APOLLOprocessItems(obj, function(err, response) {
                if (err) {
                    return (err);
                };
                return (response);
            })
        }else if(obj.companyID==="VENUS"){
            // VENUSprocessItems(obj, function(err, response) {
            //     if (err) {
            //         return (err);
            //     };
            //     return (response);
            // })
        }  else{
            console.log("doo noth")
        }
   })
        return;

}

function AJAXprocessItems(heartbeat, next) {
    AJAXcreateItem(heartbeat, function(retResp,err) {
        if (err) {
            return next(err);
        }
	    
        if (retResp) {
            console.log(retResp.createdAt)
            const timestamp1 = Helper.date(new Date(retResp.devicePublishTime))
            var timestamp =timestamp1;
	       // updateLastDataReceived(heartbeat.deviceID, heartbeat.lat, heartbeat.lng);          
            NotificationAJAX.sendNotification(heartbeat); 
            //doEngineHoursCreateAndUpdate(heartbeat.extras.rpm, heartbeat.deviceID, heartbeat.pinno, timestamp,retResp,heartbeat.extras.distance,heartbeat.companyID);
            return next(retResp);
        };
	
    });
}
function APOLLOprocessItems(heartbeat, next) {
    // console.log("jjkkk")
    APOLLOcreateItem(heartbeat, function(retResp,err) {
        if (err) {
            return next(err);
        }
	    
        if (retResp) {
            // console.log(retResp.createdAt)
            //const timestamp1 = Helper.date(new Date(retResp.devicePublishTime))
            //var timestamp =timestamp1;
	        //updateLastDataReceived(heartbeat.deviceID, heartbeat.lat, heartbeat.lng);          
            NotificationAPOLLO.sendNotification(heartbeat); 
           // doEngineHoursCreateAndUpdate(heartbeat.extras.rpm, heartbeat.deviceID, heartbeat.pinno, timestamp,retResp,heartbeat.extras.distance,heartbeat.companyID);
            return next(retResp);
        };
	
    });
}

function VENUSprocessItems(heartbeat, next) {
    VENUScreateItem(heartbeat, function(retResp,err) {
        if (err) {
            return next(err);
        }
	    
        if (retResp) {
            console.log(retResp.createdAt)
            const timestamp1 = Helper.date(new Date(retResp.devicePublishTime))
            var timestamp =timestamp1;
	        updateLastDataReceived(heartbeat.deviceID, heartbeat.lat, heartbeat.lng);         
           // Notification.sendNotification(heartbeat); 
            doEngineHoursCreateAndUpdate(heartbeat.extras.rpm, heartbeat.deviceID, heartbeat.pinno, timestamp,retResp,heartbeat.extras.distance,heartbeat.companyID);
            return next(retResp);
        };
	
    });
}




function enrichBatchformat1(message, next){
    dataArray = message
    console.log(dataArray.length)
    if (dataArray.length != 13) {
        return next("Invalid data format")
    }

    var companyID;
    var deviceModel;
    var pinno;
    var deviceID = dataArray[1];


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
        var vehicleNumber = null;
        if (retDvmap && retDv ) {
            
           pinno = retDvmap.pinno;
           deviceModel = retDvmap.deviceModel;
           companyID = retDvmap.companyID

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
    newObj.devicePublishTime= Helper.cuurrentdate(convertedDate);
     
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
    dataArray = message
    console.log(dataArray.length)
    if (dataArray.length != 13) {
        return next("Invalid data format")
    }

    var companyID;
    var deviceModel;
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
        var vehicleNumber = null;
        if (retDvmap && retDv ) {
            
           pinno = retDvmap.pinno;
           deviceModel = retDvmap.deviceModel;
           companyID = retDvmap.companyID;
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
    newObj.cement01mm = parseFloat(HextoAscii.CEMT01);
    newObj.cement02mm = parseFloat(HextoAscii.CEMT02);
    newObj.sand01mm = parseFloat(HextoAscii.SAND01);
    newObj.sand02mm = parseFloat(HextoAscii.SAND02);
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


function VENUScreateItem(newObj, next) {
    console.log(newObj.deviceModel,newObj.extras.rpm)
    const rpm = Helper.RPMVENUS(newObj.deviceModel,newObj.extras.rpm)
    newObj.extras.rpm = rpm;
	console.log(rpm);
    if(newObj.extras.rpm==0){
        newObj.engineStatus='OFF';
    }else{
        newObj.engineStatus='ON';
    }
    const devicePublishTime = Helper.cuurrentdate(new Date(newObj.devicePublishTime))
    newObj.devicePublishTime= devicePublishTime;
    
    const fuel = Helper.VENUSfuellevel(newObj.extras.AI1,newObj.deviceModel)
    console.log('jkkk',fuel)
    newObj.extras.AI1 = fuel.fuelLevel;
    newObj.extras.fuelLevel= fuel.fuelLevel;
    newObj.extras.fuelInLitres= fuel.fuelInLitres;

    var coolanttemp = Helper.VENUScoolanttemp(newObj.extras.AI2,newObj.deviceModel);
    if(newObj.extras.rpm==0){
        coolanttemp = 60;
        newObj.extras.coolantTemp= coolanttemp;
        newObj.extras.AI2=coolanttemp;
    }else{
        newObj.extras.AI2=coolanttemp
        newObj.extras.coolantTemp= coolanttemp
    }
    const oilpressure = Helper.VENUSoilpressure(newObj.extras.AI3,newObj.deviceModel);
    newObj.extras.AI3=oilpressure
    newObj.extras.oilpressure= oilpressure
    const DIdata = newObj.extras.DI.split('');
    newObj.extras.DI1=DIdata[0];
 
	newObj.extras.DI2=DIdata[1];
    // const digitalinput1 = Helper.digitalinput1(newObj.extras.DI1);
    // newObj.extras.parkingSwitch= digitalinput1;
    const digitalinput2 = Helper.VENUSHFdigitalinput1(newObj.extras.DI1);
    newObj.extras.hydralicOilFilterChoke= digitalinput2;
    const Datetime = Helper.cuurrentdate(new Date())
    newObj.createdAt= Datetime;
	console.log("history",newObj.Status);
	var devicePublishTime1 = new Date(newObj.devicePublishTime);
    console.log("devicePublishTime",devicePublishTime1)
    devicePublishTime1 = devicePublishTime1.valueOf()
    console.log(devicePublishTime1);
    datetime = new Date();
    datetime.setHours(datetime.getHours() + 5);
    datetime.setMinutes(datetime.getMinutes() + 30);
    datetime.setMinutes(datetime.getMinutes() - 5);
    let olddata = datetime.valueOf();
    console.log("time1",olddata);

    if(newObj.Status==="H" && devicePublishTime1 <= olddata){
	    newObj.Status= "ATOLD";
        const dev = new db.datadeferred(newObj);
            dev.save(function (err,retResp){
                if (err) {
                    return next(err);
                }
               console.log("datadeffered",retResp)
               
            })
    }else if(newObj.Status==="L" || devicePublishTime1 >= olddata){
	    newObj.Status= "ATLIVE";
        const dev = new db.datalive(newObj);
            dev.save(function (err,retResp){
                if (err) {
                    return next(err);
                }
               
               console.log("datalive",retResp)
               return next(retResp);
               
               

            })

    }
    else{
        console.log("do nothing")
    }
    
            

}




function APOLLOcreateItem(newObj, next) {
    const rpm = Helper.RPMApollo(newObj.deviceModel,newObj.extras.rpm)
    newObj.extras.rpm = rpm;
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
    console.log("history",newObj.Status);
	var devicePublishTime1 = new Date(newObj.devicePublishTime);
    console.log("devicePublishTime",devicePublishTime1)
    devicePublishTime1 = devicePublishTime1.valueOf()
    console.log(devicePublishTime1);
    datetime = new Date();
    datetime.setHours(datetime.getHours() + 5);
    datetime.setMinutes(datetime.getMinutes() + 30);
    datetime.setMinutes(datetime.getMinutes() - 5);
    let olddata = datetime.valueOf();
    console.log("time1",olddata);

    if(newObj.Status==="H" && devicePublishTime1 <= olddata){
	    newObj.Status= "ATOLD";
        const dev = new db.datadeferred(newObj);
            dev.save(function (err,retResp){
                if (err) {
                    return next(err);
                }
               console.log("datadeffered",retResp)
               
            })
    }else if(newObj.Status==="L" || devicePublishTime1 >= olddata){
	    newObj.Status= "ATLIVE";
        const dev = new db.datalive(newObj);
            dev.save(function (err,retResp){
                if (err) {
                    return next(err);
                }
               
               console.log("datalive",retResp)
               return next(retResp);
               
               

            })

    }
    else{
        console.log("do nothing")
    }
    
    
}



function AJAXcreateItem(newObj, next) {
   // console.log(newObj.deviceModel,newObj.extras.rpm)
    const rpm = Helper.RPMitri(newObj.deviceModel,newObj.extras.rpm)
    newObj.extras.rpm = rpm;
	console.log(rpm);
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
	//console.log("history",newObj.Status);
	var devicePublishTime1 = new Date(newObj.devicePublishTime);
    //console.log("devicePublishTime",devicePublishTime1)
    devicePublishTime1 = devicePublishTime1.valueOf()
    console.log(devicePublishTime1);
    datetime = new Date();
    datetime.setHours(datetime.getHours() + 5);
    datetime.setMinutes(datetime.getMinutes() + 30);
    datetime.setMinutes(datetime.getMinutes() - 5);
    let olddata = datetime.valueOf();
    //console.log("time1",olddata);

    if(newObj.Status==="H" && devicePublishTime1 <= olddata){
	    newObj.Status= "ATOLD";
        const dev = new db.datadeferred(newObj);
            dev.save(function (err,retResp){
                if (err) {
                    return next(err);
                }
              // console.log("datadeffered",retResp)
               
            })
    }else if(newObj.Status==="L" || devicePublishTime1 >= olddata){
	    newObj.Status= "ATLIVE";
        const dev = new db.datalive(newObj);
            dev.save(function (err,retResp){
                if (err) {
                    return next(err);
                }
               
              // console.log("datalive",retResp)
               return next(retResp);
               
               

            })

    }
    else{
        console.log("do nothing")
    }
    
            

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

function doEngineHoursCreateAndUpdate(rpm, deviceID, pinno, timestamp,retResp,totalDistance,companyID) {
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

                db.datalive.findOne({"deviceID":retObj.deviceID,engineStatus:"ON",companyID:companyID}).sort({devicePublishTime:-1}).limit(1).exec(function(err, ret) {
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
                            console.log('items',retDvmap);
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
                enginehours.companyID = companyID;
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
                db.enginehours.findOne({"deviceID":retObj.deviceID,closed:"false",companyID:companyID}).sort({onTimestamp:-1}).limit(1).exec(function(err, ret) {
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
                db.items.findOne(deltadistance,{totalDistance:1,totalEngineHours:1,lastupdatedSecond:1,totalSeconds:1,deviceID:1,lastSumSecond:1}, function(err, retDvmap) {
                    var stringJson = JSON.stringify(retDvmap);
                    var Json = JSON.parse(stringJson);
			console.log("previous data",Json)
                    var itemobj ={}
                    itemobj.deviceID= retDvmap.deviceID;
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
                                totaldistance = parseFloat(Json.totalDistance) + parseFloat(totalDistance);
                                console.log(totaldistance)
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
                            
                        }) 
                    }
                });  
            });  
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


