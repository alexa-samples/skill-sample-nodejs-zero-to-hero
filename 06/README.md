# Part 6 - Reminders API

Here we show you how to use the Reminders API to have Alexa say a message on a specific point in time. The user has to grant permission for this so we also show how to send a card to the Alexa app to get this permission.
Additionally we show you how to use a slot of type AMAZON.SearchQuery to capture arbitrary sentences that the user might say (no predefined slot type).

## Milestones

1. **Build Tab**: enable Reminders in Permissions
2. **Build Tab**: add reminder birthday intent and collect reminder message via SearchQuery (make slot required)
3. **Code Tab**: create constants and logic files
4. **Code Tab**: add Reminders permission constant to constants.js
5. **Code Tab**: create Reminders structure (use SCHEDULE_ABSOLUTE)
6. **Code Tab**: add remind birthday intent handler with support for confirmation
7. **Code Tab**: add new handler to skill builder

## Concepts

1. Reminders API
2. AMAZON.SearchQuery
3. Intent Confirmation (again)

## Diff

1. *skill.json*: we add reminders permission here but this file is not needed if you use AHS
2. *lambda/custom/constants.js*: move all constants here including the array of persistent attributes name
3. *lambda/custom/logic.js*: create this file to encapsulate birthday calculation logic (and reminder structure creation). Move moment-timezone require to this file
4. *skill.json*: add permission to read/write reminders
5. *lambda/custom/localisation.js*: add all messages related to reminders.
6. *models/xx-XX.json*: add remind birthday intent, slot-less utterances and utterances to collect a message slot (SearchQuery). Use auto-delegate to collect the slot if not present. Add prompts. Add intent confirmation.
7. *lambda/custom/index.js*: replace moment library require with a require for logic.js. Add constant with reminders permission. Replace birthday logic in say birthday intent with calls to logic.js. Add remind birthday intent handler. Verify intent was confirmed. Create reminder using timezone info (put creation of reminder structure in logic.js). Add new handler to skill builder
8. *lambda/custom/util.js*: add create reminder function

Warning: the simulator might return inconsistent timezone results such your geographical timezone by API but a different time (not consistent with your timezone). It can also return no time zone at all. In order to see the reminders demo working properly please try it on a physical device

## Videos

[EN](https://alexa.design/zerotohero6)/[DE](https://alexa.design/de_zerotohero6)/[FR](https://alexa.design/fr_zerotohero6)/[IT](https://alexa.design/it_zerotohero6)/[ES](../README_ES.md)
(EN version includes the following subtitles: EN, DE, PT)