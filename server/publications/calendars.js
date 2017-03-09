Meteor.publish('calendar', function (calendar, start, end) {
    check(calendar, String);
    check(start, Date);
    check(end, Date);

    let isDirect = calendar.includes( '@' );

    if (isDirect) {
        let user = Meteor.users.findOne({ username: calendar.replace('@', '') });
        return Events.find({
            ownerId: user._id,
            start: {
                $gte: start
            },
            end: {
                $lte: end
            }
        });
    } else {
        let selectedCalendar = Calendars.findOne({ name: calendar });
        return Events.find({
            calendar: selectedCalendar._id,
            start: {
                $gte: start
            },
            end: {
                $lte: end
            }
        });
    }
});