module.exports = {
    userRetrieveError: {
        httpCode: 500,
        body: {
            code: "DS_5000",
            message: "Could not get user from database"
        }
    },
    deviceRetrieveError: {
        httpCode: 500,
        body: {
            code: "DS_5001",
            message: "Could not get devices from database"
        }
    },
    serviceRetrieveError: {
        httpCode: 500,
        body: {
            code: "DS_5002",
            message: "Could not get services from database"
        }
    },
    serviceDatabaseError: {
        httpCode: 500,
        body: {
            code: "DS_5002",
            message: "Could not update service record from database"
        }
    },
    coolantNotifyCreateCriteriaFailed: {
        httpCode: 500,
        body: {
            code: "DS_5003",
            message: "Could not create search criteria to send coolant notification"
        }
    },
    dataRetrieveError: {
        httpCode: 500,
        body: {
            code: "DS_5004",
            message: "Could not fetch data from database"
        }
    },
    dataCleanupCreateCriteriaFailed: {
        httpCode: 500,
        body: {
            code: "DS_5005",
            message: "Could not create search criteria to fetch data for cleanup"
        }
    },
    dataUpdateError: {
        httpCode: 500,
        body: {
            code: "DS_5006",
            message: "Could not update data in database"
        }
    },
    userNotFound: {
        httpCode: 400,
        body: {
            code: "DS_4000",
            message: "Could not find user"
        }
    },
    unauthorized: {
        httpCode: 401,
        body: {
            code: "DS_4001",
            message: "Unauthorized"
        }
    },
    deviceNotFound: {
        httpCode: 404,
        body: {
            code: "DS_4002",
            message: "Could not find device"
        }
    },
    machineServiceNotFound: {
        httpCode: 404,
        body: {
            code: "DS_4003",
            message: "Could not find service data"
        }
    },
    serviceMasterNotFound: {
        httpCode: 404,
        body: {
            code: "DS_4004",
            message: "Could not find service master data"
        }
    },
    serviceMasterNotFound: {
        httpCode: 404,
        body: {
            code: "DS_4004",
            message: "Could not find service master data"
        }
    },
    serviceScheduleNotFound: {
        httpCode: 404,
        body: {
            code: "DS_4005",
            message: "No schedule found for service creation"
        }
    },
    machineServiceNotFound: {
        httpCode: 404,
        body: {
            code: "DS_4005",
            message: "No machine found for service creation"
        }
    },
    machineServiceUpdateSuccess: {
        httpCode: 200,
        body: {
            code: "DS_2000",
            message: "Service record updated successfully"
        }
    },
   serviceMasterCreteSuccess: {
        httpCode: 200,
        body: {
            code: "DS_2001",
            message: "Service record created successfully"
        }
    },
    serviceMasterUpdateSuccess: {
        httpCode: 200,
        body: {
            code: "DS_2002",
            message: "Service record updated successfully"
        }
    },
    machineServiceCreateSuccess: {
        httpCode: 201,
        body: {
            code: "DS_2003",
            message: "Service record created for machine successfully"
        }
    },
    coolantNotificationSuccess: {
        httpCode: 201,
        body: {
            code: "DS_2004",
            message: "Coolant notifications sent successfully"
        }
    },
    dataCleanupSuccess: {
        httpCode: 201,
        body: {
            code: "DS_2004",
            message: "Data cleaned up successfully"
        }
    },
    validationError : (message) => {
        return (
            {
                httpCode: 400,
                body: {
                    code: "DS_4004",
                    message: message
                }
            }
        );        
    }
}