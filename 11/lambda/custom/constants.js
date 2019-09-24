module.exports = {
    // we now specify which attributes are saved (see the save interceptor below)
    PERSISTENT_ATTRIBUTES_NAMES: ['day', 'month', 'monthName', 'year', 'sessionCounter', 'reminderId'],
    // these are the permissions needed to fetch the first name
    GIVEN_NAME_PERMISSION: ['alexa::profile:given_name:read'],
    // these are the permissions needed to send reminders
    REMINDERS_PERMISSION: ['alexa::alerts:reminders:skill:readwrite'],
    // max number of entries to fetch from the external API
    MAX_BIRTHDAYS: 5,
    // APL documents
    APL: {
        launchDoc: require('./documents/launchScreen.json'),
        listDoc: require('./documents/listScreen.json')
    },
    // only necessary if you didn't deploy this project as an Alexa Hosted Skill
    BASE_S3_URL: 'Replace this with your S3 base url with images (skip the Media directory here, end it in .com)'
}
