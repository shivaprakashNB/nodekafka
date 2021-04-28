//APOLLO
const TIME_INTERVAL_SECONDS = 10000;
const TWELVE_HOUR_INTERVAL_SECONDS = 43200000;
const COOLANT_TEMP_WARN_LEVEL_1 = 39;
const COOLANT_TEMP_WARN_LEVEL_2 = 50;
const PLACEHOLDER_PINNO = "{pinno}";
const PLACEHOLDER_TEMPERATURE = "{temperature}";
const COOLANT_TEMP_NOTIFICATION_TEMPLATE_HIGH = "Critical alert !! Coolant temperature for vehicle " +  PLACEHOLDER_PINNO + " has  reached  " + PLACEHOLDER_TEMPERATURE + " degrees. Pls stop your vehicle and address the issue. AUGTRN"
const COOLANT_TEMP_NOTIFICATION_TEMPLATE_MEDIUM = "Warning alert !! Coolant temperature for vehicle " + PLACEHOLDER_PINNO + " has  reached  " + PLACEHOLDER_TEMPERATURE + " degrees. Pls address the issue. AUGTRN";
const PLACEHOLDER_MOBILENO = "{mobileno}";
const PLACEHOLDER_MESSAGE = "{message}";
const SMS_SERVICE_HOST = "prpsms.co.in";
const SMS_SERVICE_PATH = "/API/SendMsg.aspx?uname=20210102&pass=9Bat94Zr&send=AUGTRN&dest={mobileno}&msg={message}";
const COOLANT_TEMP_NOTIFICATION_TYPE_HIGH = "coolantNotificationHighTime";
const COOLANT_TEMP_NOTIFICATION_TYPE_MEDIUM = "coolantNotificationMediumTime";
const URL = "http://125.16.147.178/VoicenSMS/webresources/CreateOBDCampaignPost";
const body = {
    "sourcetype": "0",
    "customivr": true,
    "campaigntype": "4",
    "filetype": "2",
    "ukey": "sZ5sXf7rSh8xIESBHuXCjUkWm",
    "serviceno": "4472232",
    "ivrtemplateid": "95",
    "retryatmpt": 1,
    "retryduration": 5,
    "msisdnlist": [
      {
        "phoneno": "8800778546",
        "prompt": "Hello"
      }
    ]
  }
  


//Engine Oil Pressure (Bar)

const ENGINE_OIL_PRESSURE_WARN_LEVEL = 1;
const PLACEHOLDER_BAR = "{bar}";
const ENGINE_OIL_PRESSURE_NOTIFICATION_TEMPLATE_HIGH = "Critical Alert !! Engine Oil Pressure for vehicle  " + PLACEHOLDER_PINNO + "  has reached " + PLACEHOLDER_BAR + " bar. Pls stop your vehicle and address the issue. AUGTRN";
const ENGINE_OIL_PRESSURE_NOTIFICATION_TYPE_HIGH = "oilpressureNotificationHighTime";



// LOW BATTERY VOLTAGE (v)
const LOW_BATTERY_VOLTAGE_WARN_LEVEL_1 = 9;
const LOW_BATTERY_VOLTAGE_WARN_LEVEL_2 = 8;
const PLACEHOLDER_VOLTAGE = "{volt}";
const LOW_BATTERY_VOLTAGE_NOTIFICATION_TEMPLATE_MEDIUM = "Warning Alert !! Battery voltage for vehicle " + PLACEHOLDER_PINNO + "  has reached  " + PLACEHOLDER_VOLTAGE + " volts. Pls get your vehicle battery recharged. AUGTRN";
const LOW_BATTERY_VOLTAGE_NOTIFICATION_TYPE_MEDIUM = "lowbatteryvoltagelNotificationMediumTime";

//Travel Speed 25FX
const TRAVEL_SPEED_25FX_WARN_LEVEL_1 = 28;
const TRAVEL_SPEED_25FX_WARN_LEVEL_2 = 30;
const TRAVEL_SPEED_25FX_PLACEHOLDER_LEVEL = "{level}";
const TRAVEL_SPEED_25FX_NOTIFICATION_TEMPLATE_HIGH = "Critical Alert !! Speed for vehicle  " + PLACEHOLDER_PINNO + " has reached " + TRAVEL_SPEED_25FX_PLACEHOLDER_LEVEL + " km/hr. Pls drive your vehicle in specified speed limit.";
const TRAVEL_SPEED_25FX_NOTIFICATION_TEMPLATE_MEDIUM = "Warning Alert !! Speed for vehicle  " + PLACEHOLDER_PINNO + " has reached  " + TRAVEL_SPEED_25FX_PLACEHOLDER_LEVEL + " km/hr. Pls drive your vehicle in specified speed limit.";
const TRAVEL_SPEED_25FX_NOTIFICATION_TYPE_HIGH = "TravelSpeed25FXNotificationHighTime";
const TRAVEL_SPEED_25FX_NOTIFICATION_TYPE_MEDIUM = "TravelSpeed25FXNotificationMediumTime";

