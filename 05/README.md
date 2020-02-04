# Part 5 - Accessing ASK APIs

In this module we show how to access internal ASK APIs (in this case the User Profile API to fetch the given name of the user and the Settings API to fetch the timezone of the device).
We also intriduce some SSML magic to use speechcons and audio files.

## Milestones

1. **Build Tab**: enable Given Name permissions in the skill
2. **Code Tab**: create interceptors file
3. **Code Tab**: move interceptors to separate file (interceptors.js), move persistence adapter to util.js
4. **Code Tab**: add given name retrieval interceptor in interceptors.js, add it to exports in index.js
5. **Code Tab**: add timezone retrieval interceptor in interceptors.js, add it to exports in index.js
6. **Code Tab**: add speechcon and sound from audio bank to localization file
7. **Code Tab**: add extra variable on localization strings to pass given name
8. **Code Tab**: add API client to exports (because we're using a custom builder). See: https://developer.amazon.com/blogs/alexa/post/a47f25e9-3e87-4afd-b632-ff3b86febcd4/skill-builder-objects-to-customize-or-not-to-customize

## Concepts

1. Service API (User Profile API - given name)
2. Settings API (timezone)
3. SSML (speechcons and audio files)
4. Array capable localisation interceptor
5. String replacement with plurals support

## Diff

1. *lambda/custom/interceptors.js*: add this file and move all interceptors here (plus several require()s, check the top of interceptors.js). Add interceptors to fetch the user first name and timezone and put the values in session attributes. Add constant for given name permission
2. *skill.json*: we add this file so we show we require given name permission but you don't need it in an AHS
4. *lambda/custom/localisation.js*: modify messages to include given name as replacement string. Modify goodbye message to include an array of goodbyes. Add message to say timezone could not be retrieved. Add sound and speechcon to birthday greeting message.
5. *lambda/custom/index.js*: add requires for persistence.js and interceptors.js. Remove requires for localisation and i18next. Remove all interceptors above skill builder (they all go to interceptors.js)
6. *lambda/custom/util.js*: move getPersistanceAdapter() function here from index.js

## Videos

[EN](https://alexa.design/zerotohero5)/[DE](https://alexa.design/de_zerotohero5)/[FR](https://alexa.design/fr_zerotohero5)/[IT](https://alexa.design/it_zerotohero5)/[ES](../README_ES.md)
(EN version includes the following subtitles: EN, DE, PT)