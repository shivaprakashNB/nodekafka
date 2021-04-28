const https = require("https");
const fetch = require('node-fetch');
const constants = require("./constantsajax");
const constantsAPOLLO = require("./constantsapollo");

const sendSms = (mobileNumber, message) => {
    return new Promise((resolve, reject) => {
        try {
            mobileNumber = '8861419692'; // TODO : Mobile number used for testing
            let smsServicePath = constants.SMS_SERVICE_PATH.replace(constants.PLACEHOLDER_MOBILENO, mobileNumber).replace(constants.PLACEHOLDER_MESSAGE, message);
            smsServicePath = encodeURI(smsServicePath);
            const options = {
                hostname: constants.SMS_SERVICE_HOST,
                port: 443,
                path: smsServicePath,
                method: 'GET'
            };
            const req = https.request(options, res => {
                console.log("Status : ", res.statusCode);              
                res.on('data', d => {
                    console.log("Response received from service : ", d);
                    resolve(d);
                })
            })
              
            req.on('error', error => {
                console.log("Error while invoking the service : ", error);
                reject(error);
            });
            
            req.end();
        } catch(error) {
            console.log("Error while sending the message : ", error);
            reject(error);
        }
    });
}

const sendSmsAPOLLO = (mobileNumber, message) => {
    return new Promise((resolve, reject) => {
        try {
            mobileNumber = '8861419692'; // TODO : Mobile number used for testing
            let smsServicePath = constantsAPOLLO.SMS_SERVICE_PATH.replace(constantsAPOLLO.PLACEHOLDER_MOBILENO, mobileNumber).replace(constantsAPOLLO.PLACEHOLDER_MESSAGE, message);
            smsServicePath = encodeURI(smsServicePath);
            const options = {
                hostname: constantsAPOLLO.SMS_SERVICE_HOST,
                port: 443,
                path: smsServicePath,
                method: 'GET'
            };
            const req = https.request(options, res => {
                console.log("Status : ", res.statusCode);              
                res.on('data', d => {
                    console.log("Response received from service : ", d);
                    resolve(d);
                })
            })
              
            req.on('error', error => {
                console.log("Error while invoking the service : ", error);
                reject(error);
            });
            
            req.end();
        } catch(error) {
            console.log("Error while sending the message : ", error);
            reject(error);
        }
    });
}

const sendVoice = (mobileNumber,message) => {
    console.log(mobileNumber,message)
    return new Promise((resolve, reject) => {
        try {
            mobileNumber = '8861419692';           // TODO : Mobile number used for testing
            const format = constantsAPOLLO.body;
            console.log(format)
            format.msisdnlist[0].phoneno = mobileNumber;
            format.msisdnlist[0].prompt = message;
            var data1= JSON.stringify(format);
            var data2 = JSON.parse(data1);
            console.log("format",format);
            fetch(constantsAPOLLO.URL, {
                method: 'post',
                body:    JSON.stringify(data2),
                headers: { 'Content-Type': 'application/json' },
            })
            .then(res => res.json())
            .then(json => console.log(json));
            
        } catch(error) {
            console.log("Error while sending the message : ", error);
            reject(error);
        }
    });
}

module.exports = {
    sendSms,
    sendVoice,
    sendSmsAPOLLO
}