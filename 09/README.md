# Part 9 - Alexa Presentation Language (II)

In this second APL module we show a slightly more complex APL document. We use the results of the external API (celebrity birthdays) to render a list on screen. We enable each item shown in the list with touch capability.

## Milestones

1. *Code Tab*: do the steps in the Diff section up to 5
2. *VS Code*: show sample data from API (sampleBirthdayResponse) and APL doc (listScreen.json)
3. *Display Designer*: explain Designer. copy listSampleDatasource.son to datasources and listScreen.json to doc tab. Play with it
4. *Code Tab*: do the remaining steps in the Diff section

## Concepts

1. APL Authoring Tool
2. APL Layouts & Sequences
3. APL Transformers (Text to Hint)
4. APL Touch Wrapper

## Diff

1. **index.js**: add TouchIntentHandler to exports
2. **documents/listScreen.json**: create, paste doc and show on APL authoring tool, explain it
3. **constants.js**: add reference to listScreen doc (the APL doc with the celebrity list)
4. **handles.js**: Change APL doc to listScreen in CelebrityBirthdaysIntent handler. Add TouchIntentHandler code and add it to module.exports. [TODO: Add celebrities as dynamic entities + voice navigation]
5. **index.js**: add handlers.TouchIntentHandler to handlers
6. **localisation.js**: add LIST_* related strings at the bottom of the file
7. **logic.js**: add convertBirthdateToYearsOld() function. in convertBirthdaysResponse function where you can see the calculation of age in results loop you need to add a line to put age in actor's list response (we modify the API response format to better suit our APL doc)
8. **documents/listSampleDatasource.json**: add (not used, just to test in the APL authoring tool)
9. **documents/sampleBirthdayResponse.json**: added only as reference to show what an API response looks like (not used)

## Videos

[EN](https://alexa.design/zerotohero9)/[DE](https://alexa.design/de_zerotohero9)/[FR](https://alexa.design/fr_zerotohero9)/[IT](https://alexa.design/it_zerotohero9)/[ES](../README_ES.md)
(EN version includes the following subtitles: EN, DE, PT)
