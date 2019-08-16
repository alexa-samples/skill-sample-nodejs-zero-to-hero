# Part 2 - Skill Internationalization (i18n) and Interceptors

In this module we explain how to use i18next to do the internationalization of your skill. We got rid of the sprintf module and now we're using plain i18next for string replacement if necessary.
We also introduce interceptors and attributtes.

## Milestones

1. **Developer Console**: adding an extra locale (xx-XX (your own lcoale), departing from the en-US model)
2. **Code Tab**: i18next dependency, string replacement with {{}}, languageStrings (embedded for now)
3. **Code Tab**: Request and Response Interceptors (loggers), Localisation Interceptor (simplest possible for now, no arrays)
4. **Code Tab**: Attributes Manager, Request Attributes, handlerInput.t and handlerInput.t with parameters (string replacement in Reflector message)

## Concepts

1. Multiple models per local
2. Key/value string resources
3. Enriching handlerInput with t function
4. Attribute manager as key/value store
5. High level attribute types (request(short term), session(mid term), persistent(long term))

## Diff

1. *lambda/custom/package.json*: add i18next dependency, we update all existing dependencies to latest versions
2. *lambda/custom/index.js*: add i18next require, add languageStrings, get localisation strings via function handlerInput.t, add 3 interceptors (log request, log response and localization interceptor), add them to the exports via Alexa skill builder (bottom of file)
3. *models/xx-XX.json*: add this file copied from en-US.json and translate (xx-XX is your own locale)