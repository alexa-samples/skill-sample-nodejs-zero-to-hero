# Part 9 - Alexa Presentation Language (II)

In this second APL module we show a slightly more complex APL document. We use the results of the external API (celebrity birthdays) to render a list on screen. We enable each item shown in the list with touch capability.

## Milestones

1. *Code Tab*: do the steps in the Diff section up to 5
2. *VS Code*: show sample data from API (sampleBirthdayResponse) and APL doc (listScreen.json)
3. *Display Designer*: explain Designer. copy listSampleDatasource.son to datasources and listScreen.json to doc tab. Play with it
4. *Code Tab*: do the remaining steps in the Diff section

## Concepts

1. APL Display Designer
2. APL Layouts & Sequences
3. APL Transformers (Text to Hint)
4. APL Touch Events

## Diff

1. **constants.js**: add reference to listScreen doc (the APL doc with the celebrity list)
2. **handler.js**: in CelebrityBirthdaysIntentHandler add calculation of age in results loop, APL doc rendering directive (explain datasource) and home card. Add TouchIntentHandler code and add it to module.exports. [Add celebrities as dynamic entities + voice navigation]
3. **index.js**: add handlers.TouchIntentHandler to handlers
4. **localisation.js**: add LIST_* related strings at the bottom of the file
5. **util.js**: add convertBirthdateToYearsOld() function
6. **logic.js**: add line to put age in actor's list response (we modify the API response formaat to better suit our APL doc)
7. **listSampleDatasource.json**: add (not used, just to test in the APL authoring tool)
8. **sampleBirthdayResponse.json**: add and show, place on designer
9. **listScreen.json**: add to project and show on APL authoring tool, explain it
