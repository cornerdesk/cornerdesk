import { check } from 'meteor/check';
Meteor.publish('pins', function(username) {
    check(username, String);

    if (username.includes('@')) {
        username = username.replace('@', '');
    }
    let owner = Meteor.users.findOne({ username: username });
    return Pins.find({
        $or: [{
                isPrivate: false
            },
            {
                isPrivate: true,
                userId: this.userId
            }
        ],
        userId: owner._id
    });
});