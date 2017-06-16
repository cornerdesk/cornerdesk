Meteor.publish('notifications', function(date) {
    return Notifications.find({
        userId: this.userId,
        unread: true
    });
});