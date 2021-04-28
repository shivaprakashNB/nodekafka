const hex2ascii = require('hex2ascii');
var trim = require('trim-character');

const Helper = {
  fuellevel(level,deviceModel) {
    console.log('fsjs',level,deviceModel)
    var data;
if(deviceModel=='ARGO4000' || deviceModel==="ARGO2000"){
  
  if(level<='0.72'){
    console.log('Empty1');
    data = {"fuelLevel":'Empty',"fuelInLitres": 0}
    return data;
    
  }
    else if(level<='0.74' && level>='0.72'){
      console.log('Empty2');
      data = {"fuelLevel":'Empty',"fuelInLitres": 25}
      return data;
      
    }
    else if(level<='1.69' && level>='0.74'){
      console.log('Empty3');
      data = {"fuelLevel":'Empty',"fuelInLitres": 27}
      return data;  
    }
    else if(level<='2.21' && level>='1.69'){
      console.log('Empty4');
      data = {"fuelLevel":'Empty',"fuelInLitres": 29}
      return data;
      
    }
    else if(level<='2.65' && level>='2.21'){
      console.log('Empty5');
      data = {"fuelLevel":'Empty',"fuelInLitres": 31}
      return data;
      
    }
    else if(level<='3.71' && level>='2.65'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 35}
      return data;
      
    }
    else if(level<='3.93' && level>='3.71'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 40}
      return data;
      
    }
    else if(level<='4.3' && level>='3.93'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 45}
      return data;
      
    }
    else if(level<='4.72' && level>='4.3'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 50}
      return data;
      
    }
    else if(level<='4.93' && level>='4.72'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 55}
      return data;
      
    }
    else if(level<='5.15' && level>='4.93'){
      console.log('Half tank');
      data = {"fuelLevel":'Half tank',"fuelInLitres": 60}
      return data;
      
    }
    else if(level<='5.31' && level>='5.15'){
      console.log('Half tank');
      data = {"fuelLevel":'Half tank',"fuelInLitres": 65}
      return data;
      
    }
    else if(level<='5.41' && level>='5.31'){
      console.log('Half tank');
      data = {"fuelLevel":'Half tank',"fuelInLitres": 70}
      return data;
      
    }
    else if(level<='5.5' && level>='5.41'){
      console.log('Half tank');
      data = {"fuelLevel":'Half tank',"fuelInLitres": 75}
      return data;
      
    }
    else if(level<='5.61' && level>='5.5'){
      console.log('Half tank');
      data = {"fuelLevel":'Half tank',"fuelInLitres": 80}
      return data;
      
    }
    else if(level<='5.7' && level>='5.61'){
      console.log('Half tank');
      data = {"fuelLevel":'Half tank',"fuelInLitres": 85}
      return data;
      
    }
    else if(level<='5.75' && level>='5.7'){
      console.log('75%  tank');
      data = {"fuelLevel":'75%  tank',"fuelInLitres": 90}
      return data;
      
    }
    else if(level<='5.79' && level>='5.75'){
      console.log('75%  tank');
      data = {"fuelLevel":'75%  tank',"fuelInLitres": 95}
      return data;
      
      
    }
    else if(level<='5.8' && level>='5.79'){
      console.log('75%  tank');
      data = {"fuelLevel":'75%  tank',"fuelInLitres": 100}
      return data;
      
    }
    else if(level<='5.81' && level>='5.8'){
      console.log('75%  tank');
      data = {"fuelLevel":'Full tank',"fuelInLitres": 105}
      return data;
      
    }
    else if(level>='5.81'){
      console.log('Full Tank');
      data = {"fuelLevel":'Full Tank',"fuelInLitres": 105}
      return data;
      
    }
  }
    else if(deviceModel==="ARGO2500" || deviceModel==="ARGO4500"){
      console.log('lllllllllllllll')
      if(level>='2.48'){
        console.log('Empty');
        data = {"fuelLevel":'Empty',"fuelInLitres": 0}
        return data;
        
      }

      else if(level<='2.48' && level>='2.4'){
        console.log('Empty');
        data = {"fuelLevel":'Empty',"fuelInLitres": 0}
        return data;
        
      }
      else if(level<='2.4' && level>='2.08'){
        console.log('Reserve');
        data = {"fuelLevel":'Reserve',"fuelInLitres": 28}
        return data;
        
        
      }
  
      else if(level<='2.08' && level>='1.84'){
        console.log('Reserve');
        data = {"fuelLevel":'Reserve',"fuelInLitres": 30}
        return data;
        
      }
      else if(level<='1.84' && level>='1.68'){
        console.log('Reserve');
        data = {"fuelLevel":'Reserve',"fuelInLitres": 35}
        return data;
        
      }
      else if(level<='1.68' && level>='1.52'){
        console.log('Reserve');
        data = {"fuelLevel":'Reserve',"fuelInLitres": 37}
        return data;
        
      }
      else if(level<='1.52' && level>='1.52'){
        console.log('Half Tank');
        data = {"fuelLevel":'Half Tank',"fuelInLitres": 40}
        return data;
        
      }
      else if(level<='1.52' && level>='1.44'){
        console.log('Half Tank');
        data = {"fuelLevel":'Half Tank',"fuelInLitres": 42}
        return data;
        
      }
      else if(level<='1.44' && level>='1.2'){
        console.log('Half Tank');
        data = {"fuelLevel":'Half Tank',"fuelInLitres": 45}
        return data;
        
      }
      else if(level<='1.2' && level>='0.88'){
        console.log('Half Tank');
        data = {"fuelLevel":'Half Tank',"fuelInLitres": 50}
        return data;
        
      }
      else if(level<='0.88' && level>='0.8'){
        console.log('75% tank');
        data = {"fuelLevel":'75% tank',"fuelInLitres": 55}
        return data;
        
      }
      else if(level<='0.8' && level>='0.52'){
        console.log('75% tank');
        data = {"fuelLevel":'75% tank',"fuelInLitres": 60}
        return data;
        
      }
      else if(level<='0.52' && level>='0.26'){
        console.log('75% tank');
        data = {"fuelLevel":'75% tank',"fuelInLitres": 65}
        return data;
        
      }
      else if(level<='0.26' && level>='0.14'){
        console.log('75% tank');
        data = {"fuelLevel":'75% tank',"fuelInLitres": 70}
        return data;
        
      }
      else if(level<='0.14' && level>='0.1'){
        console.log('Full tank');
        data = {"fuelLevel":'Full tank',"fuelInLitres": 75}
        return data;
        
      }
      else if(level<='0.1' && level>='0.056' || level>='0.064'){
        console.log('Full tank');
        data = {"fuelLevel":'Full tank',"fuelInLitres": 77}
        return data;
        
      }
      else if(level>='0.056' || level>='0.064'){
        console.log('Full tank');
        data = {"fuelLevel":'Full tank',"fuelInLitres": 80}
        return data;
        
      }
      else{
        console.log('llllEmpty');
        data = {"fuelLevel":'Empty',"fuelInLitres": 0}
        return data;

      }
    }
   
},

  oilpressure(volt,deviceModel){
  if(deviceModel==='ARGO4000'  || deviceModel==="ARGO2000" ){
    if(volt<='0.2'){
      console.log('0');
      data = {"Pressurebar":0}
      return data.Pressurebar
      
    }
    else if(volt<='0.2' && volt>='0.2'){
      console.log('0');
      data = {"Pressurebar":0}
      return data.Pressurebar
      
    }
    else if(volt<='2.35' && volt>='0.2'){
      console.log('1');
      data = {"Pressurebar":1}
      return data.Pressurebar
    }
    else if(volt<='4.07' && volt>='2.35'){
      console.log('2');
      data = {"Pressurebar":2}
      return data.Pressurebar
    }
    else if(volt<='5' && volt>='4.07'){
      console.log('3');
      data = {"Pressurebar":3}
      return data.Pressurebar
    }
    else if(volt<='5.43' && volt>='5'){
      console.log('4');
      data = {"Pressurebar":4}
      return data.Pressurebar
    }
    else if(volt<='5.93' && volt>='5.43'){
      console.log('5');
      data = {"Pressurebar":5}
      return data.Pressurebar
    }
    else if(volt<='6.33' && volt>='5.93'){
      console.log('6');
      data = {"Pressurebar":6}
      return data.Pressurebar
    }
    else if(volt<='6.52' && volt>='6.33'){
      console.log('7');
      data = {"Pressurebar":7}
      return data.Pressurebar
    }
    else if(volt<='6.72' && volt>='6.52'){
      console.log('8');
      data = {"Pressurebar":8}
      return data.Pressurebar
    }
    else if(volt<='6.98' && volt>='6.72'){
      console.log('9');
      data = {"Pressurebar":9}
      return data.Pressurebar
    }
    else if(volt<='7.2' && volt>='6.98'){
      console.log('10');
      data = {"Pressurebar":10}
      return data.Pressurebar
    }
    else if(volt>='7.2'){
      console.log('10');
      data = {"Pressurebar":10}
      return data.Pressurebar
    }

    
  }
  else if(deviceModel==="ARGO2500" || deviceModel==="ARGO4500"){
    if(volt<='1.8' ){
      console.log('0');
      data = {"Pressurebar":0}
      return data.Pressurebar
      
    }
    else if(volt<='1.8' && volt>='1.8'){
      console.log('1');
      data = {"Pressurebar":1}
      return data.Pressurebar
      
    }
    else if(volt<='2.36' && volt>='1.8'){
      console.log('2');
      data = {"Pressurebar":1}
      return data.Pressurebar
    }
    else if(volt<='2.72' && volt>='2.36'){
      console.log('3');
      data = {"Pressurebar":3}
      return data.Pressurebar
    }
    else if(volt<='3.08' && volt>='2.72'){
      console.log('4');
      data = {"Pressurebar":4}
      return data.Pressurebar
    }
    else if(volt<='3.3' && volt>='3.08'){
      console.log('5');
      data = {"Pressurebar":5}
      return data.Pressurebar
    }
    else if(volt<='3.52' && volt>='3.3'){
      console.log('6');
      data = {"Pressurebar":6}
      return data.Pressurebar
    }
    else if(volt>='3.52'){
      console.log('6');
      data = {"Pressurebar":6}
      return data.Pressurebar
    }

  }
  },

  coolanttemp(volt,deviceModel){
    console.log('mmm',volt,deviceModel)
    if(deviceModel==='ARGO4000'  || deviceModel==="ARGO2000"){
      if(volt>='5.48'){
        console.log('40');
        data = {"Temp":40}
        return data.Temp
        
      }
      else if(volt<='5.48' && volt>='5.20'){
        console.log('50');
        data = {"Temp":50}
        return data.Temp
        
      }
      else if(volt<='5.20' && volt>='4.86'){
        console.log('60');
        data = {"Temp":60}
        return data.Temp
      }
      else if(volt<='4.86' && volt>='4.46'){
        console.log('70');
        data = {"Temp":70}
        return data.Temp
      }
      else if(volt<='4.46' && volt>='4.01'){
        console.log('80');
        data = {"Temp":80}
        return data.Temp
      }
      else if(volt<='4.01' && volt>='3.54'){
        console.log('90');
        data = {"Temp":90}
        return data.Temp
      }
      else if(volt<='3.54' && volt>='3.08'){
        console.log('100');
        data = {"Temp":100}
        return data.Temp
      }
      else if(volt<='3.08' && volt>='2.63'){
        console.log('110');
        data = {"Temp":110}
        return data.Temp
      }
      else if(volt<='2.63' && volt>='2.22'){
        console.log('120');
        data = {"Temp":120}
        return data.Temp
      }
      else if(volt<='2.22' && volt>='1.83'){
        console.log('130');
        data = {"Temp":130}
        return data.Temp
      }
      else if(volt<='1.83'){
        console.log('130');
        data = {"Temp":130}
        return data.Temp
      }
      
    }  
    else if(deviceModel==='ARGO4500'  || deviceModel==="ARGO2500"){
      if(volt>='3.93'){
        console.log('50');
        data = {"Temp":50}
        return data.Temp
        
      }
      else if(volt<='3.93' && volt>='3.29'){
        console.log('60');
        data = {"Temp":60}
        return data.Temp
        
      }
      else if(volt<='3.29' && volt>='2.58'){
        console.log('70');
        data = {"Temp":70}
        return data.Temp
      }
      else if(volt<='2.58' && volt>='2.12'){
        console.log('80');
        data = {"Temp":80}
        return data.Temp
      }
      else if(volt<='2.12' && volt>='1.70'){
        console.log('90');
        data = {"Temp":90}
        return data.Temp
      }
      else if(volt<='1.70' && volt>='1.30'){
        console.log('100');
        data = {"Temp":100}
        return data.Temp
      }
      else if(volt<='1.30' && volt>='1.10'){
        console.log('110');
        data = {"Temp":110}
        return data.Temp
      }
      else if(volt<='1.10' && volt>='0.91'){
        console.log('120');
        data = {"Temp":120}
        return data.Temp
      }
      else if(volt<='0.91'){
        console.log('120');
        data = {"Temp":120}
        return data.Temp
      }

    }
  },

  
  RPM(deviceModel,rpm){
    
console.log('shiva',deviceModel,rpm)
if(deviceModel=="ARGO4000"){
  var RPM = rpm / (1.91*10);
  return RPM
  //console.log(RPM)
}
else if(deviceModel=="ARGO2500"){
  var RPM = rpm / (2.53*10);
  return RPM

}
else if(deviceModel=="ARGO2000"){
  var RPM = rpm / (2.02*10);
  return RPM

}
else if(deviceModel=="ARGO4500"){
  var RPM = rpm / (1.91*10);
  return RPM
}
else if(deviceModel=="AGROLUX"){
  var RPM = rpm / (1.91*10);
  return RPM
}
  },
  RPMitri(deviceModel,rpm){
    console.log(deviceModel,rpm)
    var dataArray = rpm.split('*');
    if(deviceModel=="ARGO4000"){
      var RPM = dataArray[0] * 5.235;
      if(RPM>=2500){
        RPM=2500;
        return RPM
      }
      else{
        return RPM
      }
    }
    else if(deviceModel=="ARGO2000"){
      var RPM = dataArray[0] * 4.950;
      if(RPM>=2500){
        RPM=2500;
        return RPM
      }
      else{
        return RPM
      }
    
    }
    else if(deviceModel=="ARGO2500"){
      var RPM = dataArray[0] * 4.950;
      if(RPM>=2500){
        RPM=2500;
        return RPM
      }
      else{
        return RPM
      }
    
    }
    else if(deviceModel=="ARGO4500"){
      var RPM = dataArray[0] * 4.950;
      if(RPM>=2500){
        RPM=2500;
        return RPM
      }
      else{
        return RPM
      }
      
    
    }
  },
  digitalinput1(DI1){
    if(DI1=='1'){
      return DI1='APPLIED';
  }else if(DI1=='0'){
      return DI1 ='RELEASE';
  }
},
  digitalinput2(DI2){
  if(DI2=='1'){
      return DI2='CHOKE';
  }else if(DI2=='0'){
      return DI2 ='NORMAL';
  }
  },
  cuurrentdate(datetime){

    console.log('shibaaa',datetime)
    datetime.setHours(datetime.getHours() + 5);
    datetime.setMinutes(datetime.getMinutes() + 30);
    var isodate = datetime.toISOString();
    console.log(isodate)
    return isodate

  },
  date(datetime){

    console.log('shibaaa',datetime)
    datetime.setHours(datetime.getHours());
    datetime.setMinutes(datetime.getMinutes());
    var isodate = datetime.toISOString();
    console.log(isodate)
    return isodate
  },

 

  batchhextoascii2(data){
    var hextoascii = hex2ascii(data);
    console.log(hextoascii)
    var formathextoascii = hextoascii.split(':')
    console.log('hh',formathextoascii)
    HtoAObject = {};
  
    HtoAObject.batchno = parseFloat(formathextoascii[1]);
    HtoAObject.MACHID = parseFloat(formathextoascii[2]);
    
    var TIME1 = formathextoascii[3];
    var TIME2 = formathextoascii[4].split('\n DATE');
    var TIME = TIME1 + ':' + TIME2[0]
    HtoAObject.Time = TIME;
    console.log(HtoAObject)
    var DATE = trim(formathextoascii[5],'AGGT10mm');
    console.log(DATE)
    
    var DT = DATE.trim().split('-');
    var day= Number(DT[0]) + 1;
    var month = DT[1];
    var year = DT[2];
    var dateFormate = new Date(month +'/'+ day +'/'+ year);
    dateFormate.setHours(dateFormate.getHours() - 18);
    dateFormate.setMinutes(dateFormate.getMinutes() - 30);
    dateFormate = dateFormate.toISOString();
    console.log('date',dateFormate)
    if(dateFormate=="Invalid Date"){
      return "undefinded";
  
    }else{
    var bDT = dateFormate;
    HtoAObject.Date = bDT;
    
    HtoAObject.AGGT10mm = parseFloat(trim(formathextoascii[6],'AGGT20mm'));
    
    HtoAObject.AGGT20mm = parseFloat(trim(formathextoascii[7],'AGGT30mm'));
    HtoAObject.AGGT30mm = parseFloat(trim(formathextoascii[8],'SAND01mm'));
    HtoAObject.SAND01 = parseFloat(trim(formathextoascii[9],'SAND02mm'));
    HtoAObject.SAND02 = parseFloat(trim(formathextoascii[10],'CEMT03'));
    HtoAObject.CEMT01 = parseFloat(trim(formathextoascii[11],'CEMT04'));
    HtoAObject.CEMT02 = parseFloat(trim(formathextoascii[12],'WATER'));
   HtoAObject.WATER = parseFloat(trim(formathextoascii[13],'ADDITIVE'));
    HtoAObject.ADDITIVE = parseFloat(trim(formathextoascii[14],'TOTALWT'));
    HtoAObject.TOTALWT = parseFloat(trim(formathextoascii[15],'CuM'));
    HtoAObject.CuM = parseFloat(trim(formathextoascii[16],''));
    console.log('hjhhj',HtoAObject);
    return HtoAObject;
    }

  },


  batchhextoascii(data){
    var hextoascii = hex2ascii(data);
    console.log(hextoascii)
    var formathextoascii = hextoascii.split('\n')
    HtoAObject = {};
  
    
    HtoAObject.batchreport = formathextoascii[0];
    if(formathextoascii[5]==undefined){
      return "undefinded";

    }else{
      console.log('kk')
    var customer = formathextoascii[5].replace(/\[|\]/g,'').split(':');
    HtoAObject.Customer = customer[1];
    var location = formathextoascii[6].replace(/\[|\]/g,'').split(':');
    HtoAObject.Location = location[1];
    var batchno = formathextoascii[8].replace(/\[|\]/g,'').split(':');
    HtoAObject.BatchNo = batchno[1];
    var MACHID = formathextoascii[9].replace(/\[|\]/g,'').split(':');
    HtoAObject.MACHID = MACHID[1];
    var TIME = formathextoascii[10].replace(/\[|\]/g,'').split('TIME   :');
    HtoAObject.Time = TIME[1];
    var DATE = formathextoascii[11].replace(/\[|\]/g,'').split(':');
    var DT = DATE[1].trim().split('-');
    var day= Number(DT[0]) + 1;
    var month = DT[1];
    var year = DT[2];
    
    var bDT = new Date(month +'/'+ day +'/'+ year);
    HtoAObject.Date = bDT.toISOString();
    var STRTIME = formathextoascii[12].replace(/\[|\]/g,'').split('TIME   :');
    HtoAObject.STRTime = STRTIME[1];
    var AGGT01mm = formathextoascii[14].replace(/\[|\]/g,'').split('|');
    HtoAObject.AGGT01mm = AGGT01mm[1];
    var AGGT02mm = formathextoascii[15].replace(/\[|\]/g,'').split('|');
    HtoAObject.AGGT02mm = AGGT02mm[1];
    var AGGT03mm = formathextoascii[16].replace(/\[|\]/g,'').split('|');
    HtoAObject.AGGT03mm = AGGT03mm[1];
    var CEMT01 = formathextoascii[17].replace(/\[|\]/g,'').split('|');
    HtoAObject.CEMT01 = CEMT01[1];
    var CEMT02 = formathextoascii[18].replace(/\[|\]/g,'').split('|');
    HtoAObject.CEMT02 = CEMT02[1];
    var SAND01 = formathextoascii[19].replace(/\[|\]/g,'').split('|');
    HtoAObject.SAND01 = SAND01[1];
    var SAND02 = formathextoascii[20].replace(/\[|\]/g,'').split('|');
    HtoAObject.SAND02 = SAND02[1];
    var WATER = formathextoascii[21].replace(/\[|\]/g,'').split('|');
    HtoAObject.WATER = WATER[1];
    var ADTV1 = formathextoascii[22].replace(/\[|\]/g,'').split('|');
    HtoAObject.ADTV1 = ADTV1[1];
    var ADTV2 = formathextoascii[23].replace(/\[|\]/g,'').split('|');
    HtoAObject.ADTV2 = ADTV2[1];
    var TOTALWT = formathextoascii[24].replace(/\[|\]/g,'').split(':');
    HtoAObject.TOTALWT = TOTALWT[1];
    var CuM = formathextoascii[25].replace(/\[|\]/g,'').split(':');
    HtoAObject.CuM = CuM[1];
    var ENDTIME = formathextoascii[26].replace(/\[|\]/g,'').split('END TIME   :');
    HtoAObject.ENDTIME = ENDTIME[1];
    return HtoAObject;
    }

  },

  SDFfuellevel(level,deviceModel,engineStatus) {
    console.log('fsjs',level,deviceModel,engineStatus)
    var data;
if(deviceModel==="AGROLUX" && engineStatus =="OFF"){
  if(level>='6.0700'){
    console.log('Empty');
    data = {"fuelLevel":'Empty',"fuelInLitres": 0}
    return data;
    
  }
   else if(level<='6.0845' && level>='6.0700'){
      console.log('Empty');
      data = {"fuelLevel":'Empty',"fuelInLitres": 0}
      return data;
      
    }
    else if(level<='6.0785' && level>='4.9403'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 12}
      return data;
      
    }
    else if(level<='6.0785' && level>='5.8671'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 15}
      return data;
      
    }
    else if(level<='5.8671' && level>='5.8598'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 18}
      return data;
      
    }
    else if(level<='5.8598' && level>='5.6386'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 21}
      return data;
      
    }
    else if(level<='5.6386' && level>='5.4409'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 21.5}
      return data;
      
    }
    else if(level<='5.4409' && level>='5.4269'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 24}
      return data;
      
    }
    else if(level<='5.4269' && level>='5.2816'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 25.5}
      return data;
      
    }
    else if(level<='5.2816' && level>='5.2799'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 27}
      return data;
      
    }
    else if(level<='5.2799' && level>='5.1004'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 28.75}
      return data;
      
    }
    else if(level<='5.1004' && level>='5.1004'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 30}
      return data;
      
    }
    else if(level<='5.1004' && level>='4.9403'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 32}
      return data;
      
    }
    else if(level<='4.9403' && level>='4.7538'){
      console.log('Half tank');
      data = {"fuelLevel":'Half tank',"fuelInLitres": 35.5}
      return data;
      
    }
    else if(level<='4.7538' && level>='4.7538'){
      console.log('Half tank');
      data = {"fuelLevel":'Half tank',"fuelInLitres": 36}
      return data;
      
    }
    else if(level<='4.7538' && level>='4.5337'){
      console.log('Half tank');
      data = {"fuelLevel":'Half tank',"fuelInLitres": 38.4}
      return data;
      
    }
    else if(level<='4.5337' && level>='4.5337'){
      console.log('Half tank');
      data = {"fuelLevel":'Half tank',"fuelInLitres": 39}
      return data;
      
    }
    else if(level<='4.5337' && level>='4.2702'){
      console.log('Half tank');
      data = {"fuelLevel":'Half tank',"fuelInLitres": 41.4}
      return data;
      
    }
    else if(level<='4.2702' && level>='4.2702'){
      console.log('Half tank');
      data = {"fuelLevel":'Half tank',"fuelInLitres": 42}
      return data;
      
    }
    else if(level<='4.2702' && level>='3.9488'){
      console.log('Half tank');
      data = {"fuelLevel":'Half tank',"fuelInLitres": 44.3}
      return data;
      
    }
    else if(level<='3.9488' && level>='3.9488'){
      console.log('Half tank');
      data = {"fuelLevel":'Half tank',"fuelInLitres": 45}
      return data;
      
    }
    else if(level<='3.9488' && level>='3.6923'){
      console.log('Half tank');
      data = {"fuelLevel":'Half tank',"fuelInLitres": 47}
      return data;
      
    }
    else if(level<='3.6923' && level>='3.6868'){
      console.log('Half tank');
      data = {"fuelLevel":'Half tank',"fuelInLitres": 48}
      return data;
      
    }
    else if(level<='3.6868' && level>='3.0273'){
      console.log('75%  tank');
      data = {"fuelLevel":'75%  tank',"fuelInLitres": 52}
      return data;
      
    }
    else if(level<='3.0273' && level>='3.0273'){
      console.log('75%  tank');
      data = {"fuelLevel":'75%  tank',"fuelInLitres": 54}
      return data;
      
    }
    else if(level<='3.0273' && level>='2.0512'){
      console.log('75%  tank');
      data = {"fuelLevel":'75%  tank',"fuelInLitres": 56.4}
      return data;
      
    }
    else if(level<='2.0512' && level>='2.0512'){
      console.log('75%  tank');
      data = {"fuelLevel":'75%  tank',"fuelInLitres": 57}
      return data;
      
    }
    else if(level<='2.0512' && level>='2.0512'){
      console.log('75%  tank');
      data = {"fuelLevel":'75%  tank',"fuelInLitres": 59.5}
      return data;  
    }
    else if(level<='2.0512' && level>='0.4992'){
      console.log('75%  tank');
      data = {"fuelLevel":'75%  tank',"fuelInLitres": 60}
      return data;  
    }
    else if(level<='0.4992'){
      console.log('Full Tank');
      data = {"fuelLevel":'Full Tank',"fuelInLitres": 63}
      return data;
      
    }
    else if (level==0){
      data = {"fuelLevel":'Empty',"fuelInLitres": 0}
      return data;

    }
  }
  
