# Part 8 - Alexa Presentation Language (I)

This is where we introduce APL, the Alexa Prersentation Language. In this module we create a simple splash screen APL document that we reuse across several intents.
We also introduce Home Cards (these cards are typically visble in the Alexa app) and media storage via S3 in your Alexa Hosted Skill space to store the images we need to render.
The APL document shows a tailored hint (thanks to the testToHint transformer)

## Milestones

1. *Build Tab*: enable APL interface
2. *Code Tab*: create documents folder. Create images folder. Go to S3 Media folder and add all image files
3. *Code Tab*: in documents folder create launchScreen.json and leave empty
4. *Display Tab*: explain the basics. Paste launchScreen.json as template and launchSampleDatasource.json as datasource and explain/play with it.
5. *Code Tab*: fill documents/launchScreen.json with result from display editor (better leave untouched)
6. *Code Tab*: locate launch request intent handler and add call to SayBirthdayIntentHandler (direct)
7. *Code Tab*: locate RegisterBirthdayIntentHandler and add APL directive via util. Add standard card to response builder
8. *Code Tab*: locate SayBirthdayIntentHandler and add APL directive via util. Add standard card to response builder

## Concepts

1. APL RenderDocument and APL Directive
2. APL Databinding
3. APL Styles, Layouts and ViewPorts
4. APL Transformers (Text to Hint)
5. Home Cards
6. Media storage in Alexa-hosted Skills

## Diff

1. **handlers.js**: create file, refactoring of handlers. Add direct handle() call of SayBirthdayIntentHandler to LaunchRequestHandler. For RegisterBirthdayIntentHandler, SayBirthdayIntentHandler and RemindBirthdayIntentHandler: Add APL directive, use util.js APL helper and url helper to pass background urls. Add card response.
2. **skill.json**: insert APL interface definition
3. **util.js**: insert supportsAPL() function. Insert APL directive helper method (requires ./constants)
4. **documents**: create folder with launchRequest.json and launchSampleDatasource.json
5. **constants.js**: create APLDoc structure pointing to to launchRequest.json (for now)
6. **localization.js**: add hader, full body, empty body and hint strings
