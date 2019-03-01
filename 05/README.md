# Part 5 - Accessing ASK APIs

## Milestones

1. **Build Tab**: enable given name permissions in front-end
2. **Code Tab**: add given name permissions constant, add API client in exports
3. **Code Tab**: add given name retrieval code in LaunchRequest, send silent card if there's no permission
4. **Code Tab**: add timezone retrieval code to SayBirthdayIntentHandler
5. **Code Tab**: add speechcon and sound from audio bank to birthday greeting
6. **Code Tab**: add extra variable on strings to pass given name
7. **Code Tab**: add API client to exports

## Concepts

1. Service API (User Profile API - given name)
2. Settings API (timezone)
3. SSML (speechcons and audio files)

## Diff

1. *lambda/custom/interceptors.js*: add this file and move all interceptors here (move i18next and reference to localisation.js here and away from index.js)
2. *lambda/custom/persistence.js*: add this file and move all persistence code here
3. *skill.json*: add this file so we show we require given name permission
4. *lambda/custom/localisation.js*: modify messages to include given name as replacement string (sprintf). Modify goodby message to include an array of goodbyes. Add message to say timezone could not be retrieved. Add sound and speechcon to birthday greeting message. Improve help message
5. *lambda/custom/index.js*: add requires for persistence.js and interceptors.js. Remove requires for localisation and i18next. Add constant for given name permission. Remove getPersistenceAdapter function (now in persistence.js). Make handle() of launch request handler async. Check for name in session attributes, if not there use UPS service client to fetch it and tore it in session attributes (if there's no permission send an authorization card silently). If name is present send name as parameter to the register message. In register birthday intent handler get the name from session attributes and send it as parameter to the register message. Change say birthday intent handler to fetch name from session attributes and add it output messages. In this handler now fetch the timezone via UPS service client (plus code to handle problems getting the timezone). Fetch name from session attributes in cancel/stop intent handler, add to goodbye output message. Remove all interceptors above skill builder (they all go to interceptors.js)