else if(deviceModel==="AGROLUX"   && engineStatus =="ON"){
  if(level>='6.8201'){
    console.log('Empty');
    data = {"fuelLevel":'Empty',"fuelInLitres": 0}
    return data;
    
  }
    else if(level<='6.8364' && level>='6.8201'){
      console.log('Empty');
      data = {"fuelLevel":'Empty',"fuelInLitres": 0}
      return data;
      
    }
    else if(level<='6.8364' && level>='6.8298'){
      console.log('Empty');
      data = {"fuelLevel":'Empty',"fuelInLitres": 12}
      return data;
      
    }
    else if(level<='6.8298' && level>='6.5906'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 15}
      return data;
      
    }
    else if(level<='6.5906' && level>='6.5824'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 18}
      return data; 
    }
    else if(level<='6.5824' && level>='6.3325'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 21}
      return data;
      
    }
    else if(level<='6.3325' && level>='6.1090'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 21.5}
      return data;
      
    }
    else if(level<='6.1090' && level>='6.0931'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 24}
      return data;
      
    }
    else if(level<='6.0931' && level>='5.9290'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 25.5}
      return data;
      
    }
    else if(level<='5.9290' && level>='5.9271'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 27}
      return data;
      
    }
    else if(level<='5.9271' && level>='5.7244'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 28.75}
      return data;
      
    }
    else if(level<='5.7244' && level>='5.7244'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 30}
      return data;
      
    }
    else if(level<='5.7244' && level>='5.5437'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 32}
      return data;
      
    }
    else if(level<='5.5437' && level>='5.5437'){
      console.log('Reserve');
      data = {"fuelLevel":'Reserve',"fuelInLitres": 33}
      return data;
      
    }
    else if(level<='5.5437' && level>='5.3333'){
      console.log('Half tank');
      data = {"fuelLevel":'Half tank',"fuelInLitres": 35.5}
      return data;
      
    }
    else if(level<='5.3333' && level>='5.3333'){
      console.log('Half tank');
      data = {"fuelLevel":'Half tank',"fuelInLitres": 36}
      return data;
      
    }
    else if(level<='5.3333' && level>='5.0852'){
      console.log('Half tank');
      data = {"fuelLevel":'Half tank',"fuelInLitres": 38.4}
      return data;
      
    }
    else if(level<='5.0852' && level>='5.0852'){
      console.log('Half tank');
      data = {"fuelLevel":'Half tank',"fuelInLitres": 39}
      return data;
      
    }
    else if(level<='5.0852' && level>='4.7882'){
      console.log('Half tank');
      data = {"fuelLevel":'Half tank',"fuelInLitres": 41.4}
      return data;
      
    }
    else if(level<='4.7882' && level>='4.7882'){
      console.log('Half tank');
      data = {"fuelLevel":'Half tank',"fuelInLitres": 42}
      return data;
      
    }
    else if(level<='4.7882' && level>='4.4262'){
      console.log('Half tank');
      data = {"fuelLevel":'Half tank',"fuelInLitres": 44.3}
      return data;
      
    }
    else if(level<='4.4262' && level>='4.1375'){
      console.log('Half tank');
      data = {"fuelLevel":'Half tank',"fuelInLitres": 47}
      return data;
      
    }
    else if(level<='4.1375' && level>='4.1313'){
      console.log('Half tank');
      data = {"fuelLevel":'Half tank',"fuelInLitres": 48}
      return data;
      
    }
    
    else if(level<='4.1313' && level>='4.1313'){
      console.log('75%  tank');
      data = {"fuelLevel":'75%  tank',"fuelInLitres": 51}
      return data;
      
    }
    else if(level<='4.1313' && level>='3.3898'){
      console.log('75%  tank');
      data = {"fuelLevel":'75%  tank',"fuelInLitres": 52}
      return data;
      
    }
    else if(level<='3.3898' && level>='3.3898'){
      console.log('75%  tank');
      data = {"fuelLevel":'75%  tank',"fuelInLitres": 54}
      return data;
      
    }
    else if(level<='3.3898' && level>='2.2943'){
      console.log('75%  tank');
      data = {"fuelLevel":'75%  tank',"fuelInLitres": 56.4}
      return data;
      
    }
    else if(level<='2.2943' && level>='2.2943'){
      console.log('75%  tank');
      data = {"fuelLevel":'75%  tank',"fuelInLitres": 57}
      return data;
      
    }
    else if(level<='2.2943' && level>='2.2943'){
      console.log('75%  tank');
      data = {"fuelLevel":'75%  tank',"fuelInLitres": 59.5}
      return data;
      
    }
    else if(level<='2.2943' && level>='0.5574'){
      console.log('75%  tank');
      data = {"fuelLevel":'75%  tank',"fuelInLitres": 60}
      return data;
      
    }
    else if(level<='0.5574'){
      console.log('Full Tank');
      data = {"fuelLevel":'Full Tank',"fuelInLitres": 60}
      return data;
      
    }
    else{
      data = {"fuelLevel":'Empty',"fuelInLitres": 0}
      return data;

    }
  }

  else if(deviceModel==="AGROMAXX" && engineStatus =="OFF"){
    if(level>='5.3347'){
      console.log('Empty');
      data = {"fuelLevel":'Empty',"fuelInLitres": 0}
      return data;
      
    }
      if(level<='5.3347' && level>='4.5783'){
        console.log('Empty');
        data = {"fuelLevel":'Empty',"fuelInLitres": 0}
        return data;
        
      }
      else if(level<='4.5783' && level>='4.1233'){
        console.log('Reserve');
        data = {"fuelLevel":'Reserve',"fuelInLitres": 0}
        return data;
        
      }
      else if(level<='4.1233' && level>='2.8559'){
        console.log('Half tank');
        data = {"fuelLevel":'Half tank',"fuelInLitres": 0}
        return data;
        
      }
      else if(level<='2.8559' && level>='0.4995'){
        console.log('75%  tank');
        data = {"fuelLevel":'75%  tank',"fuelInLitres": 0}
        return data;
        
      }
      else if(level<='0.4995'){
        console.log('Full Tank');
        data = {"fuelLevel":'Full Tank',"fuelInLitres": 0}
        return data;
        
      }
    }
    
  else if(deviceModel==="AGROMAXX" && engineStatus =="ON"){
    if(level>='5.998'){
      console.log('Empty');
      data = {"fuelLevel":'Empty',"fuelInLitres": 0}
      return data;
      
    }
      else if(level<='5.998' && level>='5.1335'){
        console.log('Empty');
        data = {"fuelLevel":'Empty',"fuelInLitres": 0}
        return data;
        
      }
      else if(level<='5.1335' && level>='4.6154'){
        console.log('Reserve');
        data = {"fuelLevel":'Reserve',"fuelInLitres": 0}
        return data;
        
      }
      else if(level<='4.6154' && level>='3.1816'){
        console.log('Half tank');
        data = {"fuelLevel":'Half tank',"fuelInLitres": 0}
        return data;
        
      }
      else if(level<='3.1816' && level>='0.5516'){
        console.log('75%  tank');
        data = {"fuelLevel":'75%  tank',"fuelInLitres": 0}
        return data;
        
      }
      else if(level<='0.5516'){
        console.log('Full Tank');
        data = {"fuelLevel":'Full Tank',"fuelInLitres": 0}
        return data;
        
      }
    }
    else if(deviceModel==="3E" && engineStatus =="OFF"){
      if(level>='6.0698'){
        console.log('Empty');
        data = {"fuelLevel":'Empty',"fuelInLitres": 0}
        return data;
        
      }
        if(level<='6.0698' && level>='5.2890'){
          console.log('Empty');
          data = {"fuelLevel":'Empty',"fuelInLitres": 0}
          return data;
          
        }
        else if(level<='5.2890' && level>='4.5539'){
          console.log('Reserve');
          data = {"fuelLevel":'Reserve',"fuelInLitres": 0}
          return data;
          
        }
        else if(level<='4.5539' && level>='3.7104'){
          console.log('Half tank');
          data = {"fuelLevel":'Half tank',"fuelInLitres": 0}
          return data;
          
        }
        else if(level<='3.7104' && level>='0.5052'){
          console.log('75%  tank');
          data = {"fuelLevel":'75%  tank',"fuelInLitres": 0}
          return data;
          
        }
        else if(level<='0.5052'){
          console.log('Full Tank');
          data = {"fuelLevel":'Full Tank',"fuelInLitres": 0}
          return data;
          
        }
      }
      
    else if(deviceModel==="3E" && engineStatus =="ON"){
      if(level>='6.8220'){
        console.log('Empty');
        data = {"fuelLevel":'Empty',"fuelInLitres": 0}
        return data;
        
      }
        else if(level<='6.8220' && level>='5.9290'){
          console.log('Empty');
          data = {"fuelLevel":'Empty',"fuelInLitres": 0}
          return data;
          
        }
        else if(level<='5.9290' && level>='5.0924'){
          console.log('Reserve');
          data = {"fuelLevel":'Reserve',"fuelInLitres": 0}
          return data;
          
        }
        else if(level<='5.0924' && level>='4.1375'){
          console.log('Half tank');
          data = {"fuelLevel":'Half tank',"fuelInLitres": 0}
          return data;
          
        }
        else if(level<='4.1375' && level>='0.5574'){
          console.log('75%  tank');
          data = {"fuelLevel":'75%  tank',"fuelInLitres": 0}
          return data;
          
        }
        else if(level<='0.5574'){
          console.log('Full Tank');
          data = {"fuelLevel":'Full Tank',"fuelInLitres": 0}
          return data;
          
        }
      }  
},

