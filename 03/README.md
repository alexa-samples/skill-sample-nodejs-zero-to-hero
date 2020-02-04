# Part 3 - Slots, Slot Validation and Automatic Dialog Delegation

In this module we depart from the previous project and overwrite HelloWorldIntent. We show slots (built-in and custom), synonyms, slot validation and dialogs & prompts with AutoDelegate. Here we also introduce intent chaining in LaunchRequest

## Milestones

1. **Build Tab**: Change invocation name to "happy birthday" in en-*  and to the equivalent translation in your foreign locale
2. **Build Tab**: rename HelloWorldIntent to RegisterBirthdayIntent. Auto delegate should be already enabled when the skill was created
3. **Build Tab**: create slot day, slot type is AMAZON.NUMBER in your foreign locale and AMAZON.Ordinal in en-*. Show json
4. **Build Tab**: create slot month, create slot type MonthType with a list of months. MonthType is a custom slot (for illustration purposes on how to create custom slots we're not using AMAZON.Month). If you want compare solution to using AMAZON.Date
5. **Build Tab**: create slot year, type is AMAZON.Four_Digit.
6. **Build Tab**: create synonyms in month type (eg. "first month of the year", "the first one"). Not used just for illustration purposes
7. **Build Tab**: create utterances that cover collection of slots plus some slot-less utterances (eg. "register my birthday")
8. **Build Tab**: mark day as required, add prompts (including prompt that use the other slots)
9. **Build Tab**: add slot validation to day (eg >= 1 & <= 31 for AMAZON.Number and constrain on set of 1st to 31st for AMAZON.Ordinal)
10. **Build Tab**: mark month as required, add prompts (including prompts that refer to other slots)
11. **Build Tab**: add slot validation to month (show constrain on slot type values and synonyms, mention this is not possible on built-in list slots (eg. AMAZON.Actor))
12. **Build Tab**: mark year as required, add prompts (including prompts that refer to other slots)
13. **Build Tab**: add an arbitrary slot validation to year (eg > 1900 & < 2014) to catch people too young or too old
14. **Build Tab**: explain dialog delegation strategy (fallback to skill, enable, disable) in intent now that prompts have been created. explain conditional validation requires a mixed slot validation approach not covered here: https://developer.amazon.com/docs/custom-skills/delegate-dialog-to-alexa.html#auto-delegate-json (validation for coffee <> validation for tea)
15. **Build Tab**: show Utterance Profiler (how slots are collected)
16. **Code Tab**: Modify help and welcome messages to guide for new utterances (not hello world)
17. **Code Tab**: add intent chaining to birthday registration intent in launch request
18. **Code Tab**: add intent confirmation to register birthday intent

## Concepts

1. Slots explanation
2. Built in and custom slot types
3. Synonyms (minimal, we're not using synonyms, eg. January -> first month)
4. Required Slots & Prompts
5. Slot Validation
6. Auto-Delegate, Dialog Delegation Strategy
7. Utterance Profiler
8. Intent Confirmation
9. Basic Intent Chaining

## Diff

1. *lambda/custom/package.json*: change name and description of project to a happy birthday theme (no change in dependencies)
2. *models/xx-XX.json*: change invocation name to happy birthday theme (eg. happy birthday). Keep fallback intent if the locale supports it (otherwise remove it!). Change HelloWorldIntent to RegisterBirthdayIntent. Add slots: day (AMAZON.Ordinal or AMAZON.NUMBER), month (custom type with 2 digits as month ids) and year (AMAZON.FOUR_DIGIT_NUMBER). In en-* the slot day is AMAZON.Ordinal while in other locales it's AMAZON.NUMBER. Add samples utterances to collect each slot in isolation plus together. Also add utterances that do not collect slots (e.g. register my birthday). Make all 3 slots mandatory. Add prompts and enable dialog management via auto-delegate. Add validations for all 3 slots(day between 1 and 31 if NUMBER or in set of 31 days if Ordinal. Month: validate as member of the custom value set. Year: validate arbitraily as too old or too young (you set the cut years)).
3. *lambda/custom/index.js*: in languageStrings, replace welcome, hello (becomes register) and help messages with new string. Rename HelloWorldIntentHandler to RegisterBirthdayIntentHandler (and also update on module.exports at the bottom). In that same handler change intent name to RegisterBirthdayIntent and then access the itent to fetch all slots (day, month id, month value and year). Say the birthday back to the user (echo the values). Added intent chaining to birthday registration intent in launch request

## Videos

[EN](https://alexa.design/zerotohero3)/[DE](https://alexa.design/de_zerotohero3)/[FR](https://alexa.design/fr_zerotohero3)/[IT](https://alexa.design/it_zerotohero3)/[ES](../README_ES.md)
(EN version includes the following subtitles: EN, DE, PT)