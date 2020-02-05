# Part 4 - Persistence

In this module we show how to store data that lives across sessions (persistence). We use the S3 persistence adapter available in Alexa Hosted Skills.
We show session attributes and create interceptors that help make them persistent automatically.

## Milestones

1. **Build Tab**: add new intent SayBirthdayIntent with utterances to ask for remaining time until birthday (no slots)
2. **Code Tab**: remove languageStrings and put then in separate localisation file
3. **Code Tab**: add DynamoDBand S3 adapter dependency in package.json, also moment.js dependency. Add requires in index.js
4. **Code Tab**: create getPersistenceAdapter() function that returns the adapter
5. **Code Tab**: add persistence adapter to skill builder
6. **Code Tab**: in RegisterBirthdayIntent get attributes manager and put slot values in session attributes
7. **Code Tab**: load persistent attributes to session attributes via interceptor, add interceptor to skill builder
8. **Code Tab**: save session attributes to persistent attributes via interceptor, add interceptor to skill builder
9. **Code Tab**: in SayBirthdayLaunchRequestHandler load session attributes and if slot values are not present call the registration itent using intent chaining. Call this handler from LaunchRequest and RegisterBirthdayIntent handler, use Moments.js for the date math, send one of two responses: remaining days until birthday or happy birthday greeting. 

## Concepts

1. Session attributes
2. Persistent attributes
3. Persistence adapters (S3 and DynamoDB) / detect if lambda is Alexa hosted
4. Copy session attributes to and from persistent attributes via interceptors
5. Async/await
6. Session counter (to say eg. "welcome back")

## Diff

1. *models/xx-XX.json*: add SayBirthdayIntent with slot-less utterances
2. *lambda/custom/package.json*: add dependencies for S3 and DynamoDB persistence adapters and for the moment-timezone library
3. *lambda/custom/localisation.js*: create this file and put languageStrings here
4. *lambda/custom/index.js*: add function to get/initialize the persistence adapter - getPersistenceAdapter(). Add require for moment-timezone library. Change languageString to require the localisation.js file. Create getPersistenceAdapter() function. In launch request handler get the session attributes and read day, month, monthId and year (if present call the say intent handler, otherwise call the register handler via intent chaining). In register birthday intent handler get all slot values and put them on session attributes (then call say intent handler). Add say birthday intent handler and get day, month id and year from session attributes. If these attributes are present calculate remaining days to birthday with moments-timezone. If it's the user birthday say happy birthday. If the attributes are not present use intent chaining to point to register birthday. Add request interceptor to load the session attributes and a response interceptor to save them. Add to the skill builder: say birthday intent handler, the new interceptors and the persistence adapter

## Videos

[EN](https://alexa.design/zerotohero4)/[DE](https://alexa.design/de_zerotohero4)/[FR](https://alexa.design/fr_zerotohero4)/[IT](https://alexa.design/it_zerotohero4)/[ES](../README_ES.md)
(EN version includes the following subtitles: EN, DE, PT)