SDFcoolanttemp(volt,deviceModel){
  console.log('mmm',volt,deviceModel)
  if(deviceModel==="AGROLUX"){
    if(volt>='8.0044843'){
      console.log('40');
      data = {"Temp":40}
      return data.Temp
      
    }
    else if(volt<='8.0044843' && volt>='7.4936247723133'){
      console.log('40');
      data = {"Temp":40}
      return data.Temp
      
    }
    else if(volt<='7.4936247723133' && volt>='6.70032573289902'){
      console.log('60');
      data = {"Temp":60}
      return data.Temp
    }
    else if(volt<='6.70032573289902' && volt>='5.6520618556701'){
      console.log('80');
      data = {"Temp":80}
      return data.Temp
    }
    else if(volt<='5.6520618556701' && volt>='4.79194630872483'){
      console.log('100');
      data = {"Temp":100}
      return data.Temp
    }
    else if(volt<='4.79194630872483' && volt>='4.496376812'){
      console.log('115');
      data = {"Temp":115}
      return data.Temp
    }
    else if(volt<='4.496376812' && volt>='3.93388429752066'){
      console.log('120');
      data = {"Temp":120}
      return data.Temp
    }
    else if(volt<='3.93388429752066'){
      console.log('130');
      data = {"Temp":130}
      return data.Temp
    }
    
  }  
  else if(deviceModel==="AGROMAXX"){
    if(volt>='6.65636363636364'){
      console.log('40');
      data = {"Temp":40}
      return data.Temp
      
    }
    else if(volt<='6.65636363636364' && volt>='6.28679245283019'){
      console.log('40');
      data = {"Temp":40}
      return data.Temp
      
    }
    else if(volt<='6.28679245283019' && volt>='5.70547945205479'){
      console.log('60');
      data = {"Temp":60}
      return data.Temp
    }
    else if(volt<='5.70547945205479' && volt>='5.36363636363636'){
      console.log('80');
      data = {"Temp":80}
      return data.Temp
    }
    else if(volt<='5.36363636363636' && volt>='4.9344262295082'){
      console.log('90');
      data = {"Temp":90}
      return data.Temp
    }
    else if(volt<='4.9344262295082' && volt>='4.49668874172185'){
      console.log('100');
      data = {"Temp":100}
      return data.Temp
    }
    else if(volt<='4.49668874172185' && volt>='4.06976744186047'){
      console.log('110');
      data = {"Temp":110}
      return data.Temp
    }
    else if(volt<='4.06976744186047'){
      console.log('120');
      data = {"Temp":120}
      return data.Temp
    }

  }
    
  else if(deviceModel==="3E"){
    if(volt>='7.05882352941176'){
      console.log('60');
      data = {"Temp":60}
      return data.Temp
      
    }
    else if(volt<='7.05882352941176' && volt>='6.31578947368421'){
      console.log('60');
      data = {"Temp":60}
      return data.Temp
      
    }
    else if(volt<='6.31578947368421' && volt>='5.85774058577406'){
      console.log('80');
      data = {"Temp":80}
      return data.Temp
    }
    else if(volt<='5.85774058577406' && volt>='5.36082474226804'){
      console.log('90');
      data = {"Temp":90}
      return data.Temp
    }
    else if(volt<='5.36082474226804' && volt>='4.77987421383648'){
      console.log('100');
      data = {"Temp":100}
      return data.Temp
    }
    else if(volt<='4.77987421383648' && volt>='4.31654676258993'){
      console.log('110');
      data = {"Temp":110}
      return data.Temp
    }
    else if(volt<='4.31654676258993' && volt>='3.69747899159664'){
      console.log('120');
      data = {"Temp":120}
      return data.Temp
    }
    else if(volt<='3.69747899159664' && volt>='3.30275229357798'){
      console.log('130');
      data = {"Temp":130}
      return data.Temp
    }
    else if(volt<='3.30275229357798' && volt>='3.30275229357798'){
      console.log('130');
      data = {"Temp":130}
      return data.Temp
    }
    else if(volt<='3.69747899159664' && volt>='2.82828282828283'){
      console.log('140');
      data = {"Temp":140}
      return data.Temp
    }
    else if(volt<='2.82828282828283' && volt>='2.37362637362637'){
      console.log('150');
      data = {"Temp":150}
      return data.Temp
    }
    else if(volt<='2.37362637362637' && volt>='1.97647058823529'){
      console.log('160');
      data = {"Temp":160}
      return data.Temp
    }
    else if(volt<='1.97647058823529'){
      console.log('170');
      data = {"Temp":170}
      return data.Temp
    }

  }
},
SDFdigitalinput1(DO1){
  if(DO1=='1'){
    return DO1='CHOKE';
}else if(DO1=='0'){
    return DO1 ='RELEASE';
}
},
SDFdigitalinput2(DO2){
if(DO2=='1'){
    return DO2='CHOKE';
}else if(DO2=='0'){
    return DO2 ='NORMAL';
}
},
SDFdigitalinput3(DO3){
  if(DO3=='1'){
      return DO3='LOW';
  }else if(DO3=='0'){
      return DO3 ='NORMAL';
  }
  },


  
  SDFRPM(deviceModel,rpm){
    
    console.log('shiva',deviceModel,rpm)
    if(deviceModel=="AGROLUX"){
      var RPM = rpm / (2.58*10);
      return RPM
      //console.log(RPM)
    }
    else if(deviceModel=="ARGOMAXX"){
      var RPM = rpm / (2.58*10);
      return RPM
    
    }
    else if(deviceModel=="3E"){
      var RPM = rpm / (2.48*10);
      return RPM
    
    }
  },

  
  VTS3fuellevel(level,deviceModel,engineStatus) {
    console.log('fsjs1',level,deviceModel,engineStatus)
    var data;    
    if(deviceModel=='ARGO4000' || deviceModel==="ARGO2000"){
  
      if(level<='0.72'){
        console.log('Empty');
        data = {"fuelLevel":'Empty',"fuelInLitres": 0}
        return data;
        
      }
        else if(level<='0.74' && level>='0.72'){
          console.log('Empty');
          data = {"fuelLevel":'Empty',"fuelInLitres": 25}
          return data;
          
        }
        else if(level<='1.69' && level>='0.74'){
          console.log('Empty');
          data = {"fuelLevel":'Empty',"fuelInLitres": 27}
          return data;
          
          
        }
    
        else if(level<='2.21' && level>='1.69'){
          console.log('Empty');
          data = {"fuelLevel":'Empty',"fuelInLitres": 29}
          return data;
          
        }
        else if(level<='2.65' && level>='2.21'){
          console.log('Empty');
          data = {"fuelLevel":'Empty',"fuelInLitres": 31}
          return data;
          
        }
        else if(level<='3.71' && level>='2.65'){
          console.log('Reserve');
          data = {"fuelLevel":'Reserve',"fuelInLitres": 35}
          return data;
          
        }
        else if(level<='3.93' && level>='3.71'){
          console.log('Reserve');
          data = {"fuelLevel":'Reserve',"fuelInLitres": 40}
          return data;
          
        }
        else if(level<='4.3' && level>='3.93'){
          console.log('Reserve');
          data = {"fuelLevel":'Reserve',"fuelInLitres": 45}
          return data;
          
        }
        else if(level<='4.72' && level>='4.3'){
          console.log('Reserve');
          data = {"fuelLevel":'Reserve',"fuelInLitres": 50}
          return data;
          
        }
        else if(level<='4.93' && level>='4.72'){
          console.log('Reserve');
          data = {"fuelLevel":'Reserve',"fuelInLitres": 55}
          return data;
          
        }
        else if(level<='5.15' && level>='4.93'){
          console.log('Half tank');
          data = {"fuelLevel":'Half tank',"fuelInLitres": 60}
          return data;
          
        }
        else if(level<='5.31' && level>='5.15'){
          console.log('Half tank');
          data = {"fuelLevel":'Half tank',"fuelInLitres": 65}
          return data;
          
        }
        else if(level<='5.41' && level>='5.31'){
          console.log('Half tank');
          data = {"fuelLevel":'Half tank',"fuelInLitres": 70}
          return data;
          
        }
        else if(level<='5.5' && level>='5.41'){
          console.log('Half tank');
          data = {"fuelLevel":'Half tank',"fuelInLitres": 75}
          return data;
          
        }
        else if(level<='5.61' && level>='5.5'){
          console.log('Half tank');
          data = {"fuelLevel":'Half tank',"fuelInLitres": 80}
          return data;
          
        }
        else if(level<='5.7' && level>='5.61'){
          console.log('Half tank');
          data = {"fuelLevel":'Half tank',"fuelInLitres": 85}
          return data;
          
        }
        else if(level<='5.75' && level>='5.7'){
          console.log('75%  tank');
          data = {"fuelLevel":'75%  tank',"fuelInLitres": 90}
          return data;
          
        }
        else if(level<='5.79' && level>='5.75'){
          console.log('75%  tank');
          data = {"fuelLevel":'75%  tank',"fuelInLitres": 95}
          return data;
          
          
        }
        else if(level<='5.8' && level>='5.79'){
          console.log('75%  tank');
          data = {"fuelLevel":'75%  tank',"fuelInLitres": 100}
          return data;
          
        }
        else if(level<='5.81' && level>='5.8'){
          console.log('75%  tank');
          data = {"fuelLevel":'Full tank',"fuelInLitres": 105}
          return data;
          
        }
        else if(level>='5.81'){
          console.log('Full Tank');
          data = {"fuelLevel":'Full Tank',"fuelInLitres": 105}
          return data;
          
        }
        else if(level=='0'){
          data = {"fuelLevel":'Empty',"fuelInLitres": 0}
          return data;
        }
        else{
          data = {"fuelLevel":'Empty',"fuelInLitres": 0}
          return data;
        }
      }
        else if(deviceModel==="ARGO2500" || deviceModel==="ARGO4500"){
          console.log('lllllllllllllll')
          if(level>='2.48'){
            console.log('Empty');
            data = {"fuelLevel":'Empty',"fuelInLitres": 0}
            return data;
            
          }
    
          else if(level<='2.48' && level>='2.4'){
            console.log('Empty');
            data = {"fuelLevel":'Empty',"fuelInLitres": 0}
            return data;
            
          }
          else if(level<='2.4' && level>='2.08'){
            console.log('Reserve');
            data = {"fuelLevel":'Reserve',"fuelInLitres": 28}
            return data;
            
            
          }
      
          else if(level<='2.08' && level>='1.84'){
            console.log('Reserve');
            data = {"fuelLevel":'Reserve',"fuelInLitres": 30}
            return data;
            
          }
          else if(level<='1.84' && level>='1.68'){
            console.log('Reserve');
            data = {"fuelLevel":'Reserve',"fuelInLitres": 35}
            return data;
            
          }
          else if(level<='1.68' && level>='1.52'){
            console.log('Reserve');
            data = {"fuelLevel":'Reserve',"fuelInLitres": 37}
            return data;
            
          }
          else if(level<='1.52' && level>='1.52'){
            console.log('Half Tank');
            data = {"fuelLevel":'Half Tank',"fuelInLitres": 40}
            return data;
            
          }
          else if(level<='1.52' && level>='1.44'){
            console.log('Half Tank');
            data = {"fuelLevel":'Half Tank',"fuelInLitres": 42}
            return data;
            
          }
          else if(level<='1.44' && level>='1.2'){
            console.log('Half Tank');
            data = {"fuelLevel":'Half Tank',"fuelInLitres": 45}
            return data;
            
          }
          else if(level<='1.2' && level>='0.88'){
            console.log('Half Tank');
            data = {"fuelLevel":'Half Tank',"fuelInLitres": 50}
            return data;
            
          }
          else if(level<='0.88' && level>='0.8'){
            console.log('75% tank');
            data = {"fuelLevel":'75% tank',"fuelInLitres": 55}
            return data;
            
          }
          else if(level<='0.8' && level>='0.52'){
            console.log('75% tank');
            data = {"fuelLevel":'75% tank',"fuelInLitres": 60}
            return data;
            
          }
          else if(level<='0.52' && level>='0.26'){
            console.log('75% tank');
            data = {"fuelLevel":'75% tank',"fuelInLitres": 65}
            return data;
            
          }
          else if(level<='0.26' && level>='0.14'){
            console.log('75% tank');
            data = {"fuelLevel":'75% tank',"fuelInLitres": 70}
            return data;
            
          }
          else if(level<='0.14' && level>='0.1'){
            console.log('Full tank');
            data = {"fuelLevel":'Full tank',"fuelInLitres": 75}
            return data;
            
          }
          else if(level<='0.1' && level>='0.056' || level>='0.064'){
            console.log('Full tank');
            data = {"fuelLevel":'Full tank',"fuelInLitres": 77}
            return data;
            
          }
          else if(level>='0.056' || level>='0.064'){
            console.log('Full tank');
            data = {"fuelLevel":'Full tank',"fuelInLitres": 80}
            return data;
            
          }
          else if(level=='0'){
            data = {"fuelLevel":'Empty',"fuelInLitres": 0}
            return data;
          }
          else{
            data = {"fuelLevel":'Empty',"fuelInLitres": 0}
            return data;
          }
        }
        
        
},


