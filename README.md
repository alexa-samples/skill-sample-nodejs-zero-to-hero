# Zero to Hero: A comprehensive course to building an Alexa Skill

Support code for "Zero to Hero: A comprehensive course to building an Alexa Skill", an ASK training course in multiple languages. This is progressive code that starts from scratch and adds features on each module. The Learn more links below are suitable for learning (and teaching) how to code Alexa skills (see the README file on each module for video links and instructions on how to evolve the code departing from the previous module).

## Zero to Hero, Part 1: Alexa Skills Kit Overview

1. Development and Production Lambda Stages (AHS branches)
2. Lambda Dependencies (package.json, requires in code)
3. Handler as processor of incoming requests. Handler structure
4. Request Types (LaunchRequest, IntentRequest, SessionEndedRequest)
5. Skill Builder (custom vs standard) and its functions
6. Reflector (catch all intent handler)
7. Out-of-domain utterances (*)

[Learn more](./01)

## Zero to Hero, Part 2: Skill Internationalization (i18n), Interceptors & Error Handling

1. Multiple models per locale
2. Key/value string resources for i18n
3. Enriching handlerInput with t function via interceptor
4. Attribute manager as key/value store
5. High level attribute types (session(short term), persistent(long term))
6. Changing locale on Build tab and on Test tab (test both locales)

[Learn more](./02)

## Zero to Hero, Part 3: Slots, Slot Validation & Automatic Dialog Delegation

1. Slots explanation
2. Built in and custom slot types
3. Synonyms (minimal, we're not using synonyms, eg. January -> first month)
4. Required Slots & Prompts
5. Slot Validation
6. Auto-Delegate, Dialog Delegation Strategy
7. Utterance Profiler
8. Intent Confirmation
9. Basic Intent Chaining

[Learn more](./03)

## Zero to Hero, Part 4: Persistence

1. Session attributes
2. Persistent attributes
3. Persistence adapters (S3 and DynamoDB) / detect if lambda is Alexa hosted
4. Copy session attributes to and from persistent attributes via interceptors
5. Async/await
6. Session counter (to say eg. "welcome back")

[Learn more](./04)

## Zero to Hero, Part 5: Accessing ASK APIs

1. Service API (User Profile API - given name)
2. Settings API (timezone)
3. SSML (speechcons and audio files)
4. Array capable localisation interceptor
5. String replacement with plurals support

[Learn more](./05)

## Zero to Hero, Part 6: Reminders API

1. Reminders API
2. AMAZON.SearchQuery
3. Intent Confirmation (again)

[Learn more](./06)

## Zero to Hero, Part 7: Accessing External APIs

1. Fetch external API (async/await)
2. Progressive Response

[Learn more](./07)

## Zero to Hero, Part 8: Alexa Presentation Language (APL), Part 1

1. APL RenderDocument and APL Directive
2. APL Databinding and APL Authoring Tool
3. APL Styles, Layouts and ViewPorts
4. APL Transformers (Text to Hint)
5. Home Cards
6. Media storage in Alexa-hosted Skills

[Learn more](./08)

## Zero to Hero, Part 9: Alexa Presentation Language (APL), Part 2

1. APL Authoring Tool
2. APL Layouts & Sequences
3. APL Transformers (Text to Hint)
4. APL Touch Wrapper

[Learn more](./09)

## Zero to Hero, Part 10: The ASK Command Line Interface (CLI)

1. Configuring the ASK-CLI with personal AWS account support
2. Cloning an Alexa Hosted Skill
3. Editing a skill in code and deploying the skill

[Learn more](./10)

## Zero to Hero, Part 11: Publishing

1. Distribution tab in developer console
2. Skill metadata for publication
3. Submitting a skill for certification

[EN](https://alexa.design/zerotohero11)/[DE](https://alexa.design/de_zerotohero11)/[FR](https://alexa.design/fr_zerotohero11)/[IT](https://alexa.design/it_zerotohero11)
(EN version includes the following subtitles: EN, DE, PT)

## License

This library is licensed under the Amazon Software License
