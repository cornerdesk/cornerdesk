Meteor.publish('sidebar', function() {
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
        Kanboards.find({
            $or: [{
                    isPrivate: false,
                },
                { members: { $elemMatch: { userId: this.userId, isActive: true } } },
            ],
        }),
        Meteor.users.find({ _id: { $ne: this.userId } }, { fields: { username: 1, 'profile.name': 1 } })
    ];
});