VTS3coolanttemp(volt,deviceModel){
  console.log('mmm',volt,deviceModel)
  if(deviceModel==='ARGO4000'  || deviceModel==="ARGO2000"){
    if(volt>='5.48'){
      console.log('40');
      data = {"Temp":40}
      return data.Temp
      
    }
    else if(volt<='5.48' && volt>='5.20'){
      console.log('50');
      data = {"Temp":50}
      return data.Temp
      
    }
    else if(volt<='5.20' && volt>='4.86'){
      console.log('60');
      data = {"Temp":60}
      return data.Temp
    }
    else if(volt<='4.86' && volt>='4.46'){
      console.log('70');
      data = {"Temp":70}
      return data.Temp
    }
    else if(volt<='4.46' && volt>='4.01'){
      console.log('80');
      data = {"Temp":80}
      return data.Temp
    }
    else if(volt<='4.01' && volt>='3.54'){
      console.log('90');
      data = {"Temp":90}
      return data.Temp
    }
    else if(volt<='3.54' && volt>='3.08'){
      console.log('100');
      data = {"Temp":100}
      return data.Temp
    }
    else if(volt<='3.08' && volt>='2.63'){
      console.log('110');
      data = {"Temp":110}
      return data.Temp
    }
    else if(volt<='2.63' && volt>='2.22'){
      console.log('120');
      data = {"Temp":120}
      return data.Temp
    }
    else if(volt<='2.22' && volt>='1.83'){
      console.log('130');
      data = {"Temp":130}
      return data.Temp
    }
    else if(volt<='1.83'){
      console.log('130');
      data = {"Temp":130}
      return data.Temp
    }
    else if(volt=='0'){
      data = {"Temp":130}
      return data.Temp
    }
    else{
      data = {"Temp":130}
      return data.Temp
    }
    
  }  
  else if(deviceModel==='ARGO4500'  || deviceModel==="ARGO2500"){
    if(volt>='3.93'){
      console.log('50');
      data = {"Temp":50}
      return data.Temp
      
    }
    else if(volt<='3.93' && volt>='3.29'){
      console.log('60');
      data = {"Temp":60}
      return data.Temp
      
    }
    else if(volt<='3.29' && volt>='2.58'){
      console.log('70');
      data = {"Temp":70}
      return data.Temp
    }
    else if(volt<='2.58' && volt>='2.12'){
      console.log('80');
      data = {"Temp":80}
      return data.Temp
    }
    else if(volt<='2.12' && volt>='1.70'){
      console.log('90');
      data = {"Temp":90}
      return data.Temp
    }
    else if(volt<='1.70' && volt>='1.30'){
      console.log('100');
      data = {"Temp":100}
      return data.Temp
    }
    else if(volt<='1.30' && volt>='1.10'){
      console.log('110');
      data = {"Temp":110}
      return data.Temp
    }
    else if(volt<='1.10' && volt>='0.91'){
      console.log('120');
      data = {"Temp":120}
      return data.Temp
    }
    else if(volt<='0.91'){
      console.log('120');
      data = {"Temp":120}
      return data.Temp
    }
    else if(volt=='0'){
      data = {"Temp":130}
      return data.Temp
    }
    else{
      data = {"Temp":130}
      return data.Temp
    }

  } 
  
},

