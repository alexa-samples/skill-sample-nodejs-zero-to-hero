const Alexa = require('ask-sdk-core');
// i18n library dependency, we use it below in a localisation interceptor
const i18n = require('i18next');

/* *
 * We create a language strings object containing all of our strings.
 * The keys for each string will then be referenced in our code, e.g. handlerInput.t('WELCOME_MSG')
 * Later we'll move these string to a separate file to avoid polluting index.js 
 * */
const languageStrings = {
    en: {
        translation: {
            WELCOME_MSG: `Welcome to Happy Birthday. Let's have some fun with your birthday! `,
            REGISTER_MSG: 'Your birthday is {{month}} {{day}} {{year}}.',
            REJECTED_MSG: 'No problem. Please say the date again so I can get it right.',
            HELP_MSG: `You can tell me your date of birth and I'll take note. You can also just say, register my birthday and I will guide you. Which one would you like to try?`,
            GOODBYE_MSG: 'Goodbye!',
            REFLECTOR_MSG: 'You just triggered {{intent}}',
            FALLBACK_MSG: 'Sorry, I don\'t know about that. Please try again.',
            ERROR_MSG: 'Sorry, there was an error. Please try again.'
        }
    },
    it: {
        translation: {
            WELCOME_MSG: `Benvenuto a Buon Compleanno. Esploreremo un paio di funzionalità usando la tua data di nascita! `,
            REGISTER_MSG: 'Il tuo compleanno è il {{day}} di {{month}}, {{year}}.',
            REJECTED_MSG: 'Nessun problema. Per favore ridimmi la data e sistemiamo subito.',
            HELP_MSG: `Dimmi la tua data di nascita e me la segnerò. Altrimenti puoi chiedermi di ricordarti il tuo compleanno e ti guido io passo per passo. Come preferisci procedere?`,
            GOODBYE_MSG: 'A presto!',
            REFLECTOR_MSG: 'Hai invocato l\'intento {{intent}}',
            FALLBACK_MSG: 'Perdonami, penso di non aver capito bene. Riprova.',
            ERROR_MSG: 'Scusa, c\'è stato un errore. Riprova.'
        }
    },    
    es: {
        translation: {
            WELCOME_MSG: 'Te doy la bienvenida a Feliz Cumpleaños. Vamos a divertirnos un poco con tu cumpleaños! ',
            REGISTER_MSG: 'Tu fecha de cumpleaños es el {{day}} de {{month}} de {{year}}.',
            REJECTED_MSG: 'No pasa nada. Por favor dime la fecha otra vez y lo corregimos.',
            HELP_MSG: 'Puedes decirme el día, mes y año de tu nacimiento y tomaré nota de ello. También puedes decirme, registra mi cumpleaños y te guiaré. Qué quieres hacer?',
            GOODBYE_MSG: 'Hasta luego!',
            REFLECTOR_MSG: 'Acabas de activar {{intent}}',
            FALLBACK_MSG: 'Lo siento, no se nada sobre eso. Por favor inténtalo otra vez.',
            ERROR_MSG: 'Lo siento, ha habido un problema. Por favor inténtalo otra vez.'
        }
    },
    fr:{
        translation: {
            WELCOME_MSG: 'Bienvenue sur la Skill des anniversaires! ',
            REGISTER_MSG: 'Votre date de naissance est le {{day}} {{month}} {{year}}.',
            REJECTED_MSG: 'D\'accord, je ne vais pas prendre en compte cette date. Dites-moi une autre date pour que je puisse l\'enregistrer.',
            HELP_MSG: 'Je peux me souvenir de votre date de naissance. Dites-moi votre jour, mois et année de naissance ou bien dites-moi simplement \'"enregistre mon anniversaire"\' et je vous guiderai. Quel est votre choix ?',
            GOODBYE_MSG: 'Au revoir!',
            REFLECTOR_MSG: 'Vous avez invoqué l\'intention {{intent}}',
            FALLBACK_MSG: 'Désolé, je ne sais pas répondre à votre demande. Pouvez-vous reformuler?.',
            ERROR_MSG: 'Désolé, je n\'ai pas compris. Pouvez-vous reformuler?'
        }
    },
    "fr-CA": {
        translation: {
            WELCOME_MSG: 'Bienvenue sur la Skill des fêtes! ',
            HELP_MSG: 'Je peux me souvenir de votre date de naissance. Dites-moi votre jour, mois et année de naissance ou bien dites-moi simplement \'sauve ma fête\' et je vous guiderai. Quel est votre choix ?',
        }
    }
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = handlerInput.t('WELCOME_MSG');

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
        const {requestEnvelope, responseBuilder} = handlerInput;
        const {intent} = requestEnvelope.request;

        let speechText = handlerInput.t('REJECTED_MSG');

        if (intent.confirmationStatus === 'CONFIRMED') {
            const day = Alexa.getSlotValue(requestEnvelope, 'day');
            const year = Alexa.getSlotValue(requestEnvelope, 'year');
            const month = Alexa.getSlotValue(requestEnvelope, 'month');

            speechText = handlerInput.t('REGISTER_MSG', {day: day, month: month, year: year}); // we'll save these values in the next module
        } else {
            const repromptText = handlerInput.t('HELP_MSG');
            responseBuilder.reprompt(repromptText);
        }
        
        return responseBuilder
            .speak(speechText)
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
        const speechText = handlerInput.t('GOODBYE_MSG');

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
            .reprompt(handlerInput.t('HELP_MSG'))
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
            .reprompt(handlerInput.t('HELP_MSG'))
            .getResponse();
    }
};

// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    }
};

// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

// This request interceptor will bind a translation function 't' to the handlerInput
const LocalisationRequestInterceptor = {
    process(handlerInput) {
        i18n.init({
            lng: Alexa.getLocale(handlerInput.requestEnvelope),
            resources: languageStrings
        }).then((t) => {
            handlerInput.t = (...args) => t(...args);
        });
    }
};
/* *
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        RegisterBirthdayIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        LocalisationRequestInterceptor,
        LoggingRequestInterceptor)
    .addResponseInterceptors(
        LoggingResponseInterceptor)
    .withCustomUserAgent('sample/happy-birthday/mod3')
    .lambda();
