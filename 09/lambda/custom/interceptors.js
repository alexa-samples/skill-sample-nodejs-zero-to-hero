// i18n dependency
const i18n = require('i18next');
const languageStrings = require('./localisation');
const constants = require('./constants');

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

// This request interceptor will bind a translation function 't' to the handlerInput.
// Additionally it will handle picking a random value if instead of a string it receives an array
const LocalisationRequestInterceptor = {
    process(handlerInput) {
        const localisationClient = i18n.init({
            lng: handlerInput.requestEnvelope.request.locale,
            resources: languageStrings,
            returnObjects: true
        });
        localisationClient.localise = function localise() {
            const args = arguments;
            const value = i18n.t(...args);
            if (Array.isArray(value)) {
                return value[Math.floor(Math.random() * value.length)];
            }
            return value;
        };
        handlerInput.t = function translate(...args) {
            return localisationClient.localise(...args);
        }
    }
};

const LoadAttributesRequestInterceptor = {
    async process(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        if(requestEnvelope.session['new'] || !sessionAttributes['loaded']){ //is this a new session? not loaded from db?
            const persistentAttributes = await attributesManager.getPersistentAttributes() || {};
            console.log('Loading from persistent storage: ' + JSON.stringify(persistentAttributes));
            persistentAttributes['loaded'] = true;
            //copy persistent attribute to session attributes
            attributesManager.setSessionAttributes(persistentAttributes);
        }
    }
};

const SaveAttributesResponseInterceptor = {
    async process(handlerInput, response) {
        if(!response) return; // avoid intercepting calls that have no outgoing response due to errors
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const shouldEndSession = (typeof response.shouldEndSession === "undefined" ? true : response.shouldEndSession); //is this a session end?
        const loadedThisSession = sessionAttributes['loaded'];
        if((shouldEndSession || requestEnvelope.request.type === 'SessionEndedRequest') && loadedThisSession) { // skill was stopped or timed out
            delete sessionAttributes['loaded'];
            console.log('Saving to persistent storage:' + JSON.stringify(sessionAttributes));
            attributesManager.setPersistentAttributes(sessionAttributes);
            await attributesManager.savePersistentAttributes();
        }
    }
};

const LoadNameRequestInterceptor = {
    async process(handlerInput) {
        const {attributesManager, serviceClientFactory, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        if(!sessionAttributes['name']){
            // let's try to get the given name via the Customer Profile API
            // don't forget to enable this permission in your skill configuratiuon (Build tab -> Permissions)
            // or you'll get a SessionEndedRequest with an ERROR of type INVALID_RESPONSE
            try {
                const {permissions} = requestEnvelope.context.System.user;
                if(!permissions)
                    throw { statusCode: 401, message: 'No permissions available' }; // there are zero permissions, no point in intializing the API
                const upsServiceClient = serviceClientFactory.getUpsServiceClient();
                const profileName = await upsServiceClient.getProfileGivenName();
                if (profileName) { // the user might not have set the name
                    //save to session and persisten attributes
                    sessionAttributes['name'] = profileName;
                    attributesManager.setSessionAttributes(sessionAttributes);
                } else {
                    delete sessionAttributes['name'];
                }
            } catch (error) {
                console.log(JSON.stringify(error));
                delete sessionAttributes['name'];
                if (error.statusCode === 401 || error.statusCode === 403) {
                    // the user needs to enable the permissions for given name, let's send a silent permissions card.
                    handlerInput.responseBuilder
                    .withAskForPermissionsConsentCard(constants.GIVEN_NAME_PERMISSION);
                }
            }
        }
    }
};

const LoadTimezoneRequestInterceptor = {
    async process(handlerInput) {
        const {attributesManager, serviceClientFactory, requestEnvelope} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const deviceId = requestEnvelope.context.System.device.deviceId;

        if(!requestAttributes['timezone']){
            // let's try to get the timezone via the UPS API
            // (no permissions required but it might not be set up)
            try {
                const upsServiceClient = serviceClientFactory.getUpsServiceClient();
                const timezone = await upsServiceClient.getSystemTimeZone(deviceId);
                if (timezone) { // the user might not have set the timezone yet
                    console.log('Got timezone from device: ' + timezone);
                    //save to session and persisten attributes
                    requestAttributes['timezone'] = timezone;
                    attributesManager.setRequestAttributes(requestAttributes);
                } else {
                    delete requestAttributes['timezone'];
                }
            } catch (error) {
                console.log(JSON.stringify(error));
                delete requestAttributes['timezone'];
            }
        }
    }
};

module.exports = {
    LoggingRequestInterceptor,
    LoggingResponseInterceptor,
    LocalisationRequestInterceptor,
    LoadAttributesRequestInterceptor,
    SaveAttributesResponseInterceptor,
    LoadNameRequestInterceptor,
    LoadTimezoneRequestInterceptor
}