VTS3oilpressure(volt,deviceModel){
  if(deviceModel==='ARGO4000'  || deviceModel==="ARGO2000" ){
    if(volt<='0.2'){
      console.log('0');
      data = {"Pressurebar":0}
      return data.Pressurebar
      
    }
    else if(volt<='0.2' && volt>='0.2'){
      console.log('0');
      data = {"Pressurebar":0}
      return data.Pressurebar
      
    }
    else if(volt<='2.35' && volt>='0.2'){
      console.log('1');
      data = {"Pressurebar":1}
      return data.Pressurebar
    }
    else if(volt<='4.07' && volt>='2.35'){
      console.log('2');
      data = {"Pressurebar":2}
      return data.Pressurebar
    }
    else if(volt<='5' && volt>='4.07'){
      console.log('3');
      data = {"Pressurebar":3}
      return data.Pressurebar
    }
    else if(volt<='5.43' && volt>='5'){
      console.log('4');
      data = {"Pressurebar":4}
      return data.Pressurebar
    }
    else if(volt<='5.93' && volt>='5.43'){
      console.log('5');
      data = {"Pressurebar":5}
      return data.Pressurebar
    }
    else if(volt<='6.33' && volt>='5.93'){
      console.log('6');
      data = {"Pressurebar":6}
      return data.Pressurebar
    }
    else if(volt<='6.52' && volt>='6.33'){
      console.log('7');
      data = {"Pressurebar":7}
      return data.Pressurebar
    }
    else if(volt<='6.72' && volt>='6.52'){
      console.log('8');
      data = {"Pressurebar":8}
      return data.Pressurebar
    }
    else if(volt<='6.98' && volt>='6.72'){
      console.log('9');
      data = {"Pressurebar":9}
      return data.Pressurebar
    }
    else if(volt<='7.2' && volt>='6.98'){
      console.log('10');
      data = {"Pressurebar":10}
      return data.Pressurebar
    }
    else if(volt>='7.2'){
      console.log('10');
      data = {"Pressurebar":10}
      return data.Pressurebar
    }
    else if(volt=='0'){
      data = {"Pressurebar":0}
      return data.Pressurebar
    }
    else{
      data = {"Pressurebar":0}
      return data.Pressurebar
    }

    
  }
  else if(deviceModel==="ARGO2500" || deviceModel==="ARGO4500"){
    if(volt<='1.8' ){
      console.log('0');
      data = {"Pressurebar":0}
      return data.Pressurebar
      
    }
    else if(volt<='1.8' && volt>='1.8'){
      console.log('1');
      data = {"Pressurebar":1}
      return data.Pressurebar
      
    }
    else if(volt<='2.36' && volt>='1.8'){
      console.log('2');
      data = {"Pressurebar":1}
      return data.Pressurebar
    }
    else if(volt<='2.72' && volt>='2.36'){
      console.log('3');
      data = {"Pressurebar":3}
      return data.Pressurebar
    }
    else if(volt<='3.08' && volt>='2.72'){
      console.log('4');
      data = {"Pressurebar":4}
      return data.Pressurebar
    }
    else if(volt<='3.3' && volt>='3.08'){
      console.log('5');
      data = {"Pressurebar":5}
      return data.Pressurebar
    }
    else if(volt<='3.52' && volt>='3.3'){
      console.log('6');
      data = {"Pressurebar":6}
      return data.Pressurebar
    }
    else if(volt>='3.52'){
      console.log('6');
      data = {"Pressurebar":6}
      return data.Pressurebar
    }
    else if(volt=='0'){
      data = {"Pressurebar":0}
      return data.Pressurebar
    }
    else{
      data = {"Pressurebar":0}
      return data.Pressurebar
    }

  }
  },
