# Part 1 - Alexa-Hosted Skills (preset - Hello World)

In this module we introduce some theory about ASK and then we build an Alexa Hosted Skill from scratch in no time (Hello World template) with no localization (out-of-the-box experience). When using the console we introduce the basic tabs (Build, Code, Test, etc)

## Milestones

1. **Developer Console**: Build, Code and Test tabs. Types of skills that you can create (focus on Custom)
2. **Build tab**: Invocation name, Built-In and Custom Intents and Utterances in VIM. VIM as JSON (JSON editor)
3. **Code Tab**: Dependencies (require), package.json, Save/Deploy/Promote to Live in AHS (branches), basic Handler Structure (canHandle/handle), Handler Input, Response Builder, Speak/Reprompt, Skill Builder + handler registration, Error handler, Session ended request
4. **Code Tab**: Intent Reflector & FallbackIntent handler (*)
5. **Test Tab**: Custom Skill invocation, JSON in/out, LaunchRequest, IntentRequest, Help/Stop/Cancel, Session ended, Test on real device (same account)

## Concepts

1. Development and Production Lambda Stages (AHS branches)
2. Lambda Dependencies (package.json, requires in code)
3. Handler as processor of incoming requests. Handler structure
4. Request Types (LaunchRequest, IntentRequest, SessionEndedRequest)
5. Skill Builder (custom vs standard) and its functions
6. Reflector (catch all intent handler)
7. Out-of-domain utterances (*)

* (only in locales that support AMAZON.FallbackIntent) otherwise explain that including the handler on the back-end side does not affect the operation (we can keep it but should clarify to avoid confusion)

## Videos

[EN](https://alexa.design/zerotohero1)/[DE](https://alexa.design/de_zerotohero1)/[FR](https://alexa.design/fr_zerotohero1)/[IT](https://alexa.design/it_zerotohero1)/[ES](../README_ES.md)
(EN version includes the following subtitles: EN, DE, PT)