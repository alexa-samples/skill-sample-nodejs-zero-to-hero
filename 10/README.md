# Part 10 - ASK CLI

#   # Milestones

1. *CLI*: Install ASL CLI via NPM
2. *CLI*: Do an "ask init"
3. *CLI*: Try "ask clone"
4. *CLI*: Update ask-sdk-core to 2.6.0 and implement ASK SDK Utils
5. *CLI*: Explain dev cycle -> git commit & ask deploy (with VS Code plugin)

## Concepts

1. Configuring the ASK-CLI with personal AWS account support
2. Cloning an Alexa Hosted Skill
3. Editing a skill in code and deploying the skill
4. ASK SDK Utilities

## Diff

1. **images/**: moved images directory to top level
2. **.ask/config**: this new file now includes deployment data
3. **skill.json**: this file now includes deployment data (+uri)
4. **index.js**: add interceptors.SDKUtilitiesRequestInterceptor to request interceptors
5. **handlers.js**: 
6. **interceptors.js**: add ask-sdk-core dependency to bring SDK Utilities functions. Add SDKUtilitiesRequestInterceptor. Replace with isNewSession() in LoadAttributesRequestInterceptor. Replace with getDeviceid() in LoadTimezoneRequestInterceptor