VTS3digitalinput1(DO1){
  if(DO1=='1'){
    return DO1='RELEASE';
}else if(DO1=='0'){
    return DO1 ='APPLIED';
}
},
VTS3digitalinput2(DO2){
if(DO2=='1'){
    return DO2='NORMAL';
}else if(DO2=='0'){
    return DO2 ='CHOKE';
}
},

// ARGO4500digitalinput3(DO3){
//   if(DO3=='1'){
//       return DO3='LOW';
//   }else if(DO3=='0'){
//       return DO3 ='NORMAL';
//   }
//   },


  
  VTS3RPM(deviceModel,rpm){
    
    console.log('shiva',deviceModel,rpm)
    if(deviceModel=="ARGO4500" || deviceModel=="ARGO4000" || deviceModel=="ARGO2500" || deviceModel=="ARGO2000" ){
      var RPM = rpm * 5.235;
      if(RPM>=2500){
        RPM=2500;
        return RPM
      }
      else if(RPM >= 100 &&  RPM<=900){
        RPM=900;
        return RPM
      }
      else{
        return RPM
      }
    }

    

    
    
  },

  
apollocoolanttemp(volt,deviceModel){
  console.log('mmm',volt,deviceModel)
  if(deviceModel==="4TT"){
    if(volt>='3.54'){
      console.log('40');
      data = {"Temp":40}
      return data.Temp
      
    }
    else if(volt<='3.54' && volt>='3.13'){
      console.log('40');
      data = {"Temp":40}
      return data.Temp
      
    }
    else if(volt<='3.13' && volt>='2.8'){
      console.log('50');
      data = {"Temp":50}
      return data.Temp
    }
    else if(volt<='2.8' && volt>='2.31'){
      console.log('60');
      data = {"Temp":60}
      return data.Temp
    }
    else if(volt<='2.31' && volt>='1.85'){
      console.log('70');
      data = {"Temp":70}
      return data.Temp
    }
    else if(volt<='1.85' && volt>='1.53'){
      console.log('80');
      data = {"Temp":80}
      return data.Temp
    }
    else if(volt<='1.53' && volt>='1.23'){
      console.log('90');
      data = {"Temp":90}
      return data.Temp
    }
    else if(volt<='1.23' && volt>='1.05'){
      console.log('100');
      data = {"Temp":100}
      return data.Temp
    }
    else if(volt<='1.05' && volt>='0.83'){
      console.log('120');
      data = {"Temp":120}
      return data.Temp
    }
    else if(volt<='0.83' || volt<='0.00'){
      console.log('130');
      data = {"Temp":130}
      return data.Temp
    }
    
  }  
  else if(deviceModel==="45FX"){
    if(volt>='6.65636363636364'){
      console.log('40');
      data = {"Temp":40}
      return data.Temp
      
    }
    else if(volt<='6.65636363636364' && volt>='6.28679245283019'){
      console.log('40');
      data = {"Temp":40}
      return data.Temp
      
    }
    else if(volt<='6.28679245283019' && volt>='5.70547945205479'){
      console.log('60');
      data = {"Temp":60}
      return data.Temp
    }
    else if(volt<='5.70547945205479' && volt>='5.36363636363636'){
      console.log('80');
      data = {"Temp":80}
      return data.Temp
    }
    else if(volt<='5.36363636363636' && volt>='4.9344262295082'){
      console.log('90');
      data = {"Temp":90}
      return data.Temp
    }
    else if(volt<='4.9344262295082' && volt>='4.49668874172185'){
      console.log('100');
      data = {"Temp":100}
      return data.Temp
    }
    else if(volt<='4.49668874172185' && volt>='4.06976744186047'){
      console.log('110');
      data = {"Temp":110}
      return data.Temp
    }
    else if(volt<='4.06976744186047'){
      console.log('120');
      data = {"Temp":120}
      return data.Temp
    }

  }
    
  else if(deviceModel==="3E"){
    if(volt>='7.05882352941176'){
      console.log('60');
      data = {"Temp":60}
      return data.Temp
      
    }
    else if(volt<='7.05882352941176' && volt>='6.31578947368421'){
      console.log('60');
      data = {"Temp":60}
      return data.Temp
      
    }
    else if(volt<='6.31578947368421' && volt>='5.85774058577406'){
      console.log('80');
      data = {"Temp":80}
      return data.Temp
    }
    else if(volt<='5.85774058577406' && volt>='5.36082474226804'){
      console.log('90');
      data = {"Temp":90}
      return data.Temp
    }
    else if(volt<='5.36082474226804' && volt>='4.77987421383648'){
      console.log('100');
      data = {"Temp":100}
      return data.Temp
    }
    else if(volt<='4.77987421383648' && volt>='4.31654676258993'){
      console.log('110');
      data = {"Temp":110}
      return data.Temp
    }
    else if(volt<='4.31654676258993' && volt>='3.69747899159664'){
      console.log('120');
      data = {"Temp":120}
      return data.Temp
    }
    else if(volt<='3.69747899159664' && volt>='3.30275229357798'){
      console.log('130');
      data = {"Temp":130}
      return data.Temp
    }
    else if(volt<='3.30275229357798' && volt>='3.30275229357798'){
      console.log('130');
      data = {"Temp":130}
      return data.Temp
    }
    else if(volt<='3.69747899159664' && volt>='2.82828282828283'){
      console.log('140');
      data = {"Temp":140}
      return data.Temp
    }
    else if(volt<='2.82828282828283' && volt>='2.37362637362637'){
      console.log('150');
      data = {"Temp":150}
      return data.Temp
    }
    else if(volt<='2.37362637362637' && volt>='1.97647058823529'){
      console.log('160');
      data = {"Temp":160}
      return data.Temp
    }
    else if(volt<='1.97647058823529'){
      console.log('170');
      data = {"Temp":170}
      return data.Temp
    }

  }
},

  
apollocoolanttemp(volt,deviceModel){
  console.log('mmm',volt,deviceModel)
  if(deviceModel==="4TT"){
    if(volt>='3.54'){
      console.log('40');
      data = {"Temp":40}
      return data.Temp
      
    }
    else if(volt<='3.54' && volt>='3.13'){
      console.log('40');
      data = {"Temp":40}
      return data.Temp
      
    }
    else if(volt<='3.13' && volt>='2.8'){
      console.log('50');
      data = {"Temp":50}
      return data.Temp
    }
    else if(volt<='2.8' && volt>='2.31'){
      console.log('60');
      data = {"Temp":60}
      return data.Temp
    }
    else if(volt<='2.31' && volt>='1.85'){
      console.log('70');
      data = {"Temp":70}
      return data.Temp
    }
    else if(volt<='1.85' && volt>='1.53'){
      console.log('80');
      data = {"Temp":80}
      return data.Temp
    }
    else if(volt<='1.53' && volt>='1.23'){
      console.log('90');
      data = {"Temp":90}
      return data.Temp
    }
    else if(volt<='1.23' && volt>='1.05'){
      console.log('100');
      data = {"Temp":100}
      return data.Temp
    }
    else if(volt<='1.05' && volt>='0.83'){
      console.log('120');
      data = {"Temp":120}
      return data.Temp
    }
    else if(volt<='0.83' || volt<='0.00'){
      console.log('130');
      data = {"Temp":130}
      return data.Temp
    }
    
  }  
  else if(deviceModel==="45FX"){
    if(volt>='3.80'){
      console.log('40');
      data = {"Temp":40}
      return data.Temp
      
    }
    else if(volt<='3.80' && volt>='3.79'){
      console.log('40');
      data = {"Temp":40}
      return data.Temp
      
    }
    else if(volt<='3.79' && volt>='3.6'){
      console.log('50');
      data = {"Temp":50}
      return data.Temp
    }
    else if(volt<='3.4' && volt>='3.59'){
      console.log('60');
      data = {"Temp":60}
      return data.Temp
    }
    else if(volt<='3.39' && volt>='3.21'){
      console.log('70');
      data = {"Temp":70}
      return data.Temp
    }
    else if(volt<='3.19' && volt>='2.90'){
      console.log('80');
      data = {"Temp":80}
      return data.Temp
    }
    else if(volt<='2.89' && volt>='2.6'){
      console.log('90');
      data = {"Temp":90}
      return data.Temp
    }
    else if(volt<='2.59' && volt>='2.2'){
      console.log('100');
      data = {"Temp":100}
      return data.Temp
    }
    else if(volt<='2.19' && volt>='1.9'){
      console.log('110');
      data = {"Temp":110}
      return data.Temp
    }
    else if(volt<='1.80' && volt>='0.8'){
      console.log('120');
      data = {"Temp":120}
      return data.Temp
    }
    else if(volt<='0.8'){
      console.log('120');
      data = {"Temp":120}
      return data.Temp
    }

  }
    
  else if(deviceModel==="25FX"){
	  if(volt>='3.80'){
      console.log('40');
      data = {"Temp":40}
      return data.Temp

    }
    else if(volt<='3.80' && volt>='3.79'){
      console.log('40');
      data = {"Temp":40}
      return data.Temp

    }
    else if(volt<='3.79' && volt>='3.59'){
      console.log('50');
      data = {"Temp":50}
      return data.Temp
    }
    else if(volt<='3.59' && volt>='3.29'){
      console.log('60');
      data = {"Temp":60}
      return data.Temp
    }
    else if(volt<='3.29' && volt>='3.19'){
      console.log('70');
      data = {"Temp":70}
      return data.Temp
    }
    else if(volt<='3.19' && volt>='2.89'){
      console.log('80');
      data = {"Temp":80}
      return data.Temp
    }
    else if(volt<='2.89' && volt>='2.59'){
      console.log('90');
      data = {"Temp":90}
      return data.Temp
    }
    else if(volt<='2.59' && volt>='2.19'){
      console.log('100');
      data = {"Temp":100}
      return data.Temp
    }
    else if(volt<='2.19' && volt>='1.8'){
      console.log('110');
      data = {"Temp":110}
      return data.Temp
    }
    else if(volt<='1.80' && volt>='0.8'){
      console.log('120');
      data = {"Temp":120}
      return data.Temp
    }
    else if(volt<='0.8'){
      console.log('120');
      data = {"Temp":120}
      return data.Temp
    }
    else if(volt<='0.000'){
      console.log('0');
      data = {"Temp":0}
      return data.Temp
    }
  }
},

