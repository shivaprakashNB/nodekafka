const net = require('net');
const mongo = require('mongodb').MongoClient;
var moment = require("moment")
const port = 1882;
const host = '172.16.16.5';

const server = net.createServer();
server.listen(port, host, () => {
    console.log('TCP Server is running on port ' + port + '.');
});

let sockets = [];

server.on('connection', function(sock) {
//	console.log(sock);
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
	//sock.emit('request','01');
    sockets.push(sock);




    sock.on('data', function(data,callback) {
	    
        console.log('Data',sock.remoteAddress + ': ' + data);


	    var today = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
        console.log('DATA ' + sock.remoteAddress + ':' + data);
             var data1 = sock.remoteAddress +','+ data;

            var a = {"Address":  sock.remoteAddress ,  "Port" :   sock.remotePort,  "ClientData": data1, "Time":today};
            console.log(a)
//var responseData = { 'message':data, 'received':1};
  //          console.log('lllllllllllll',responseData);
    //    callback(responseData); //Send Acknowledgment to the client

        // Write the data back to all the connected, the client will receive it as data from the server
        sockets.forEach(function(sock, index, array) {
            sock.write(sock.remoteAddress + ':' + sock.remotePort + " said " + data + '\n');
	//	 console.log('Ping received with data: ' + data);
      //sock.emit(data);
     // callback(data);
		//
		 /* Message Received from Client*/
//    sockets.on('chat_messsage', function(data, callback){
 //       var responseData = { 'message':data, 'received':1};
   //         console.log('lllllllllllll',responseData);
     //   callback(responseData); //Send Acknowledgment to the client





		////////database

		const url = 'mongodb://172.16.16.30:27017';
mongo.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
  if (err) {
    console.error(err)
    return
  }
  const db = client.db('admin');
const collection = db.collection('POC2')

collection.insertMany([a], (err, result) => {


})

})
        });
    });
//});
	






	sock.on('message', function(data) {
		console.log('Ping received with data: ' + data);
});


	sock.on('connection', function(data){

    /* Message Received from Client*/
    sock.on('chat_messsage', function(data, callback){
        var responseData = { 'message':data.message, 'received':1};
	    console.log('llllllllllllllllllllll',responseData);
        callback(responseData); //Send Acknowledgment to the client
    });


});

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        let index = sockets.findIndex(function(o) {
            return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
        })
        if (index !== -1) sockets.splice(index, 1);
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });
});
