Meteor.publish('kanboard', function(isDirect, kanboard) {
    check(isDirect, Boolean);
    check(kanboard, String);

    if (isDirect) {
        let user = Meteor.users.findOne({ username: kanboard.replace('@', '') });
        return Kanlists.find({
            ownerId: this.userId
        });
    } else {
        let selectedKanboard = Kanboards.findOne(kanboard);
        return Kanlists.find({ kanboard: selectedKanboard._id });
    }
});