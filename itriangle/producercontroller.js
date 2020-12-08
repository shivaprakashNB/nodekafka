
const Kafka = require('kafka-node');

const Producer = Kafka.Producer;
const client = new Kafka.KafkaClient({kafkaHost: '172.16.16.52:9092'});
const producer = new Producer(client,  {requireAcks: 0, partitionerType: 2});



const pushDataToKafka =(dataToPush) => {

  try {
  let payloadToKafkaTopic = [{topic: 'iotnodejs', messages: JSON.stringify(dataToPush) }];
  //console.log(payloadToKafkaTopic);
  producer.on('ready', async function() {
    producer.send(payloadToKafkaTopic, (err, data) => {
    //      console.log('data: ', data);
  });

  producer.on('error', function(err) {
    //  handle error cases here
  })
  })
  }
catch(error) {
  console.log(error);
}

};




var r1 = "$Header,iTriangle1,UX101_4G_AIS140_2.1,NR,1,L,869170030100037,KA01G1234,1,26022019,124056,12.976635,N,77.549637,E,0.0,0,5,889.0,3.30,1.20,INDJIO,1,1,11.7,4.0,0,C,31,404,86,7b73,b74a,55,02a0,7d0b,49,4d0a,7d0b,49,1948,7b73,59,ffff,0000,100000,001,008273,6.9,106,0,()*3E"


var b = {"rawdata":r1}





pushDataToKafka(b);


