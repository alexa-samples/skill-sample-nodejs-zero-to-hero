# Part 2 - Skill Internationalization (i18n), Interceptors and Error Handler

In this module we explain how to use i18next to do the i18n of your skill. We got rid of the sprintf module and now we're using plain i18next for string replacement We also introduce interceptors and attributtes. Start with brief intro to i18n. In this module we generate a locale specific Hello World (eg. Spanish, French, etc)

## Milestones

1. **Developer Console**: adding an extra locale (xx-XX (your own locale), departing from the en-US model)
2. **Code Tab**: i18next dependency, string replacement with {{}}, languageStrings (embedded for now)
3. **Code Tab**: Request and Response Interceptors (loggers), Localisation Interceptor (simplest possible for now, no arrays)
4. **Code Tab**: handlerInput.t and handlerInput.t with parameters (string replacement example in Reflector message)

## Concepts

1. Multiple models per locale
2. Key/value string resources for i18n
3. Enriching handlerInput with t function via interceptor
4. Attribute manager as key/value store
5. High level attribute types (session(short term), persistent(long term))
6. Changing locale on Build tab and on Test tab (test both locales)

## Diff

1. *lambda/custom/package.json*: add i18next dependency, we also update all existing dependencies to latest versions
2. *lambda/custom/index.js*: add i18next require, add languageStrings, get localisation strings via function handlerInput.t, add 3 interceptors (log request, log response and localization interceptor), add them to the exports via Alexa skill builder (bottom of file). Replace all hard coded speech string with handlerIput.t(STRING_KEY). Add detection of locale to i18n interceptor via ASK SDK Utilities (Alexa.getLocale())
3. *models/xx-XX.json*: add this file copied from en-US.json and translate (xx-XX is your own locale)

## Videos

[EN](https://alexa.design/zerotohero2)/[DE](https://alexa.design/de_zerotohero2)/[FR](https://alexa.design/fr_zerotohero2)/[IT](https://alexa.design/it_zerotohero2)/[ES](../README_ES.md)
(EN version includes the following subtitles: EN, DE, PT)