apolloengineoil(volt,deviceModel){
  console.log('mmm',volt,deviceModel)
  if(deviceModel==='4TT'  || deviceModel==="45FX" || deviceModel==="25FX" ){
    if(volt<='3.80'){
      console.log('2');
      data = {"Pressurebar":2}
      return data.Pressurebar
      
    }
    else if(volt<='4.70' && volt>='3.80'){
      console.log('4');
      data = {"Pressurebar":4}
      return data.Pressurebar
      
    }
    else if(volt<='4.71' && volt>='5.32'){
      console.log('6');
      data = {"Pressurebar":6}
      return data.Pressurebar
      
    }
    else if(volt>='5.32'){
      console.log('8');
      data = {"Pressurebar":8}
      return data.Pressurebar
      
    }
  }
},



RPMApollo(deviceModel,rpm){
  console.log(deviceModel,rpm)
  var dataArray = rpm.split('*');
  if(deviceModel=="4TT"){
    var RPM = dataArray[0] * 5;
    if(RPM>=2200){
      RPM=2500;
      return RPM
    }
    else if(RPM >= 100 &&  RPM<=900){
      RPM=900;
      return RPM
    }
    else{
      return RPM
    }
  }
  else if(deviceModel=="45FX"){
    var RPM = dataArray[0] * 5.235;
    if(RPM>=2200){
      RPM=2500;
      return RPM
    }
    else if(RPM >= 100 && RPM<=900){
      RPM=900;
      return RPM
    }
    else{
      return RPM
    }
  
  }
  else if(deviceModel=="25FX"){
    var RPM = dataArray[0] * 5.235;
    if(RPM>=2200){
      RPM=2200;
      return RPM
    }
    else if(RPM >= 100 && RPM<=900){
      RPM=900;
      return RPM
    }
    else{
      return RPM
    }
  
  }

},

