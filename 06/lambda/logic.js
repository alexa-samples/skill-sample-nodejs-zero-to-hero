const moment = require('moment-timezone'); // will help us do all the dates math while considering the timezone
const util = require('./util');

module.exports = {
    getBirthdayData(day, month, year, timezone) {
        const today = moment().tz(timezone).startOf('day');
        const wasBorn = moment(`${month}/${day}/${year}`, "MM/DD/YYYY").tz(timezone).startOf('day');
        const nextBirthday = moment(`${month}/${day}/${today.year()}`, "MM/DD/YYYY").tz(timezone).startOf('day');
        if (today.isAfter(nextBirthday)) {
            nextBirthday.add(1, 'years');
        }
        const age = today.diff(wasBorn, 'years');
        const daysAlive = today.diff(wasBorn, 'days');
        const daysUntilBirthday = nextBirthday.startOf('day').diff(today, 'days'); // same day returns 0

        return {
            daysAlive: daysAlive, // not used but nice to have :)
            daysUntilBirthday: daysUntilBirthday,
            age: age //in years
        }
    },
    createBirthdayReminder(daysUntilBirthday, timezone, locale, message) {
        moment.locale(locale);
        const createdMoment = moment().tz(timezone);
        let triggerMoment = createdMoment.startOf('day').add(daysUntilBirthday, 'days');
        if (daysUntilBirthday === 0) {
            triggerMoment = createdMoment.startOf('day').add(1, 'years'); // reminder created on the day of birthday will trigger next year
        }
        console.log('Reminder schedule: ' + triggerMoment.format('YYYY-MM-DDTHH:mm:00.000'));

        return util.createReminder(createdMoment, triggerMoment, timezone, locale, message);
    }
}
