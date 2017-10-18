import { check } from 'meteor/check';
Meteor.publish('calendar', function(calendar, start, end) {
    check(calendar, String);
    check(start, Date);
    check(end, Date);

    let isDirect = calendar.includes('@');

    if (isDirect) {
        let calendarOwner = Meteor.users.findOne({ username: calendar.replace('@', '') });
        return Events.find({
            $or: [{
                    start: { $lte: end }
                },
                {
                    end: { $gte: start }
                }
            ],
            $or: [{
                    isPrivate: false
                },
                {
                    isPrivate: true,
                    ownerId: this.userId
                }
            ],
            ownerId: calendarOwner._id
        });
    } else {
        return Events.find({
            calendar: calendar,
            $or: [{
                    start: { $lte: end }
                },
                {
                    end: { $gte: start }
                }
            ],
            $or: [{
                    isPrivate: false
                },
                {
                    isPrivate: true,
                    ownerId: this.userId
                }
            ]
        });
    }
});