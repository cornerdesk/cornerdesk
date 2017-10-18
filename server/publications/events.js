import { check } from 'meteor/check';
// Publication de la collection Events pour 
// utilisation / affichage côté client et serveur
Meteor.publish('events', function(calendar, start, end) {
    check(calendar, String);
    check(start, Date);
    check(end, Date);

    if (calendar.includes('@')) {
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
    }
    let calObject = Calendars.findOne({ name: calendar });
    return Events.find({
        calendar: calObject._id,
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
});