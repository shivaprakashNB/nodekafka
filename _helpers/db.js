const config = require('../config.json');
const mongoose = require('mongoose');
const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };

mongoose.connect(process.env.MONGODB_URI || config.conn_DB, connectionOptions || config.conndata_DB, connectionOptions || config.conn_admin, connectionOptions);
//mongoose.connect(config.conndata_DB, connectionOptions);
//mongoose.connect(process.env.MONGODB_URI || config.conndata_DB, connectionOptions);
mongoose.Promise = global.Promise;
mongoose.set("debug",true);

module.exports = {
    datalive: require('../Model/datalive.model'),
    mst_data: require('../Model/mst_data.model'),
    enginehours: require('../Model/enginehour.model'),
    items: require('../Model/item.model'),
    batchdata: require('../Model/batch.model'),
    admin:require('../Model/Rawdata.model'),
    datadeferred:require('../Model/datadeffered.model')
  
   

};
