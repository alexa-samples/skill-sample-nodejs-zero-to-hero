// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const persistence = require('./persistence');
const interceptors = require('./interceptors');
const logic = require('./logic');

// these are the permissions needed to send reminders
const REMINDERS_PERMISSION = ['alexa::alerts:reminders:skill:readwrite'];

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const {attributesManager, serviceClientFactory, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();

        const day = sessionAttributes['day'];
        const month = sessionAttributes['month']; //MM
        const monthName = sessionAttributes['monthName'];
        const year = sessionAttributes['year'];
        const name = sessionAttributes['name'] ? sessionAttributes['name'] + '.' : '';

        let speechText = handlerInput.t('WELCOME_MSG', {name: name+'.'});

        if(day && monthName && year){
            speechText = handlerInput.t('REGISTER_MSG', {name: name, day: day, month: monthName, year: year}) + handlerInput.t('HELP_MSG');
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('HELP_MSG'))
            .getResponse();
    }
};

const RegisterBirthdayIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'RegisterBirthdayIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;

        const day = intent.slots.day.value;
        const month = intent.slots.month.resolutions.resolutionsPerAuthority[0].values[0].value.id; //MM
        const monthName = intent.slots.month.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        const year = intent.slots.year.value;

        sessionAttributes['day'] = day;
        sessionAttributes['month'] = month; //MM
        sessionAttributes['monthName'] = monthName;
        sessionAttributes['year'] = year;
        const name = sessionAttributes['name'] ? sessionAttributes['name'] + '. ' : '';

        const speechText = handlerInput.t('REGISTER_MSG', {name: name, day: day, month: monthName, year: year}) + handlerInput.t('HELP_MSG');

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('HELP_MSG'))
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
        const month = sessionAttributes['month']; //MM
        const year = sessionAttributes['year'];
        const name = sessionAttributes['name'] ? sessionAttributes['name'] + '. ' : '';
        let timezone = requestAttributes['timezone'];

        let speechText;
        if(day && month && year){
            if(!timezone){
                //timezone = 'Europe/Madrid';  // so it works on the simulator, you should uncomment this line, replace with your time zone and comment sentence below
                return handlerInput.responseBuilder
                    .speak(handlerInput.t('NO_TIMEZONE_MSG'))
                    .getResponse();
            }

            const birthdayData = logic.getBirthdayData(day, month, year, timezone);
            speechText = handlerInput.t('DAYS_LEFT_MSG', {name: name, count: birthdayData.daysUntilBirthday});
            speechText += handlerInput.t('WILL_TURN_MSG', {count: birthdayData.age + 1});
            if(birthdayData.daysUntilBirthday === 0) { // it's the user's birthday!
                speechText = handlerInput.t('GREET_MSG', {name: name});
                speechText += handlerInput.t('NOW_TURN_MSG', {count: birthdayData.age});
            }
            speechText += handlerInput.t('OVERWRITE_MSG');
        } else {
            speechText = handlerInput.t('MISSING_MSG');
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('HELP_MSG'))
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
        let timezone = requestAttributes['timezone'];
        const message = intent.slots.message.value;

        if(intent.confirmationStatus !== 'CONFIRMED') {

            return handlerInput.responseBuilder
                .speak(handlerInput.t('CANCEL_MSG') + handlerInput.t('HELP_MSG'))
                .reprompt(handlerInput.t('HELP_MSG'))
                .getResponse();
        }

        let speechText;
        if(day && month && year){
            if(!timezone){
                //timezone = 'Europe/Madrid';  // so it works on the simulator, you should uncomment this line, replace with your time zone and comment sentence below
                return handlerInput.responseBuilder
                    .speak(handlerInput.t('NO_TIMEZONE_MSG'))
                    .getResponse();
            }

            const birthdayData = logic.getBirthdayData(day, month, year, timezone);

            // let's try to create a reminder via the Reminders API
            // don't forget to enable this permission in your skill configuratiuon (Build tab -> Permissions)
            // or you'll get a SessionEnndedRequest with an ERROR of type INVALID_RESPONSE
            try {
                const {permissions} = requestEnvelope.context.System.user;
                if(!permissions)
                    throw { statusCode: 401, message: 'No permissions available' }; // there are zero permissions, no point in intializing the API
                const reminderServiceClient = serviceClientFactory.getReminderManagementServiceClient();
                // reminders are retained for 3 days after they 'remind' the customer before being deleted
                const remindersList = await reminderServiceClient.getReminders();
                console.log('Current reminders: ' + JSON.stringify(remindersList));
                console.log(JSON.stringify(remindersList));
                // delete previous reminder if present
                const previousReminder = sessionAttributes['reminderId'];
                if(previousReminder){
                    await reminderServiceClient.deleteReminder(previousReminder);
                    delete sessionAttributes['reminderId'];
                    console.log('Deleted previous reminder with token: ' + previousReminder);
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
                console.log('Reminder created with token: ' + reminderResponse.alertToken);
                speechText = handlerInput.t('REMINDER_CREATED_MSG') + handlerInput.t('HELP_MSG');
            } catch (error) {
                console.log(JSON.stringify(error));
                switch (error.statusCode) {
                    case 401: // the user has to enable the permissions for reminders, let's attach a permissions card to the response
                        handlerInput.responseBuilder.withAskForPermissionsConsentCard(REMINDERS_PERMISSION);
                        speechText = handlerInput.t('MISSING_PERMISSION_MSG') + handlerInput.t('HELP_MSG');
                        break;
                    case 403: // devices such as the simulator do not support reminder management
                        speechText = handlerInput.t('UNSUPPORTED_DEVICE_MSG') + handlerInput.t('HELP_MSG');
                        break;
                    //case 405: METHOD_NOT_ALLOWED, please contact the Alexa team
                    default:
                        speechText = handlerInput.t('REMINDER_ERROR_MSG') + handlerInput.t('HELP_MSG');
                }
            }
        } else {
            speechText = handlerInput.t('MISSING_MSG') + handlerInput.t('HELP_MSG');
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('HELP_MSG'))
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = handlerInput.t('HELP_MSG');

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
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const name = sessionAttributes['name'] ? sessionAttributes['name'] : '';

        const speechText = handlerInput.t('GOODBYE_MSG', {name: name});

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
        const speechText = handlerInput.t('FALLBACK_MSG');

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('HELP_MSG'))
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
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
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = handlerInput.t('REFLECTOR_MSG', {intent: intentName});

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
        const speechText = handlerInput.t('ERROR_MSG');

        console.log(`~~~~ Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('HELP_MSG'))
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
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        interceptors.LocalisationRequestInterceptor,
        interceptors.LoggingRequestInterceptor,
        interceptors.LoadAttributesRequestInterceptor,
        interceptors.LoadNameRequestInterceptor,
        interceptors.LoadTimezoneRequestInterceptor)
    .addResponseInterceptors(
        interceptors.LoggingResponseInterceptor,
        interceptors.SaveAttributesResponseInterceptor)
    .withPersistenceAdapter(persistence.getPersistenceAdapter())
    .withApiClient(new Alexa.DefaultApiClient())
    .lambda();