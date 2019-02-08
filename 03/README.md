# Part 3 - Slots and Slot Validation

## Milestones

1. **Build Tab**: create Alexa-hosted skill from scratch, select your locale. 
2. **Build Tab**: Change invocation name to "happy birthday" in your language (all strings in english go in your lang from now on). Show json
3. **Build Tab**: create RegisterBirthdayIntent (output message is "Happy Birthday!"), mention Dialog Delegation strategy will be enabled later. Show json
4. **Build Tab**: create slot day, type is AMAZON.Number. Show json
5. **Build Tab**: create slot month, create slot type MonthType. Type is custom (for illustration purposes is not AMAZON.Month). Compare solution to using AMAZON.Date
6. **Build Tab**: create slot year, type is AMAZON.Four_Digit.
7. **Build Tab**: create synonyms in month (eg. "first month of the year", "the first one")
8. **Build Tab**: create utterances that cover collection of all slots plus some slot-less utterances (eg. "register my birthday")
9. **Build Tab**: mark day as required, add prompts (including propmpt that use the other slots)
10. **Build Tab**: add slot validation to day (>= 1 & <= 31)
11. **Build Tab**: mark month as required, add prompts (including prompts that refer to other slots)
12. **Build Tab**: add slot validation to month (show constrain on slot type values and synonyms, mention this is not possible on built-in list slots (eg. AMAZON.Actor))
13. **Build Tab**: mark year as required, add prompts (including prompts that refer to other slots)
14. **Build Tab**: add slot validation to year (> 1900 & < 2014)
15. **Build Tab**: explain dialog delegation strategy (fallback to skill, enable, disable) in intent now that propmpts have been created. explain conditional validation requires a mixed slot validation approach: https://developer.amazon.com/docs/custom-skills/delegate-dialog-to-alexa.html#auto-delegate-json (validation for coffee <> validation for tea)
16. **Code Tab**: modify HelloWorldIntent to become BirthdayIntent. Modify help and welcome messages to guide for new utterances (not hello world)

## Concepts

1. Slot explanation
2. Built in and custom slot types
3. Synonyms
4. Required Slots & Prompts
5. Slot Validation
6. Auto-Delegate, Dialog Delegation Strategy