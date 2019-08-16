# Part 1 - Alexa-Hosted Skills (preset - Hello World)

In this module we introduce some theory about ASK and then we build an Alexa Hosted Skill from scratch (Hello World template) with no localization (out-of-the-box experience). When using the console we introduce the basic tabs (Build, Code, Test, etc)

## Milestones

1. **Developer Console**: Build, Code and Test tabs
2. **Build tab**: Invocation name, Built-In and Custom Intents and Utterances in VIM. VIM as JSON
3. **Code Tab**: Dependencies (require), package.json, Save/Deploy/Promote to Live, Handler Structure (canHandle/handle), Handler Input, Response Builder, Speak/Reprompt, Skill Builder, Error handler, Session ended request
4. **Code Tab**: Intent Reflector & FallbackIntent handler (*)
5. **Test Tab**: Custom Skill opening, JSON in/out, LaunchRequest, IntentRequest, Help/Stop/Cancel, Session ended, Test physical device (same account)

## Concepts

1. Development and Production Lambda Stages
2. Lambda Dependencies
3. Handler as processor of incoming event. Handler structure
4. Request Types
5. Skill Builder (custom vs standard) and its functions
6. Reflector (catch all intent handler)
7. Out-of-domain utterances (*)

* (only in locales that support AMAZON.FallbackIntent) otherwise explain that the handler on the back-end side does not affect the operation (we can keep it)