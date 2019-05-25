# Part 9 - Alexa Presentation Language (II)

#   # Milestones

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

1. **constants.js**: add reference to listScreen doc
2. **handler.js**: in CelebrityBirthdaysIntentHandler add calculation of age in results loop, APL doc rendering directive (explain datasource) and home card. Add TouchIntentHandler code and add it to module.exports. [Add celebrities as dynamic entities]
3. **index.js**: add handlers.TouchIntentHandler to handlers
4. **localisation.js**: add LIST_ related string at bottom. [Fix help verbosity]
5. **util.js**: add convertBirthdateToYearsOld() function
6. **listSampleDatasource.json**: add (not used)
7. **sampleBirthdayResponse.json**: add and show, place on designer
8. **listScreen.json**: add and place on designer, explain it
