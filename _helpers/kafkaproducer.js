
const Kafka = require('kafka-node');

const Producer = Kafka.Producer;
const client = new Kafka.KafkaClient({kafkaHost: '172.16.16.52:9092'});
const producer = new Producer(client,  {requireAcks: 0, partitionerType: 2});

  const Helper = {

    pushDataToKafka(Raw) {
      var data ={Raw}
      console.log('kk',data)

  try {
  let payloadToKafkaTopic = [{topic: 'iotnodejs', messages: JSON.stringify(data) }];
  console.log(payloadToKafkaTopic)
  producer.on('ready', async function() {
	    console.log('aakk',payloadToKafkaTopic)
    producer.send(payloadToKafkaTopic, (err, data) => {

  });

  producer.on('error', function(err) {

  })
  })
  }
catch(error) {
  console.log(error);
}

}
}

module.exports= Helper;




  


