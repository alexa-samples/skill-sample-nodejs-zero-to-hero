# Part 9 - Alexa Presentation Language (II)

## Milestones

1. *Build Tab*: TODO
2. *Code Tab*: TODO

## Concepts

1. Sequence
2. Transformers
3. Speech Synchronization
4. Touch Events

## Diff

1. **constants.js**: add reference to listScreen doc
2. **handler.js**: in CelebrityBirthdaysIntentHandler add calculation of age in results loop, APL doc rendering directive (explain datasource) and home card. Add TouchIntentHandler code and add it to module.exports. [Add celebrities as dynamic entities]
3. **index.js**: add handlers.TouchIntentHandler to handlers
4. **localisation.js**: add LIST_ related string at bottom. [Fix help verbosity]
5. **util.js**: add convertBirthdateToYearsOld() fucntion
6. **listSampleDatasource.json**: add a d show (not used)
7. **sampleBirthdayResponse.json**: add and show, place on designer
8. **listScreen.json**: add and place on designer, explain it
