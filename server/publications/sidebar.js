Meteor.publish('sidebar', function() {
    let that = this;
    var channelsIds = Channels.find({
        $or: [{
                isPrivate: false,
            },
            { members: { $elemMatch: { userId: this.userId, isActive: true } } },
        ],
    }, { fields: { _id: 1 } }).fetch();

    return [
        Calendars.find({
            $or: [{
                    isPrivate: false,
                },
                { members: { $elemMatch: { userId: this.userId, isActive: true } } },
            ],
        }),
        Channels.find({
            $or: [{
                    isPrivate: false,
                },
                { members: { $elemMatch: { userId: this.userId, isActive: true } } },
            ],
        }),
        Messages.find({
            channel: {
                $in: _.pluck(channelsIds, '_id')
            }
        }, { fields: { channel: 1, unreads: 1 } }),
        Kanboards.find({
            $or: [{
                    isPrivate: false,
                },
                { members: { $elemMatch: { userId: this.userId, isActive: true } } },
            ],
        }),
        Meteor.users.find({ _id: { $ne: this.userId } }, { fields: { username: 1, 'profile.name': 1 } }),
        presences.find({}, { fields: { state: true, userId: true } })
    ];
});