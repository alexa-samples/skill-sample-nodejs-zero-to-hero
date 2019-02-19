// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const persistence = require('./persistence');
const interceptors = require('./interceptors');
const logic = require('./logic');
const constants = require('./constants');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const {attributesManager, serviceClientFactory, requestEnvelope} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();

        const day = sessionAttributes['day'];
        const month = sessionAttributes['month'];
        const monthName = sessionAttributes['monthName'];
        const year = sessionAttributes['year'];

        if(!sessionAttributes['name']){
            // let's try to get the given name via the Customer Profile API
            // don't forget to enable this permission in your skill configuratiuon (Build tab -> Permissions)
            // or you'll get a SessionEnndedRequest with an ERROR of type INVALID_RESPONSE
            try {
                const {permissions} = requestEnvelope.context.System.user;
                if(!permissions)
                    throw { statusCode: 401, message: 'No permissions available' }; // there are zero permissions in the skill, no point in intializing the API
                const upsServiceClient = serviceClientFactory.getUpsServiceClient();
                const profileName = await upsServiceClient.getProfileGivenName();
                if (profileName) { // the user might not have set the name
                  //save to session and persisten attributes
                  sessionAttributes['name'] = profileName;
                }

            } catch (error) {
                console.log(JSON.stringify(error));
                if (error.statusCode === 401 || error.statusCode === 403) {
                    // the user needs to enable the permissions for given name, let's send a silent permissions card.
                  handlerInput.responseBuilder.withAskForPermissionsConsentCard(constants.GIVEN_NAME_PERMISSION);
                }
            }
        }

        const name = sessionAttributes['name'] ? sessionAttributes['name'] : '';

        let speechText = requestAttributes.t('WELCOME_MSG', name);

        if(day && month && year){
            speechText = requestAttributes.t('REGISTER_MSG', name?name+'.':'', day, monthName, year) + requestAttributes.t('HELP_MSG');
        }
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const RegisterBirthdayIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'RegisterBirthdayIntent';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = handlerInput.requestEnvelope.request;

        const day = intent.slots.day.value;
        const month = intent.slots.month.resolutions.resolutionsPerAuthority[0].values[0].value.id;
        const monthName = intent.slots.month.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        const year = intent.slots.year.value;
        
        sessionAttributes['day'] = day;
        sessionAttributes['month'] = month;
        sessionAttributes['monthName'] = monthName;
        sessionAttributes['year'] = year;
        const name = sessionAttributes['name'] ? sessionAttributes['name'] : '';

        return handlerInput.responseBuilder
            .speak(requestAttributes.t('REGISTER_MSG', name?name+'.':'', day, monthName, year) + requestAttributes.t('HELP_MSG'))
            .reprompt(requestAttributes.t('HELP_MSG'))
            .getResponse();
    }
};

const CelebrityBirthdayIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'CelebrityBirthdayIntent';
    },
    async handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        const name = sessionAttributes['name'] ? sessionAttributes['name'] : '';

        const serviceClientFactory = handlerInput.serviceClientFactory;
        const deviceId = handlerInput.requestEnvelope.context.System.device.deviceId;

        // let's try to get the timezone via the UPS API
        // (no permissions required but it might not be set up)
        let timezone;
        try {
            const upsServiceClient = serviceClientFactory.getUpsServiceClient();
            timezone = await upsServiceClient.getSystemTimeZone(deviceId);
        } catch (error) {
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('NO_TIMEZONE_MSG'))
                .getResponse();
        }
        console.log('Got timezone: ' + timezone);

        try {
            // call the progressive response service
            await logic.callDirectiveService(handlerInput, requestAttributes.t('PROGRESSIVE_MSG'));
          } catch (error) {
            // if it fails we can continue, just the user will wait as if there's no progressive response
            console.log("Progressive directive error : " + error);
        }

        const dateData = logic.getAdjustedDateData(timezone);
        const response = await logic.fetchBirthdayData(dateData.day, dateData.month, 5);

        let speechText = requestAttributes.t('API_ERROR_MSG');
        if(response) {
            console.log(JSON.stringify(response));
            const results = response.results.bindings;
            speechText = requestAttributes.t('TODAY_BIRTHDAYS_MSG');
            results.forEach((person, index) => {
                console.log(person);
                if(index === Object.keys(results).length - 2)
                    speechText += person.humanLabel.value + requestAttributes.t('CONJUNCTION_MSG');
                else
                    speechText += person.humanLabel.value + '. '
            });
            //response.results.bindings
            //human, picture, date_of_birth, humanLabel
        }

        return handlerInput.responseBuilder
            .speak(speechText + requestAttributes.t('HELP_MSG'))
            .reprompt(requestAttributes.t('HELP_MSG'))
            .getResponse();
    }
};

const SayBirthdayIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'SayBirthdayIntent';
    },
    async handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();

        const day = sessionAttributes['day'];
        const month = sessionAttributes['month'];
        const year = sessionAttributes['year'];
        const name = sessionAttributes['name'] ? sessionAttributes['name'] : '';
        
        let speechText;
        if(day && month && year){
            const serviceClientFactory = handlerInput.serviceClientFactory;
            const deviceId = handlerInput.requestEnvelope.context.System.device.deviceId;
    
            // let's try to get the timezone via the UPS API
            // (no permissions required but it might not be set up)
           let timezone;
            try {
                const upsServiceClient = serviceClientFactory.getUpsServiceClient();
                timezone = await upsServiceClient.getSystemTimeZone(deviceId);
            } catch (error) {
                return handlerInput.responseBuilder
                    .speak(requestAttributes.t('NO_TIMEZONE_MSG'))
                    .getResponse();
            }
            console.log('Got timezone: ' + timezone);

            const birthdayData = logic.getBirthdayData(day, month, year, timezone);

            speechText = requestAttributes.t('SAY_MSG', name?name+'.':'', birthdayData.daysUntilBirthday, birthdayData.age + 1);
            if(birthdayData.daysUntilBirthday === 0) {
                speechText = requestAttributes.t('GREET_MSG', name, birthdayData.age);
            }
            speechText += requestAttributes.t('OVERWRITE_MSG');
        } else {
            speechText = requestAttributes.t('MISSING_MSG');
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(requestAttributes.t('HELP_MSG'))
            .getResponse();
    }
};

const RemindBirthdayIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'RemindBirthdayIntent';
    },
    async handle(handlerInput) {
        const {attributesManager, serviceClientFactory, requestEnvelope} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = handlerInput.requestEnvelope.request;

        const day = sessionAttributes['day'];
        const month = sessionAttributes['month'];
        const year = sessionAttributes['year'];
        const name = sessionAttributes['name'] ? sessionAttributes['name'] : '';
        const message = intent.slots.message.value;

        if(intent.confirmationStatus !== 'CONFIRMED') {
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('CANCEL_MSG') + requestAttributes.t('HELP_MSG'))
                .reprompt(requestAttributes.t('HELP_MSG'))
                .getResponse();
        }
        
        let speechText;
        if(day && month && year){
            const deviceId = handlerInput.requestEnvelope.context.System.device.deviceId;
            // let's try to get the timezone via the UPS API
            // (no permissions required but it might not be set up)
            let timezone;
            try {
                const upsServiceClient = serviceClientFactory.getUpsServiceClient();
                timezone = await upsServiceClient.getSystemTimeZone(deviceId);
            } catch (error) {
                return handlerInput.responseBuilder
                    .speak(requestAttributes.t('NO_TIMEZONE_MSG'))
                    .getResponse();
            }
            console.log('Got timezone: ' + timezone);

            const birthdayData = logic.getBirthdayData(day, month, year, timezone);

            // let's try to create a reminder via the Reminders API
            // don't forget to enable this permission in your skill configuratiuon (Build tab -> Permissions)
            // or you'll get a SessionEnndedRequest with an ERROR of type INVALID_RESPONSE
            try {
                const {permissions} = requestEnvelope.context.System.user;
                if(!permissions)
                    throw { statusCode: 401, message: 'No permissions available' }; // there are zero permissions in the skill, no point in intializing the API
                const reminderServiceClient = serviceClientFactory.getReminderManagementServiceClient();
                // reminders are retained for 3 days after they 'remind' the customer before being deleted
                const remindersList = await reminderServiceClient.getReminders();
                console.log(JSON.stringify(remindersList));
                const remindersCount = remindersList.totalCount;
                // delete previous reminder if present
                if(sessionAttributes['reminderId']){
                    await reminderServiceClient.deleteReminder(sessionAttributes['reminderId']);
                    delete sessionAttributes['reminderId'];
                }
                // create reminder structure
                const reminder = logic.createReminderData(
                    birthdayData.daysUntilBirthday,
                    timezone,
                    requestEnvelope.request.locale,
                    message); 
                const reminderResponse = await reminderServiceClient.createReminder(reminder); // the response will include an "alertToken" which you can use to refer to this reminder
                // save reminder id in session attributes
                sessionAttributes['reminderId'] = reminderResponse.alertToken;

                speechText = requestAttributes.t('REMINDER_CREATED_MSG') + requestAttributes.t('HELP_MSG');

            } catch (error) {
                console.log(JSON.stringify(error));
                switch (error.statusCode) {
                    case 401: // the user has to enable the permissions for reminders, let's attach a permissions card to the response
                        handlerInput.responseBuilder.withAskForPermissionsConsentCard(constants.REMINDERS_PERMISSION);
                        speechText = requestAttributes.t('MISSING_PERMISSION_MSG') + requestAttributes.t('HELP_MSG');
                        break;
                    case 403: // devices such as the simulator do not support reminder management
                        speechText = requestAttributes.t('UNSUPPORTED_DEVICE_MSG') + requestAttributes.t('HELP_MSG');
                        break;
                    default:
                        speechText = requestAttributes.t('REMINDER_ERROR_MSG') + requestAttributes.t('HELP_MSG');
                }
            }
        }
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(requestAttributes.t('HELP_MSG'))
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const speechText = requestAttributes.t('HELP_MSG');

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();

        const name = sessionAttributes['name'] ? sessionAttributes['name'] : '';

        const speechText = requestAttributes.t('GOODBYE_MSG', name);

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const speechText = requestAttributes.t('FALLBACK_MSG');

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = requestAttributes.t('REFLECTOR_MSG', intentName);

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const speechText = requestAttributes.t('ERROR_MSG');

        console.log(`~~~~ Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        RegisterBirthdayIntentHandler,
        SayBirthdayIntentHandler,
        RemindBirthdayIntentHandler,
        CelebrityBirthdayIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
        .addRequestInterceptors(
            interceptors.LocalisationRequestInterceptor,
            interceptors.LoggingRequestInterceptor,
            interceptors.LoadAttributesRequestInterceptor)
        .addResponseInterceptors(
            interceptors.LoggingResponseInterceptor,
            interceptors.SaveAttributesResponseInterceptor)
        .withPersistenceAdapter(persistence.getPersistenceAdapter())
        .withApiClient(new Alexa.DefaultApiClient())
        .lambda();