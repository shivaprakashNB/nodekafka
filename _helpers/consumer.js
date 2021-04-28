
const kafka = require('kafka-node');
const raw  = require('../_helpers/rawdata')
const ARGO4500 = require('../Itriangledevice/AJAX/ARGO4500/ARGO4500.service');
const ARGO4000 = require('../Itriangledevice/AJAX/ARGO4000/ARGO4000.service');
const ARGO2500 = require('../Itriangledevice/AJAX/ARGO2500/ARGO2500.service');
//const A4TT = require('../Apollodevice/APOLLO/4TT/4TT.service');
const A25FX = require('../Apollodevice/APOLLO/25FX/25FX.service');
//const A45FX = require('../Apollodevice/APOLLO/45FX/45FX.service');
const AGROLUX = require('../VTS3device/SDF/AGROLUX/AGROLUX.service');
//const AGROMAXX = require('../VTS3device/SDF/ARGOMAXX/ARGOMAXX.service');
//const S3E = require('../VTS3device/SDF/3E/3E.service');
// const AGRO4500 = require('../VTS3device/SDF/AGRO4500/AT2014500.service');
//VTS3 AJAX
const VTS3ARGO = require('../VTS3device/AJAX/ARGO/ARGO.service');
const ATDevice = require('../ATDevice/ATDevices.service')


try {
 const Consumer = kafka.Consumer;
 const client = new kafka.KafkaClient({idleConnection: 24 * 60 * 60 * 1000,  kafkaHost: '172.16.16.52:9092'});

 let consumer = new Consumer(
    client,
    [{ topic: 'SCTEST', partition: 0 }],
    {
      autoCommit: true,
      fetchMaxWaitMs: 1000,
      fetchMaxBytes: 1024 * 1024,
      encoding: 'utf8',
      
    }
  );
  consumer.on('message', async function (message) {
   // raw.dataRaw(message.value);
    //ARGO4500.multibatch(message.value);
    
    //ARGO4500.multipacket(message.value);
    //ARGO4000.multibatch(message.value);
    // ARGO4000.multipacket(message.value);
    //ARGO2500.multipacket(message.value);
   // A4TT.multipacket(message.value);
   // A45FX.multipacket(message.value);
   //var data = {"Raw":"106.213.134.225,$Header,AT1022500,UX101_0232_STD_WIFI_3.11.117,NR,16,H,352913090213321,KA01G1234,1,23012021,064108,23.317671,N,72.432076,E,0.0,65.0,9,70.0,0.80,0.50,IND airtel,1,1,14.2,4.1,0,C,-57,404,98,8397,215378690,-59,65535,276,-72,65535,254,0,0,0,0,0,0,100001,100,029794,3.293694,4.068681,0.542056,0.000000,2.894888,(),170*61\r\n$Header,AT1022500,UX101_0232_STD_WIFI_3.11.117,NR,16,H,352913090213321,KA01G1234,1,23012021,064058,23.317675,N,72.432083,E,0.0,65.0,9,70.0,0.90,0.50,IND airtel,1,1,14.2,4.1,0,C,-66,404,98,8397,215378690,-71,65535,254,-56,65535,276,0,0,0,0,0,0,100001,100,029793,3.293694,4.068681,0.542056,0.000000,2.240533,(),190*63\r\n$Header,AT1022500,UX101_0232_STD_WIFI_3.11.117,NR,16,H,352913090213321,KA01G1234,1,23012021,064047,23.317671,N,72.432091,E,2.0,65.0,10,71.0,0.80,0.50,IND airtel,1,1,14.1,4.1,0,C,-66,404,98,8397,215378690,-71,65535,254,-56,65535,276,0,0,0,0,0,0,100001,100,029792,3.293694,4.068681,0.542056,0.000000,13.860478,(),270*69\r\n$Header,AT1022500,UX101_0232_STD_WIFI_3.11.117,NR,16,H,352913090213321,KA01G1234,1,23012021,064037,23.317715,N,72.432007,E,7.0,150.0,10,69.0,0.80,0.50,IND airtel,1,1,14.2,4.1,0,C,-57,404,98,8397,241912422,-47,65535,254,-57,65535,276,-57,65535,253,0,0,0,100001,100,029791,3.321372,4.124037,0.542056,0.000000,17.583735,(),320*45\r\n$Header,AT1022500,UX101_0232_STD_WIFI_3.11.117,NR,16,H,352913090213321,KA01G1234,1,23012021,064027,23.317842,N,72.431931,E,11.0,154.0,10,67.0,0.80,0.50,IND airtel,1,1,14.2,4.1,0,C,-57,404,98,8397,241912422,-58,65535,254,-70,65535,253,0,0,0,0,0,0,100001,100,029790,3.321372,4.207071,0.542056,0.000000,57.621548,(),320*6A\r\n$Header,AT1022500,UX101_0232_STD_WIFI_3.11.117,NR,16,H,352913090213321,KA01G1234,1,23012021,064017,23.318295,N,72.431709,E,20.0,145.0,10,67.0,0.80,0.50,IND airtel,1,1,14.1,4.1,0,C,-47,404,98,8397,241912422,-58,65535,254,-70,65535,253,0,0,0,0,0,0,100001,100,029789,3.321372,4.207071,0.542056,0.000000,54.113441,(),400*63\r\n$Header,AT1022500,UX101_0232_STD_WIFI_3.11.117,NR,16,H,352913090213321,KA01G1234,1,23012021,064006,23.318726,N,72.431458,E,19.0,151.0,10,69.0,0.80,0.50,IND airtel,1,1,14.2,4.1,0,C,-55,404,98,8397,241912422,-42,65535,254,-56,65535,253,0,0,0,0,0,0,100001,100,029788,3.349050,4.207071,0.542056,0.000000,52.349968,(),0*66\r\n"}
    //A25FX.multipacket(message.value);
    //AGROLUX.split(message.value);
    //AGROMAXX.split(message.value);
   // S3E.split(message.value);
  //  AGRO4500.split(message.value);

   //VTS3ARGO.split(message.value);
   ATDevice.multipacket(message.value);
   

    
  
  })
  consumer.on('error', function(error) {
    
    console.log('error', error);
  });
}
catch(error) {
  
  console.log(error);
}
