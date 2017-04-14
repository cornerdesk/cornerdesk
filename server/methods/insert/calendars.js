Meteor.methods({
    insertCalendar(calendar) {
        check(calendar, {
            name: String,
            description: String,
            isPrivate: Boolean,
        });

        return Calendars.insert(calendar);
    },
});