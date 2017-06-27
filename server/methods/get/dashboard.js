Meteor.methods({
    getDashboardData() {
        let that = this;
        return {
            personal: {
                kanboard: {},
                calendar: {}
            },
            kanboards: Kanboards.find({
                $or: [{
                        isPrivate: false,
                    },
                    { members: { $elemMatch: { userId: that.userId, isActive: true } } },
                ],
            }).map(function(doc, index, cursor) {
                return {
                    title: doc.name,
                    url: doc.absoluteUrl(),
                    lists: Kanlists.find({ kanboard: doc._id }).map(function(doc, index, cursor) {
                        return {
                            title: doc.title,
                            affectedTasks: doc.getNumberOfAffectedTasksTo(that.userId),
                            totalTasks: doc.getNumberOfTasks()
                        }
                    })
                };
            }),
            calendars: Calendars.find({
                $or: [{
                        isPrivate: false,
                    },
                    { members: { $elemMatch: { userId: that.userId, isActive: true } } },
                ],
            }).map(function(doc, index, cursor) {
                return {
                    title: doc.name,
                    url: doc.absoluteUrl(),
                    todayEvents: doc.getNumberOfEventForDay(),
                    totalEvents: doc.getNumberOfEvents()
                };
            }),
            chats: []
        };

    }
})