//Travel Speed 45FX/4TT
const TRAVEL_SPEED_45FX_WARN_LEVEL_1 = 31;
const TRAVEL_SPEED_45FX_WARN_LEVEL_2 = 33;
const TRAVEL_SPEED_45FX_PLACEHOLDER_LEVEL = "{level}";
const TRAVEL_SPEED_45FX_NOTIFICATION_TEMPLATE_HIGH = "Critical Alert !! Speed for vehicle  " + PLACEHOLDER_PINNO + " has reached " + TRAVEL_SPEED_45FX_PLACEHOLDER_LEVEL + " km/hr. Pls drive your vehicle in specified speed limit.";
const TRAVEL_SPEED_45FX_NOTIFICATION_TEMPLATE_MEDIUM = "Warning Alert !! Speed for vehicle  " + PLACEHOLDER_PINNO + " has reached  " + TRAVEL_SPEED_45FX_PLACEHOLDER_LEVEL + " km/hr. Pls drive your vehicle in specified speed limit.";
const TRAVEL_SPEED_45FX_NOTIFICATION_TYPE_HIGH = "TravelSpeedNotificationHighTime";
const TRAVEL_SPEED_45FX_NOTIFICATION_TYPE_MEDIUM = "TravelSpeedNotificationMediumTime";

module.exports = {
    //COOLANT_TEMP
    TIME_INTERVAL_SECONDS,
    COOLANT_TEMP_WARN_LEVEL_1,
    COOLANT_TEMP_WARN_LEVEL_2,
    PLACEHOLDER_PINNO,
    PLACEHOLDER_TEMPERATURE,
    COOLANT_TEMP_NOTIFICATION_TEMPLATE_MEDIUM,
    COOLANT_TEMP_NOTIFICATION_TEMPLATE_HIGH,
    PLACEHOLDER_MOBILENO,
    PLACEHOLDER_MESSAGE,
    SMS_SERVICE_HOST,
    SMS_SERVICE_PATH,
    COOLANT_TEMP_NOTIFICATION_TYPE_HIGH,
    COOLANT_TEMP_NOTIFICATION_TYPE_MEDIUM,
    TWELVE_HOUR_INTERVAL_SECONDS,
    URL,
    body,

    //OIL PRESSURE
    ENGINE_OIL_PRESSURE_WARN_LEVEL,
    ENGINE_OIL_PRESSURE_NOTIFICATION_TEMPLATE_HIGH,
    ENGINE_OIL_PRESSURE_NOTIFICATION_TYPE_HIGH,
    PLACEHOLDER_BAR,

//  LOW BATTERY VOLTAGE (v)
    LOW_BATTERY_VOLTAGE_WARN_LEVEL_1,
    LOW_BATTERY_VOLTAGE_WARN_LEVEL_2,
    PLACEHOLDER_VOLTAGE,
    LOW_BATTERY_VOLTAGE_NOTIFICATION_TEMPLATE_MEDIUM,
    LOW_BATTERY_VOLTAGE_NOTIFICATION_TYPE_MEDIUM,

//Travel Speed 25FX
    TRAVEL_SPEED_25FX_WARN_LEVEL_1,
    TRAVEL_SPEED_25FX_WARN_LEVEL_2,
    TRAVEL_SPEED_25FX_NOTIFICATION_TEMPLATE_HIGH,
    TRAVEL_SPEED_25FX_NOTIFICATION_TEMPLATE_MEDIUM,
    TRAVEL_SPEED_25FX_NOTIFICATION_TYPE_HIGH,
    TRAVEL_SPEED_25FX_NOTIFICATION_TYPE_MEDIUM,

//Travel Speed 45FX/4TT
    TRAVEL_SPEED_45FX_WARN_LEVEL_1,
    TRAVEL_SPEED_45FX_WARN_LEVEL_2,
    TRAVEL_SPEED_45FX_NOTIFICATION_TEMPLATE_HIGH,
    TRAVEL_SPEED_45FX_NOTIFICATION_TEMPLATE_MEDIUM,
    TRAVEL_SPEED_45FX_NOTIFICATION_TYPE_HIGH,
    TRAVEL_SPEED_45FX_NOTIFICATION_TYPE_MEDIUM,
        
}