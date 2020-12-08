const kafka = require('kafka-node');
const mongo = require('mongodb').MongoClient;
const url = 'mongodb://172.16.16.30:27017'
var moment = require("moment")
var today = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
var devicemodel;
var DI;
var rdata
try {
 const Consumer = kafka.Consumer;
 const client = new kafka.KafkaClient({idleConnection: 24 * 60 * 60 * 1000,  kafkaHost: '172.16.16.52:9092'});

 let consumer = new Consumer(
    client,
    [{ topic: 'iotnodejs', partition: 0 }],
    {
      autoCommit: true,
      fetchMaxWaitMs: 1000,
      fetchMaxBytes: 1024 * 1024,
      encoding: 'utf8',
      // fromOffset: false
    }
  );
  consumer.on('message', async function (message) {

    //console.log(JSON.parse(message.value) );
	  Rawdata= JSON.parse(message.value);
	 r1data = Rawdata.rawdata;
	  console.log('rawdata',r1data);
	   rdata = r1data.split(',');



 devicemodel = {"deviceid":rdata[6], "date":rdata[9],"time":rdata[10],"lat":rdata[11],"long":rdata[13],"speed":rdata[15], "DI":rdata[45],"A1":rdata[48],"A2":rdata[49],"deltadistance(m)":rdata[50], "nodeTime":'today'};
	  console.log(devicemodel);
	  console.log(devicemodel.deviceid);
	   DI = devicemodel.DI.split(''); // empty string separator
			console.log('DI1',DI[0] );
	  fetchmodelname();	  
  })
  consumer.on('error', function(error) {
    //  handle error 
    console.log('error', error);
  });
}
catch(error) {
  // catch error trace
  console.log(error);
}


///database
var deviceModel;
async function fetchmodelname() {
mongo.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
  if (err) {
    console.error(err)
    return
  }


 const db = client.db('ATIOTdata_DB')

   const collection = db.collection('mst_data')

    collection.find({type:'machinemaster',deviceID:devicemodel.deviceid}).toArray((err, items) => {
  console.log(items)
	    console.log(items[0].deviceModel);
	    deviceModel=items[0].deviceModel
		logic();

	    
//res.json(items)
})
   });

}
async function insert() {
mongo.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
  if (err) {
    console.error(err)
    return
  }


 const db = client.db('ATIOTdata_DB')

   //const collection = db.collection('dataraw');


var raw= [{devicePublishTime: today,"companyID":"KIRLOSKAR","descriptionData":Rawdata.rawdata,"Data":Rawdata.rawdata,"createdAt":today,"updatedAt":today}];
var format=[{"customerID" : "KIRLOSKAR","companyID" : "KIRLOSKAR","deviceID" : devicemodel.deviceid,"devicePublishTime" : today,"timeZone" : "+05:30","rawData" : Rawdata.rawdata,"uploadInterval" : 10,"lat" : rdata[11],"lng" : rdata[13],"extras": {"travelspeed": "0.52","DI1" : DI[0],"fuelInLeters" : fuelInLeters,"fuelLevel" : fuelLevel,"coolantTemp" : coolantTemp},"createdAt" : today,"updatedAt" : today}]; 

	  console.log(raw);
	    db.collection("dataraw").insertMany(raw, function(err, res) {
        if (err) throw err;
        console.log(res.insertedCount+" raw documents inserted");
		  
        // close the connection to db when you are done with it
       // db.close();
    });
	  console.log(format);
 db.collection("datalive").insertMany(format, function(err, res) {
        if (err) throw err;
        console.log(res.insertedCount+" formatdocuments inserted");
                          // close the connection to db when you are done with it
       // db.close();
    });

    
   });




}



