# Part 7 - Accessing External APIs

In this module we show how to acess any eternal API (3rd party REST service) with the Axios library (you might use other libraries similarly, like e.g. node-fetch). We use async/await to wait for a response from the service.
We set up a connection timeout so the call comes back in time before we run out of time during an Alexa conversation turn (typically 8 seconds).
We use the Progressive Response API before doing the call so Alexa gives the user a nice waiting message if the connection takes a few seconds to return.

## Milestones

1. **Build Tab**: add celebrity birthdays intent with utterances to ask for today's birthdays
2. **Code Tab**: add node-fetch dependency to package.json
3. **Code Tab**: add code to access external API (with async/await)
4. **Code Tab**: add progressive response directive and attach to external API call
5. **Code Tab**: add celebrity birthdays intent handler
6. **Code Tab**: add new handler to skill builder

## Concepts

1. Fetch external API (async/await)
2. Progressive Response

## Diff

1. *lambda/custom/constants.js*: create this file to encapsulate constants like e.g. permissions
2. *lambda/custom/package.json*: add node-fetch dependency
3. *lambda/custom/localisation.js*: add all messages related to API access. Improve help message
4. *models/es-ES.json*: add celebrity birthdays intent with utterances to ask for today's birthdays
5. *lambda/custom/logic.js*: add functions to return current date info, to call external API and to create progressive response directive
6. *lambda/interceptors.js*: refer to constants.js in name interceptor (add require too)
7. *lambda/custom/index.js*: replace constants with constants.js require. Extend birthday greeting to mention celebrity birthdays. Add celebrity birthdays intent handler and fetch the birthdays from the API. Add new handler to skill builder