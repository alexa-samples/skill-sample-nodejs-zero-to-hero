// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
var persistenceAdapter = getPersistenceAdapter();
const moment = require('moment-timezone'); // will help us do all the birthday math

// i18n dependencies. i18n is the main module, sprintf allows us to include variables with '%s'.
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

// We create a language strings object containing all of our strings. 
// The keys for each string will then be referenced in our code
// e.g. requestAttributes.t('WELCOME_MESSAGE')
const languageStrings = {
  es:{
    translation: {
      WELCOME_MESSAGE: 'Bienvenido! Dime. Cuando es tu fecha de cumpleaños? ',
      REGISTER_MESSAGE: 'Recordaré que tu fecha de cumpleaños es el %s de %s de %s. ',
      TELL_MESSAGE: 'Quedan %s días para que cumplas %s años. ',
      GREET_MESSAGE: 'Feliz cumpleaños! Hoy cumples %s! ',
      MISSING_MESSAGE: 'Parece que aun no me has dicho tu fecha de cumpleaños. Prueba decir, registra mi cumpleaños. ',
      CONTINUE_MESSAGE: 'Puedes continuar diciendo, cuanto falta para mi cumpleaños? . O volver a registar la fecha diciendo, registra mi cumpleaños. ',
      OVERWRITE_MESSAGE: 'Si quieres cambiar la fecha solo di, registra mi cumpleaños',
      HELP_MESSAGE: 'Por favor dime el día, mes y año de tu nacimiento o sino pregunta, cuanto falta para mi cumpleaños? ',
      GOODBYE_MESSAGE: 'Hasta luego! ',
      REFLECTOR_MESSAGE: 'Acabas de activar %s ',
      FALLBACK_MESSAGE: 'Lo siento, no se nada sobre eso. Por favor inténtalo otra vez. ',
      ERROR_MESSAGE: 'Lo siento, ha habido un problema. Por favor inténtalo otra vez. '
    }
  }
}

function getPersistenceAdapter() {
    // This function is an indirect way to detect if this is part of an Alexa-Hosted skill
    function isAlexaHosted() {
        return process.env.S3_PERSISTENCE_BUCKET ? true : false;
    }
    const tableName = 'happy_birthday_table';
    if(isAlexaHosted()) {
        const {S3PersistenceAdapter} = require('ask-sdk-s3-persistence-adapter');
        return new S3PersistenceAdapter({ 
            bucketName: process.env.S3_PERSISTENCE_BUCKET
        });
    } else {
        // IMPORTANT: don't forget to give DynamoDB access to the role you're to run this lambda (IAM)
        const {DynamoDbPersistenceAdapter} = require('ask-sdk-dynamodb-persistence-adapter');
        return new DynamoDbPersistenceAdapter({ 
            tableName: tableName,
            createTable: true
        });
    }
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        let speechText = requestAttributes.t('WELCOME_MESSAGE');

        if(sessionAttributes["day"] && sessionAttributes["month"] && sessionAttributes["year"]){
            return TellBirthdayIntentHandler.handle(handlerInput);
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
    async handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const {intent} = handlerInput.requestEnvelope.request;

        const day = intent.slots.day.value;
        //const month = intent.slots.month.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        const month = intent.slots.month.resolutions.resolutionsPerAuthority[0].values[0].value.id;
        const monthName = intent.slots.month.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        const year = intent.slots.year.value;
        
        let birthdayAttributes = {
            "year": year,
            "month": month,
            "day": day
        };

        attributesManager.setPersistentAttributes(birthdayAttributes);
        await attributesManager.savePersistentAttributes();    

        const speechText = requestAttributes.t('REGISTER_MESSAGE', day, monthName, year) + requestAttributes.t('CONTINUE_MESSAGE');
        //const speechText = `Recordaré que tu fecha de cumpleaños es el ${day} de ${month} de ${year}. Puedes continuar diciendo, cuanto falta para mi cumpleaños? . O volver a registar la fecha diciendo, registra mi cumpleaños`;
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const TellBirthdayIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'TellBirthdayIntent';
    },
    async handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        let speechText;
        if(sessionAttributes["day"] && sessionAttributes["month"] && sessionAttributes["year"]){
            const serviceClientFactory = handlerInput.serviceClientFactory;
            const deviceId = handlerInput.requestEnvelope.context.System.device.deviceId;
    
            const day = sessionAttributes['day'];
            const month = sessionAttributes['month'];
            const year = sessionAttributes['year'];

            let timezone;
            try {
                const upsServiceClient = serviceClientFactory.getUpsServiceClient();
                timezone = await upsServiceClient.getSystemTimeZone(deviceId); 
            } catch (error) {
                if (error.name !== 'ServiceError') {
                    //return handlerInput.responseBuilder.speak("No he podido determinar tu zona horaria. Inténtalo otra vez.").getResponse();
                    timezone = 'Europe/Madrid'; // so it works on the simulator, replace with line above once done with testing
                }
            }
            
            const today = moment().tz(timezone).startOf('day');
            const wasBorn = moment(`${month}/${day}/${year}`, "MM/DD/YYYY").tz(timezone).startOf('day');
            const nextBirthday = moment(`${month}/${day}/${today.year()}`, "MM/DD/YYYY").tz(timezone).startOf('day');
            if(today.isAfter(nextBirthday)){
                nextBirthday.add('years', 1);
            }
            const yearsOld = today.diff(wasBorn, 'years');
            const days = nextBirthday.startOf('day').diff(today, 'days'); // same days returns 0
            speechText = requestAttributes.t('TELL_MESSAGE', days, yearsOld+1);
            if(days === 0) {
                speechText = requestAttributes.t('GREET_MESSAGE', yearsOld);
            }
            speechText += requestAttributes.t('OVERWRITE_MESSAGE');
        } else {
            speechText = requestAttributes.t('MISSING_MESSAGE');
        }
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
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
        const speechText = requestAttributes.t('HELP_MESSAGE');

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
        const speechText = requestAttributes.t('GOODBYE_MESSAGE');

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
        const speechText = requestAttributes.t('FALLBACK_MESSAGE');

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
        const speechText = requestAttributes.t('REFLECTOR_MESSAGE', intentName);

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
        const speechText = requestAttributes.t('ERROR_MESSAGE');

        console.log(`~~~~ Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
      console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

// This request interceptor will bind a translation function 't' to the requestAttributes.
const LocalizationRequestInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      fallbackLng: 'es',
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageStrings,
      returnObjects: true
    });

    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    }
  }
}

const LoadBirthdayRequestInterceptor = {
    async process(handlerInput) {
        const {attributesManager} = handlerInput;
        const attributes = await attributesManager.getPersistentAttributes() || {};
        
        const day = attributes['day'];
        const month = attributes['month'];
        const year = attributes['year'];
        
        if (year && month && day) {
            attributesManager.setSessionAttributes(attributes);
        }
    }
}

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        RegisterBirthdayIntentHandler,
        TellBirthdayIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
        .addRequestInterceptors(
            LocalizationRequestInterceptor,
            LoggingRequestInterceptor,
            LoadBirthdayRequestInterceptor)
        .addResponseInterceptors(
            LoggingResponseInterceptor)
        .withPersistenceAdapter(persistenceAdapter)
        .lambda();