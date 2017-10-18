import { check } from 'meteor/check';
Meteor.publish('kanboards', function() {
    return Kanboards.find({
        archived: false,
        $or: [{
                isPrivate: false,
            },
            { members: { $elemMatch: { userId: this.userId, isActive: true } } },
        ],
    });
});

Meteor.publish('kanboardMembers', (kanboard) => {
    check(kanboard, String);

    return Kanboards.findOne(kanboard).activeMembers();
});

Meteor.publish('kanboard', function(isDirect, kanboard) {
    check(isDirect, Boolean);
    check(kanboard, String);

    if (isDirect) {
        let user = Meteor.users.findOne({ username: kanboard.replace('@', '') });
        return Kanlists.find({
            ownerId: user._id,
            kanboard: null
        });
    } else {
        let selectedKanboard = Kanboards.findOne(kanboard);
        return Kanlists.find({ kanboard: selectedKanboard._id });
    }
});