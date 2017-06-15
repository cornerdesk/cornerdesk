import SimpleSchema from 'simpl-schema';
Messages = new Mongo.Collection('messages');

Messages.allow({
    insert: () => false,
    update: () => false,
    remove: () => false
});

Messages.deny({
    insert: () => true,
    update: () => true,
    remove: () => true
});

let MessagesSchema = new SimpleSchema({
    'channel': {
        type: String,
        label: 'The ID of the channel this message belongs to.',
        optional: true
    },
    'to': {
        type: String,
        label: 'The ID of the user this message was sent directly to.',
        optional: true
    },
    'owner': {
        type: String,
        label: 'The ID of the user that created this message.'
    },
    'iconClass': {
        type: String,
        optional: true
    },
    'timestamp': {
        type: Date,
        label: 'The date and time this message was created.'
    },
    'message': {
        type: String,
        label: 'The content of this message.'
    },
    'unreads': {
        type: Array,
        autoValue() { // eslint-disable-line consistent-
            if (this.isInsert && !this.isSet) {
                if (this.field('to').isSet) {
                    return [this.field('to').value]
                }
                let channel = Channels.findOne(this.field('channel').value);
                // TODO: public ?
                return _.pluck(channel.activeMembers(), 'userId');
            }
        },
        optional: true,
    },
    'unreads.$': {
        type: String
    }
});

Messages.attachSchema(MessagesSchema);

Messages.helpers({
    isUnread: function() {
        return _.contains(this.unreads, Meteor.userId());
    }
});

Messages.mutations({
    read(userId) {
        if (this.isUnread()) {
            return {
                $pull: {
                    unreads: userId,
                },
            }
        }
    }
});

Messages.after.insert((userId, doc) => {
    if (!!doc.to) {
        var user = Meteor.users.findOne(userId);
        Notifications.insert({
            userId: doc.to,
            message: doc.message,
            date: new Date(),
            iconClass: 'ti-comments',
            url: FlowRouter.path('channel', { item: '@' + user.username })
        });
    }
});