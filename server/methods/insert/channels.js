Meteor.methods({
    insertChannel(channel) {
        check(channel, {
            name: String,
            description: String,
            isPrivate: Boolean,
        });

        return Channels.insert(channel);
    },
});