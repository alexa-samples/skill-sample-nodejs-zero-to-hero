# Part 3 - Slots, Slot Validation and Automatic Dialog Delegation

In this module we depart from the previous project and overwrite HelloWorldIntent. We show slots (built-in and custom), synonyms, slot validation and dialogs & prompts with AutoDelegate.

## Milestones

1. **Build Tab**: create Alexa-hosted skill from scratch or overwrite HelloWorld, select/add your locale. 
2. **Build Tab**: Change invocation name to "happy birthday" in your language (all strings in English go in your lang from now on). Show json
3. **Build Tab**: create RegisterBirthdayIntent (output message is "Happy Birthday!"), mention Dialog Delegation strategy will be enabled later. Show json
4. **Build Tab**: create slot day, type is AMAZON.Number. Show json
5. **Build Tab**: create slot month, create slot type MonthType. Type is custom (for illustration purposes is not AMAZON.Month). Compare solution to using AMAZON.Date
6. **Build Tab**: create slot year, type is AMAZON.Four_Digit.
7. **Build Tab**: create synonyms in month (eg. "first month of the year", "the first one")
8. **Build Tab**: create utterances that cover collection of all slots plus some slot-less utterances (eg. "register my birthday")
9. **Build Tab**: mark day as required, add prompts (including prompt that use the other slots)
10. **Build Tab**: add slot validation to day (eg >= 1 & <= 31)
11. **Build Tab**: mark month as required, add prompts (including prompts that refer to other slots)
12. **Build Tab**: add slot validation to month (show constrain on slot type values and synonyms, mention this is not possible on built-in list slots (eg. AMAZON.Actor))
13. **Build Tab**: mark year as required, add prompts (including prompts that refer to other slots)
14. **Build Tab**: add slot validation to year (eg > 1900 & < 2014)
15. **Build Tab**: explain dialog delegation strategy (fallback to skill, enable, disable) in intent now that prompts have been created. explain conditional validation requires a mixed slot validation approach: https://developer.amazon.com/docs/custom-skills/delegate-dialog-to-alexa.html#auto-delegate-json (validation for coffee <> validation for tea)
16. **Code Tab**: modify HelloWorldIntent to become BirthdayIntent. Modify help and welcome messages to guide for new utterances (not hello world)

## Concepts

1. Slot explanation
2. Built in and custom slot types
3. Synonyms (minimal, we're not using synonyms, eg. January -> first month)
4. Required Slots & Prompts
5. Slot Validation
6. Auto-Delegate, Dialog Delegation Strategy

## Diff

1. *lambda/custom/package.json*: change name and description of project to a happy birthday theme (no change in dependencies)
2. *models/xx-XX.json*: change invocation name to happy birthday theme (eg. happy birthday). Keep fallback intent if the locale supports it (otherwise remove it!). Change HelloWorldIntent to RegisterBirthdayIntent. Add slots: day (AMAZON.Ordinal or AMAZON.NUMBER), month (custom type with 2 digits as month ids) and year (AMAZON.FOUR_DIGIT_NUMBER). In en-* the slot day is AMAZON.Ordinal while in other locales it's AMAZON.NUMBER. Add samples utterances to collect each slot in isolation plus together Also add utterances that do not collect slots (e.g. register my birthday). Make all 3 slots mandatory. Add prompts and enable dialog management via auto-delegate. Add validations for all 3 slots(day between 1 and 31 if NUMBER or in set of 31 days if Ordinal. Month validate as member of the custom value set. Year validate arbitraily as too old or too your (you set the cut years)).
3. *lambda/custom/index.js*: remove en: section in languageStrings. Replace welcome, hello and helps messages in es: section in languageStrings. Rename HelloWorldIntentHandler to RegisterBirthdayIntentHandler. In that same handler change intent name to RegisterBirthdayIntent and then access the itent to fetch all slots (day, month id, month value and year). Say the birthday back to the user