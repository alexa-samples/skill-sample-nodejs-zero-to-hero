# Part 7 - Accessing External APIs

## Milestones

1. **Build Tab**: ?

## Concepts

1. ?

## Diff

1. *lambda/custom/constants.js*: create this file to encapsulate constants like e.g. permissions
2. *lambda/custom/package.json*: add node-fetch dependency
3. *lambda/custom/localisation.js*: add all messages related to API access. Improve help message
4. *models/es-ES.json*: add celebrity birthdays intent with utterances to ask for today's birthdays
5. *lambda/custom/logic.js*: add functions to return current date info, to call external API and to create progressive response directive
6. *lambda/custom/index.js*: replace constants with constants.js require. Extend birthday greeting to mention celebrity birthdays. Add celebrity birthdays intent handler and fetch birthdays from API. Add new handler to skill builder