//// logic
var fuelInLeters;
var fuelLevel;
var coolantTemp;
async function logic() {

	if(deviceModel=='ARGO4000'){
	if(devicemodel.A1<='8.00448430493274' && devicemodel.A1>='7.4936247723133'){
  console.log('40');
		coolantTemp='40';
	}
else if(devicemodel.A1<='7.4936247723133' && devicemodel.A1>='6.70032573289902'){
  console.log('60');
	insert();
	coolantTemp='60';
}
else if(devicemodel.A1<='6.70032573289902' && devicemodel.A1>='5.6520618556701'){
  console.log('80');
	coolantTemp='80';
}
else if(devicemodel.A1<='5.6520618556701' && devicemodel.A1>='4.79194630872483'){
  console.log('100');
	coolantTemp='100';

}
else if(devicemodel.A1<='4.79194630872483' && devicemodel.A1>='4.4963768115942'){
  console.log('115');
	coolantTemp='115';

}
else if(devicemodel.A1<='4.4963768115942' && devicemodel.A1>='3.93388429752066'){
  console.log('120');
	coolantTemp='120';

}
else{
  console.log(130)
	coolantTemp='130';

}


if(devicemodel.A2<='331.7' && devicemodel.A2>='332.5'){
  console.log('Empty');
	fuelLevel='Empty';
	fuelInLeters='0';
	
}
else if(devicemodel.A2<='332.5' && devicemodel.A2>='334.5'){
  console.log('0');
	fuelLevel='Empty';
	fuelInLeters='0';
	
}

else if(devicemodel.A2<='334.5' && devicemodel.A2>='334.4'){
  console.log('3');
	 fuelLevel='Empty';
        fuelInLeters='3';
	
}
else if(devicemodel.A2<='334.4' && devicemodel.A2>='336.8'){
  console.log('6');
	 fuelLevel='Empty';
        fuelInLeters='6';
	
}
else if(devicemodel.A2<='336.8' && devicemodel.A2>='334.7'){
  console.log('9');
	 fuelLevel='Empty';
        fuelInLeters='9';
	
}
else if(devicemodel.A2<='334.7' && devicemodel.A2>='271.8'){
  console.log('12 Reserve');
	 fuelLevel='Reserve';
        fuelInLeters='12';
	
}
else if(devicemodel.A2<='271.8' && devicemodel.A2>='270'){
  console.log('15');
	fuelLevel='Reserve';
        fuelInLeters='15';
	
}
else if(devicemodel.A2<='270' && devicemodel.A2>='223'){
  console.log('18');
	fuelLevel='Reserve';
        fuelInLeters='18';
	
}
else if(devicemodel.A2<='223' && devicemodel.A2>='191'){
  console.log('21');
	fuelLevel='Reserve';
        fuelInLeters='21';
	
}
else if(devicemodel.A2<='191' && devicemodel.A2>='189'){
  console.log('21.5');
	fuelLevel='Reserve';
        fuelInLeters='21.5';
	
}
else if(devicemodel.A2<='189' && devicemodel.A2>='170'){
  console.log('24');
	fuelLevel='Reserve';
        fuelInLeters='24';
	
}
else if(devicemodel.A2<='170' && devicemodel.A2>='169.8'){
  console.log('25.5');
	fuelLevel='Reserve';
        fuelInLeters='25.5';
	
}
else if(devicemodel.A2<='169.8' && devicemodel.A2>='150'){
  console.log('27');
	fuelLevel='Reserve';
        fuelInLeters='27';
	
}
else if(devicemodel.A2<='150' && devicemodel.A2>='150'){
  console.log('28.75');
	fuelLevel='Reserve';
        fuelInLeters='28.75';
	
}
else if(devicemodel.A2<='150' && devicemodel.A2>='135'){
  console.log('30');
	fuelLevel='Reserve';
        fuelInLeters='30';
	
}
else if(devicemodel.A2<='135' && devicemodel.A2>='135'){
  console.log('32');
	fuelLevel='Reserve';
        fuelInLeters='32';
	
}
else if(devicemodel.A2<='135' && devicemodel.A2>='120'){
  console.log('33 Half');
	fuelLevel='Half';
        fuelInLeters='33';
	
	
}
else if(devicemodel.A2<='120' && devicemodel.A2>='120'){
  console.log('35.5');
	fuelLevel='Half';
        fuelInLeters='35.5';
	
}
else if(devicemodel.A2<='120' && devicemodel.A2>='105'){
  console.log('36');
	fuelLevel='Half';
        fuelInLeters='36';
	
}
else if(devicemodel.A2<='105' && devicemodel.A2>='105'){
  console.log('38.4');
	fuelLevel='Half';
        fuelInLeters='38.4';
	
}
else if(devicemodel.A2<='105' && devicemodel.A2>='90'){
  console.log('39');
	fuelLevel='Half';
        fuelInLeters='39';
	
}
else if(devicemodel.A2<='90' && devicemodel.A2>='90'){
  console.log('41.4');
	fuelLevel='Half';
        fuelInLeters='41.4';
	
}
else if(devicemodel.A2<='90' && devicemodel.A2>='75'){
  console.log('42');
	fuelLevel='Half';
        fuelInLeters='42';
	
}
else if(devicemodel.A2<='75' && devicemodel.A2>='75'){
  console.log('44.3');
	fuelLevel='Half';
        fuelInLeters='44.3';
	
}
else if(devicemodel.A2<='75' && devicemodel.A2>='65'){
  console.log('45');
	fuelLevel='Half';
        fuelInLeters='45';
	
}
else if(devicemodel.A2<='65' && devicemodel.A2>='64.8'){
  console.log('47');
	fuelLevel='Half';
        fuelInLeters='47';
	
}
else if(devicemodel.A2<='64.8' && devicemodel.A2>='64.8'){
  console.log('48');
	fuelLevel='Half';
        fuelInLeters='48';
	
}
else if(devicemodel.A2<='64.8' && devicemodel.A2>='44.8'){
  console.log('51 75% tank');
	fuelLevel='75%';
        fuelInLeters='51';
	
}

else if(devicemodel.A2<='44.8' && devicemodel.A2>='44.8'){
  console.log('52');
	fuelLevel='75%';
        fuelInLeters='52';
	
}
else if(devicemodel.A2<='44.8' && devicemodel.A2>='24.6'){
  console.log('54');
	 fuelLevel='75%';
        fuelInLeters='54';
	
}
else if(devicemodel.A2<='24.6' && devicemodel.A2>='24.6'){
  console.log('56.4');
	 fuelLevel='75%';
        fuelInLeters='56.4';
	
}
else if(devicemodel.A2<='24.6' && devicemodel.A2>='24.6'){
  console.log('57');
	 fuelLevel='75%';
        fuelInLeters='57';
	
}
else if(devicemodel.A2<='24.6' && devicemodel.A2>='4.6'){
  console.log('59.6');
	 fuelLevel='75%';
        fuelInLeters='59.6';
	
}
else if(devicemodel.A2<='4.6' && devicemodel.A2>='4.6'){
  console.log('60');
	 fuelLevel='75%';
        fuelInLeters='60';
	
}
else if(devicemodel.A2<='4.6' && devicemodel.A2>='4.6'){
  console.log('63');
         fuelLevel='Full';
        fuelInLeters='63';
	
}

else{
  console.log('full tank');
	 fuelLevel='Full';
        fuelInLeters='63';
	
}

if(DI[0]==='1'){
	console.log('NOT OK')
}
else{
	console.log('OK');
}

}

else{
	console.log('device model name wron');
}

}

