const Alexa = require('ask-sdk-core');
const util = require('./util'); // utility functions
const interceptors = require('./interceptors');
const moment = require('moment-timezone'); // will help us do all the birthday math

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        const day = sessionAttributes['day'];
        const monthName = sessionAttributes['monthName'];
        const year = sessionAttributes['year'];
        const name = sessionAttributes['name'] || '';
        const sessionCounter = sessionAttributes['sessionCounter'];

        const dateAvailable = day && monthName && year;
        if (dateAvailable){
            // we can't use intent chaining because the target intent is not dialog based
            return SayBirthdayIntentHandler.handle(handlerInput);
        }

        let speechText = !sessionCounter ? handlerInput.t('WELCOME_MSG', {name: name}) : handlerInput.t('WELCOME_BACK_MSG', {name: name});
        speechText += handlerInput.t('MISSING_MSG');

        // we use intent chaining to trigger the birthday registration multi-turn
        return handlerInput.responseBuilder
            .speak(speechText)
            // we use intent chaining to trigger the birthday registration multi-turn
            .addDelegateDirective({
                name: 'RegisterBirthdayIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
            .getResponse();
    }
};

const RegisterBirthdayIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RegisterBirthdayIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        // the attributes manager allows us to access session attributes
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;

        if (intent.confirmationStatus === 'CONFIRMED') {
            const day = Alexa.getSlotValue(requestEnvelope, 'day');
            const year = Alexa.getSlotValue(requestEnvelope, 'year');
            // we get the slot instead of the value directly as we also want to fetch the id
            const monthSlot = Alexa.getSlot(requestEnvelope, 'month');
            const monthName = monthSlot.value;
            const month = monthSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id; //MM

            sessionAttributes['day'] = day;
            sessionAttributes['month'] = month; //MM
            sessionAttributes['monthName'] = monthName;
            sessionAttributes['year'] = year;
            // we can't use intent chaining because the target intent is not dialog based
            return SayBirthdayIntentHandler.handle(handlerInput);
        }

        return handlerInput.responseBuilder
            .speak(handlerInput.t('REJECTED_MSG'))
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};

const SayBirthdayIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SayBirthdayIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        const day = sessionAttributes['day'];
        const month = sessionAttributes['month']; //MM
        const year = sessionAttributes['year'];
        const name = sessionAttributes['name'] || '';
        let timezone = sessionAttributes['timezone'];

        let speechText = '';
        const dateAvailable = day && month && year;
        if (dateAvailable){
            if (!timezone){
                //timezone = 'Europe/Rome';  // so it works on the simulator, you should uncomment this line, replace with your time zone and comment sentence below
                return handlerInput.responseBuilder
                    .speak(handlerInput.t('NO_TIMEZONE_MSG'))
                    .getResponse();
            }
            const today = moment().tz(timezone).startOf('day');
            const wasBorn = moment(`${month}/${day}/${year}`, "MM/DD/YYYY").tz(timezone).startOf('day');
            const nextBirthday = moment(`${month}/${day}/${today.year()}`, "MM/DD/YYYY").tz(timezone).startOf('day');
            if (today.isAfter(nextBirthday)){
                nextBirthday.add(1, 'years');
            }
            const age = today.diff(wasBorn, 'years');
            const daysUntilBirthday = nextBirthday.startOf('day').diff(today, 'days'); // same day returns 0
            speechText = handlerInput.t('DAYS_LEFT_MSG', {name: name, count: daysUntilBirthday});
            speechText += handlerInput.t('WILL_TURN_MSG', {count: age + 1});
            if (daysUntilBirthday === 0) { // it's the user's birthday!
                speechText = handlerInput.t('GREET_MSG', {name: name});
                speechText += handlerInput.t('NOW_TURN_MSG', {count: age});
            }
            speechText += handlerInput.t('POST_SAY_HELP_MSG');
        } else {
            speechText += handlerInput.t('MISSING_MSG');
            // we use intent chaining to trigger the birthday registration multi-turn
            handlerInput.responseBuilder.addDelegateDirective({
                name: 'RegisterBirthdayIntent',
                confirmationStatus: 'NONE',
                slots: {}
            });
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
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
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const name = sessionAttributes['name'] || '';
        const speechText = handlerInput.t('GOODBYE_MSG', {name: name});

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speechText = handlerInput.t('FALLBACK_MSG');

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speechText = handlerInput.t('REFLECTOR_MSG', {intent: intentName});

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speechText = handlerInput.t('ERROR_MSG');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};
/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        RegisterBirthdayIntentHandler,
        SayBirthdayIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        interceptors.LoadAttributesRequestInterceptor,
        interceptors.LocalisationRequestInterceptor,
        interceptors.LoggingRequestInterceptor,
        interceptors.LoadNameRequestInterceptor,
        interceptors.LoadTimezoneRequestInterceptor)
    .addResponseInterceptors(
        interceptors.LoggingResponseInterceptor,
        interceptors.SaveAttributesResponseInterceptor)
    .withPersistenceAdapter(util.getPersistenceAdapter())
    .withApiClient(new Alexa.DefaultApiClient())
    .withCustomUserAgent('sample/happy-birthday/mod5')
    .lambda();
