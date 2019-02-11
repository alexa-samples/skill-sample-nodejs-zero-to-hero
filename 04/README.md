# Part 4 - Memory

## Milestones

1. **Code Tab**: create isAlexaHosted() function based on process.env.S3_PERSISTENCE_BUCKET variable
2. **Code Tab**: add DynamoDB and S3 adapter dependency in package.json, add requires in index.js
3. **Code Tab**: create S3 and DynamoDB persistence adapter instances and compare them
4. **Code Tab**: add persistence adapter to skill builder
5. **Code Tab**: save birthday in RegisterBirthdayIntent
6. **Code Tab**: load persistent attributes to session attributes via interceptor, add interceptor to skill builder
7. **Code Tab**: save session attributes to persistent attributes via interceptor, add interceptor to skill builder
8. **Code Tab**: show birthday in TellBirthdayLaunchRequestHandler, call it from LaunchRequest, use Moments.js

## Concepts

1. Session attributes
2. Persistent attributes
3. Persistence adapters (S3 and DynamoDB)
4. Async/await