Apollodigitalinput(DO1){
  if(DO1=='1'){
      return DO1='NORMAL';
  }else if(DO1=='0'){
      return DO1 ='LOW';
  }
},


getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  var Zero = 0;
  if(d >= 1){
    return Zero;
  }else{
    return d;
  }
  
},

VENUScoolanttemp(volt,deviceModel){
  if(deviceModel==='ULTRA4'){
    if(volt>='5.6'){
      data = {"Temp":40}
      return data.Temp  
    }
    else if(volt<'5.6' && volt>='4.88'){
      data = {"Temp":40}
      return data.Temp
      
    }
    else if(volt<'4.88' && volt>='4.69'){
      data = {"Temp":50}
      return data.Temp
    }
    else if(volt<'4.69' && volt>='4.49'){
      data = {"Temp":60}
      return data.Temp
    }
    else if(volt<'4.49' && volt>='3.98'){
      data = {"Temp":70}
      return data.Temp
    }
    else if(volt<'3.98' && volt>='3.62'){
      data = {"Temp":80}
      return data.Temp
    }
    else if(volt<'3.62' && volt>='3.42'){
      data = {"Temp":90}
      return data.Temp
    }
    else if(volt<'3.42' && volt>='3.08'){
      data = {"Temp":100}
      return data.Temp
    }
    else if(volt<'3.08' && volt>='2.80'){
      data = {"Temp":110}
      return data.Temp
    }
    else if(volt<'2.80' && volt>='1.8'){
      data = {"Temp":120}
      return data.Temp
    }
    else if(volt<'1.8'){
      data = {"Temp":120}
      return data.Temp
    }
    
  } 
},

VENUSoilpressure(volt,deviceModel){
  if(deviceModel==='ULTRA4' ){
    if(volt<='1.5'){
      console.log('2');
      data = {"Pressurebar":2}
      return data.Pressurebar
      
    }
    else if(volt<='2.80' && volt>'1.5'){
      console.log('2');
      data = {"Pressurebar":2}
      return data.Pressurebar
      
    }
    else if(volt<='3.45' && volt>'2.80'){
      console.log('3');
      data = {"Pressurebar":3}
      return data.Pressurebar
    }
    else if(volt<='3.74' && volt>'3.45'){
      console.log('4');
      data = {"Pressurebar":4}
      return data.Pressurebar
    }
    else if(volt<='4.24' && volt>='3.74'){
      console.log('5');
      data = {"Pressurebar":5}
      return data.Pressurebar
    }
    else if(volt<='4.45' && volt>'4.24'){
      console.log('6');
      data = {"Pressurebar":6}
      return data.Pressurebar
    }
    else if(volt<='4.61' && volt>'4.45'){
      console.log('7');
      data = {"Pressurebar":7}
      return data.Pressurebar
    }
    else if(volt<='4.82' && volt>'4.61'){
      console.log('8');
      data = {"Pressurebar":8}
      return data.Pressurebar
    }
    else if(volt<='4.99' && volt>'4.82'){
      console.log('9');
      data = {"Pressurebar":9}
      return data.Pressurebar
    }
    else if(volt<='5.6' && volt>'4.99'){
      console.log('10');
      data = {"Pressurebar":10}
      return data.Pressurebar
    }
    else if(volt>'5.6'){
      console.log('10');
      data = {"Pressurebar":10}
      return data.Pressurebar
    }   
  }
},

VENUSfuellevel(level,deviceModel) {
  var data;
if(deviceModel=='ULTRA4'){

if(level<='0.45'){
  console.log('Empty');
  data = {"fuelLevel":'Empty',"fuelInLitres": 0}
  return data;
  
}
  else if(level<='0.65' && level>'0.45'){
    console.log('Empty');
    data = {"fuelLevel":'Empty',"fuelInLitres": 10}
    return data;
    
  }
  else if(level<='1.192' && level>'0.65'){
    console.log('Below Reserve');
    data = {"fuelLevel":'Below Reserve',"fuelInLitres": 15}
    return data;  
  }
  else if(level<='2.14' && level>'1.192'){
    console.log('Below Reserve');
    data = {"fuelLevel":'Below Reserve',"fuelInLitres": 20}
    return data;
    
  }
  else if(level<='2.43' && level>'2.14'){
    console.log('Reserve');
    data = {"fuelLevel":'Reserve',"fuelInLitres": 25}
    return data;
    
  }
  else if(level<='2.867' && level>'2.43'){
    console.log('Reserve');
    data = {"fuelLevel":'Reserve',"fuelInLitres": 30}
    return data;
    
  }
  else if(level<='3.144' && level>'2.867'){
    console.log('Above Reserve');
    data = {"fuelLevel":'Above Reserve',"fuelInLitres": 35}
    return data;
    
  }
  else if(level<='3.40' && level>'3.144'){
    console.log('Above Half');
    data = {"fuelLevel":'Above Reserve',"fuelInLitres": 40}
    return data;
    
  }
  else if(level<='3.60' && level>'3.40'){
    console.log('Almost Half');
    data = {"fuelLevel":'Almost Half',"fuelInLitres": 45}
    return data;
    
  }
  else if(level<='3.80' && level>'3.60'){
    console.log('Half tank');
    data = {"fuelLevel":'Half Tank',"fuelInLitres": 50}
    return data;
    
  }
  else if(level<='4.10' && level>'3.80'){
    console.log('Half tank');
    data = {"fuelLevel":'Half Tank',"fuelInLitres": 55}
    return data;
    
  }
  else if(level<='4.20' && level>'4.10'){
    console.log('Above Half');
    data = {"fuelLevel":'Above Half',"fuelInLitres": 60}
    return data;
    
  }
  else if(level<='4.30' && level>'4.20'){
    console.log('Above Half');
    data = {"fuelLevel":'Above Half',"fuelInLitres": 65}
    return data;
    
  }
  else if(level<='4.40' && level>'4.30'){
    console.log('Above Half');
    data = {"fuelLevel":'Above Half',"fuelInLitres": 70}
    return data;
    
  }
  else if(level<='4.45' && level>'4.40'){
    console.log('Almost Full');
    data = {"fuelLevel":'Almost Full',"fuelInLitres": 75}
    return data;
    
  }

  else if(level<='4.50' && level>'4.45'){
    console.log('Full Tank');
    data = {"fuelLevel":'Full Tank',"fuelInLitres": 80}
    return data;
    
  }

  else if(level<='4.65' && level>'4.50'){
    console.log('Full Tank');
    data = {"fuelLevel":'Full Tank',"fuelInLitres": 85}
    return data;
    
    
  }
  else if(level<='5.3' && level>'4.65'){
    console.log('Full Tank');
    data = {"fuelLevel":'Full Tank',"fuelInLitres": 90}
    return data;
    
  }
  else if(level>'5.3'){
    console.log('Tank Top');
    data = {"fuelLevel":'Tank Top',"fuelInLitres": 95}
    return data;
    
  }
}
},
VENUSHFdigitalinput1(DI2){
  if(DI2=='1'){
      return DI2='CHOKE';
  }else if(DI2=='0'){
      return DI2 ='NORMAL';
  }
},
RPMVENUS(deviceModel,rpm){
  var dataArray = rpm.split('*');
  if(deviceModel=="ULTRA4"){
    var RPM = dataArray[0] * 5.12;

      return RPM
    }
  }


}



function deg2rad(deg) {
  return deg * (Math.PI/180)
}




module.exports= Helper;
