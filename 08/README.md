# Part 8 - Alexa Presentation Language

## Milestones

1. *Build Tab*: enable APL interface
2. *Code Tab*: add APL directives

## Concepts

1. APL RenderDocument and APL Integration
2. APL Databinding
3. Transformers and Speech Synchronization
4. Touch Events

## Diff

1. **skill.json**: insert APL interface definition
2. **util.js**: insert supportsAPL() function
3. **documents**: create folder with launchRequest.json, celebrityBirthdaysIntent.json and helpIntent.json
4. **constants.js**: create APLDoc structure with requires to files above
5. **localization.js**: add launch hint message (for APL directive in LaunchRequest)
6. **index.js**: add APL directive to LaunchRequestHandler