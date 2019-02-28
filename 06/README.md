# Part 6 - Reminders API

## Milestones

1. **Build Tab**: enable Reminders in Permissions
2. **Code Tab**: add Reminders permissions
3. **Code Tab**: 

## Concepts

1. Reminders API

## Diff

1. *lambda/custom/logic.js*: create this file to encapsulate birthday calculation logic (and reminder structure creation). Move moment-timezone require to this file
2. *skill.json*: add permission to read/write reminders
3. *lambda/custom/localisation.js*: add all messages related to reminders. Improve help message
4. *models/es-ES.json*: add remind birthday intent, slot-less utterances and utterances to collect a message slot (SearchQuery). Use auto-delegate to collect the slot if not present. Add prompts. Add intent confirmation.
5. *lambda/custom/index.js*: replace moment library require with a require for logic.js. Add constant with reminders permission. Replace birthday logic in say birthday intent with calls to logic.js. Add remind birthday intent handler. Verify intent was confirmed. Create reminder using timezone info (put creation of reminder structure in logic.js). Add new handler to skill builder