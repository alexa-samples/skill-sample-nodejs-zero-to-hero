# Part 4 - Memory

In this module we show how to store data that lives across sessions (persistence). We use the S3 persistence adapter available in Alexa Hosted Skills.
We show session attributes and create interceptors that help make them persistent automatically.

## Milestones

1. **Code Tab**: create isAlexaHosted() function based on process.env.S3_PERSISTENCE_BUCKET variable
2. **Code Tab**: add DynamoDB and S3 adapter dependency in package.json, add requires in index.js
3. **Code Tab**: create S3 and DynamoDB persistence adapter instances and compare them
4. **Code Tab**: add persistence adapter to skill builder
5. **Code Tab**: save birthday in RegisterBirthdayIntent
6. **Code Tab**: load persistent attributes to session attributes via interceptor, add interceptor to skill builder
7. **Code Tab**: save session attributes to persistent attributes via interceptor, add interceptor to skill builder
8. **Code Tab**: show birthday in SayBirthdayLaunchRequestHandler, call it from LaunchRequest, use Moments.js

## Concepts

1. Session attributes
2. Persistent attributes
3. Persistence adapters (S3 and DynamoDB) / detect if lambda is Alexa hosted
4. Copy session attributes ↔ persistent attributes via interceptors
5. Async/await

## Diff

1. *lambda/custom/package.json*: add dependencies for S3 and DynamoDB persistence adapters and for the moment-timezone library
2. *models/es-ES.json*: add SayBirthdayIntent with slot-less utterances
3. *lambda/custom/localisation.js*: create this file and put languageStrings here. Improve help message
4. *lambda/custom/index.js*: add function to get/initialize the persistence adapter - getPersistenceAdapter(). Add require for moment-timezone library. Change languageString to require the localisation.js file. Create getPersistenceAdapter() function. In launch request handler get the session attributes and read day, month, monthId and year (if present say this info to the user, otherwise just issue a standard welcome message). In register birthday intent handler get the session attributes and save all slots values in them. Add say birthday intent handler and get day, month id and year from session attributes. If these attributes are present calculate remaining days to birthday with moments-timezone. If it's the user birthday say happy birthday. If the attributes are not present invite the user to register birthday. Add request interceptor to load the session attributes and a response interceptor to save them. Add to the skill builder:  say birthday intent handler, the new interceptors and the persistence adapter