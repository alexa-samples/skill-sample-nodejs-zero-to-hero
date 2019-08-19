# Part 2 - Skill Internationalization (i18n) and Interceptors

In this module we explain how to use i18next to do the i18n of your skill. We got rid of the sprintf module and now we're using plain i18next for string replacement We also introduce interceptors and attributtes. Start with brief intro to i18n. In this module we generate a locale specific Hello World (eg. Spanish, French, etc)

## Milestones

1. **Developer Console**: adding an extra locale (xx-XX (your own lcoale), departing from the en-US model)
2. **Code Tab**: add ASK SDK Utilities to all handlers and interceptors
3. **Code Tab**: i18next dependency, string replacement with {{}}, languageStrings (embedded for now)
4. **Code Tab**: Request and Response Interceptors (loggers), Localisation Interceptor (simplest possible for now, no arrays)
5. **Code Tab**: Attributes Manager, Request Attributes, handlerInput.t and handlerInput.t with parameters (string replacement example in Reflector message)

## Concepts

1. Multiple models per locale
2. Key/value string resources for i18n
3. Enriching handlerInput with t function via interceptor
4. Attribute manager as key/value store
5. High level attribute types (request(short term), session(mid term), persistent(long term))
6. Changing locale on Build tab and on Test tab (test both locales)

## Diff

1. *lambda/custom/package.json*: add i18next dependency, we also update all existing dependencies to latest versions
2. *lambda/custom/index.js*: add i18next require, add languageStrings, get localisation strings via function handlerInput.t, add 3 interceptors (log request, log response and localization interceptor), add them to the exports via Alexa skill builder (bottom of file). Replace all hard coded speech string with handlerIput.t(STRING_KEY). Add detection of request type and intent name to all handlers via ASK SDK Utilities (Alexa.getRequestType() & Alexa.getIntentName()). Add detection of locale to i18n interceptor via ASK SDK Utilities (Alexa.getIntentName())
3. *models/xx-XX.json*: add this file copied from en-US.json and translate (xx-XX is your own locale)

## Structure

1. 5 min. Theory, intro to i18n backed by slides
2. 15 min. Update the skill based on the above. Test on real device changing lang to the target locale