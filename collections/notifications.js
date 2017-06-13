import SimpleSchema from 'simpl-schema';
Notifications = new Mongo.Collection('notifications');

let NotificationsSchema = new SimpleSchema({
    'item': {
        type: String,
        label: 'The item id the notification refers to',
        optional: true
    },
    'itemType': {
        type: String,
        label: 'The type of the item',
        optional: true
    },
    'message': {
        type: String
    },
    'ownerId': {
        type: String,
        label: 'The user who is the origin of the notification',
        autoValue() {
            if (this.isInsert && !this.isSet) {
                return Meteor.userId();
            }
        }
    },
    'userId': {
        type: String,
        label: 'The user the notification is for',
    },
    'unread': {
        type: Boolean,
        autoValue() {
            if (this.isInsert && !this.isSet) {
                return true;
            }
        }
    },
    'url': {
        type: String,
        label: 'The URL to redirect to',
        optional: true
    },
    'date': {
        type: Date,
        label: 'The date the notifications has to be shown',
    },
    'createdAt': {
        type: Date,
        autoValue() {
            if (this.isInsert && !this.isSet) {
                return new Date();
            }
        }
    }
});

Notifications.attachSchema(NotificationsSchema);