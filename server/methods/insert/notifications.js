Meteor.methods({
    readNotification(notificationId) {
        check(notificationId, String);

        try {
            let notification = Notifications.findOne(notificationId);
            if (notification.userId === this.userId) {
                notification.read();
            }
        } catch (exception) {
            throw new Meteor.Error('500', `${ exception }`);
        }
    }
});