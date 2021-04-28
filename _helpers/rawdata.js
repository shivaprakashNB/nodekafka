const Helper = require('./helper')
const db = require('./db')
const Raw = {
   async dataRaw(a) {
     const rawdata = JSON.parse(a);
     const Datetime = Helper.cuurrentdate(new Date())
     const data ={"Rawdata":rawdata.Raw,"createdAt":Datetime}
     const dev = new db.admin(data);
            dev.save();
   }
}

module.exports= Raw;
        
