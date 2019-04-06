const moment = require('moment-timezone'); // will help us do all the birthday math
const axios = require('axios');

module.exports = {
    getAdjustedDateData(timezone) {
        const today = moment().tz(timezone).startOf('day');

        return {
            day: today.date(),
            month: today.month() + 1
        }
    },
    getBirthdayData(day, month, year, timezone) {
        const today = moment().tz(timezone).startOf('day');
        const wasBorn = moment(`${month}/${day}/${year}`, "MM/DD/YYYY").tz(timezone).startOf('day');
        const nextBirthday = moment(`${month}/${day}/${today.year()}`, "MM/DD/YYYY").tz(timezone).startOf('day');
        if(today.isAfter(nextBirthday))
            nextBirthday.add('years', 1);
        const age = today.diff(wasBorn, 'years');
        const daysAlive = today.diff(wasBorn, 'days');
        const daysUntilBirthday = nextBirthday.startOf('day').diff(today, 'days'); // same days returns 0

        return {
            daysAlive: daysAlive,
            daysUntilBirthday: daysUntilBirthday,
            age: age //in years
        }
    },
    createReminderData(daysUntilBirthday, timezone, locale, message) {
        moment.locale(locale);
        const now = moment().tz(timezone);
        const scheduled = now.startOf('day').add(daysUntilBirthday, 'days');
        console.log('Reminder schedule: ' + scheduled.format('YYYY-MM-DDTHH:mm:00.000'));

        return {
            requestTime: now.format('YYYY-MM-DDTHH:mm:00.000'),
            trigger: {
                type: 'SCHEDULED_ABSOLUTE',
                scheduledTime: scheduled.format('YYYY-MM-DDTHH:mm:00.000'),
                timeZoneId: timezone,
            },
            alertInfo: {
              spokenInfo: {
                content: [{
                  locale: locale,
                  text: message,
                }],
              },
            },
            pushNotification: {
              status: 'ENABLED',
            }
        }
    },
    fetchBirthdaysData(day, month, limit){
        const endpoint = 'https://query.wikidata.org/sparql';
        // List of actors with pictures and date of birth for a given day and month
        const sparqlQuery =
        `SELECT ?human ?humanLabel ?picture ?date_of_birth WHERE {
        ?human wdt:P31 wd:Q5.
        ?human wdt:P106 wd:Q33999.
        ?human wdt:P18 ?picture.
        FILTER((DATATYPE(?date_of_birth)) = xsd:dateTime)
        FILTER((MONTH(?date_of_birth)) = ${month})
        FILTER((DAY(?date_of_birth)) = ${day})
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
        OPTIONAL { ?human wdt:P569 ?date_of_birth. }
        }
        LIMIT ${limit}`;
        const url = endpoint + '?query=' + encodeURIComponent(sparqlQuery);
        console.log(url);

        var config = {
            timeout: 7000, // timeout api call before we reach Alexa's 8 sec timeout, or set globally via axios.defaults.timeout
            headers: {'Accept': 'application/sparql-results+json'}
        };

        async function getJsonResponse(url, config){
            const res = await axios.get(url, config);
            return res.data;
        }

        return getJsonResponse(url, config).then((result) => {
            return result;
        }).catch((error) => {
            return null;
        });
    },
    callDirectiveService(handlerInput, msg) {
        // Call Alexa Directive Service.
        const {requestEnvelope} = handlerInput;
        const directiveServiceClient = handlerInput.serviceClientFactory.getDirectiveServiceClient();
        const requestId = requestEnvelope.request.requestId;
        const {apiEndpoint, apiAccessToken} = requestEnvelope.context.System;
        // build the progressive response directive
        const directive = {
          header: {
            requestId,
          },
          directive:{
              type: 'VoicePlayer.Speak',
              speech: msg
          },
        };
        // send directive
        return directiveServiceClient.enqueue(directive, apiEndpoint, apiAccessToken);
    }
}
