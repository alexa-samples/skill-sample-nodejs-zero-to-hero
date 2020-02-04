# Part 8 - Alexa Presentation Language (I)

This is where we introduce APL, the Alexa Prersentation Language. In this module we create a simple splash screen APL document that we reuse across several intents.
We also introduce Home Cards (these cards are typically visble in the Alexa app) and media storage via S3 in your Alexa Hosted Skill space to store the images we need to render.
The APL document shows a tailored hint (thanks to the testToHint transformer)

## Milestones

1. *Build Tab*: enable APL interface
2. *Code Tab*: create documents folder. Go to S3 Media folder and add all image files in the project's documents/images
3. *Code Tab*: in documents folder create launchScreen.json and leave empty
4. *Code Tab*: add handlers.js file, move all handlers here, index.js becomes very small
4. *Display Tab*: open APL authoring tool to explain the basics. Paste launchScreen.json as doc and launchSampleDatasource.json as datasource and explain/play with it.
5. *Code Tab*: fill documents/launchScreen.json with result from APL authoring tool (better just copy paste the original)
6. *Code Tab*: locate RemindBirthdayIntentHandler and add APL directive via util. Add standard card to response builder
7. *Code Tab*: locate SayBirthdayIntentHandler and add APL directive via util. Add standard card to response builder
8. *Code Tab*: locate CelebrityBirthdaysIntentHandler and add APL directive via util. Add standard card to response builder

## Concepts

1. APL RenderDocument and APL Directive
2. APL Databinding and APL Authoring Tool
3. APL Styles, Layouts and ViewPorts
4. APL Transformers (Text to Hint)
5. Home Cards
6. Media storage in Alexa-hosted Skills

## Diff

1. **handlers.js**: create file, put handlers here. For SayBirthdayIntentHandler, RemindBirthdayIntentHandler and CelebrityVirthdaysIntenteHandler: Add APL directive, use util.js APL helper and AHS url helper to pass background urls. Add card responses too.
2. **skill.json**: insert APL interface definition for reference (not used in the project)
3. **util.js**: insert supportsAPL() function
4. **documents**: create folder and create inside launchScreen.json and launchSampleDatasource.json (for the APL authoring tool)
5. **constants.js**: create APLDoc structure pointing to to launchScreen.json (for now)
6. **localisation.js**: add strings for launch header and launch hint
7. **index.js**: index is now shorter as it gets rid of the handlers

## Videos

[EN](https://alexa.design/zerotohero8)/[DE](https://alexa.design/de_zerotohero8)/[FR](https://alexa.design/fr_zerotohero8)/[IT](https://alexa.design/it_zerotohero8)/[ES](../README_ES.md)
(EN version includes the following subtitles: EN, DE, PT)