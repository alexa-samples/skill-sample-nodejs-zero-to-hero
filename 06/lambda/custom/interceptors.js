// i18n dependencies. i18n is the main module, sprintf allows us to include variables with '%s'.
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

module.exports = {
    // This request interceptor will log all incoming requests to this lambda
    LoggingRequestInterceptor: {
        process(handlerInput) {
            console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
        }
    },

    // This response interceptor will log all outgoing responses of this lambda
    LoggingResponseInterceptor: {
        process(handlerInput, response) {
            console.log(`Outgoing response: ${JSON.stringify(response)}`);
        }
    },

    // This request interceptor will bind a translation function 't' to the requestAttributes.
    // Additionally it will handle picking a random value if instead of a string it receives an array
    LocalisationRequestInterceptor: {
        process(handlerInput) {
            const localisationClient = i18n.use(sprintf).init({
                lng: handlerInput.requestEnvelope.request.locale,
                resources: require('./localisation'),
            });
            localisationClient.localise = function localise() {
                const args = arguments;
                const values = [];
                for (let i = 1; i < args.length; i += 1) {
                    values.push(args[i]);
                }
                const value = i18n.t(args[0], {
                    returnObjects: true,
                    postProcess: 'sprintf',
                    sprintf: values,
                });
                if (Array.isArray(value)) {
                    return value[Math.floor(Math.random() * value.length)];
                }
                return value;
            };
            const attributes = handlerInput.attributesManager.getRequestAttributes();
            attributes.t = function translate(...args) {
                return localisationClient.localise(...args);
            }
        }
    },

    LoadAttributesRequestInterceptor: {
        async process(handlerInput) {
            if(handlerInput.requestEnvelope.session['new']){ //is this a new session?
                const {attributesManager} = handlerInput;
                const persistentAttributes = await attributesManager.getPersistentAttributes() || {};
                //copy persistent attribute to session attributes
                handlerInput.attributesManager.setSessionAttributes(persistentAttributes);
            }
        }
    },

    SaveAttributesResponseInterceptor: {
        async process(handlerInput, response) {
            if(!response) return; // avoid intercepting calls that have no outgoing response
            const {attributesManager} = handlerInput;
            const sessionAttributes = attributesManager.getSessionAttributes();
            const shouldEndSession = (typeof response.shouldEndSession === "undefined" ? true : response.shouldEndSession); //is this a session end?
            if(shouldEndSession || handlerInput.requestEnvelope.request.type === 'SessionEndedRequest') { // skill was stopped or timed out            
                attributesManager.setPersistentAttributes(sessionAttributes);
                await attributesManager.savePersistentAttributes();
            }
        }
    }
}