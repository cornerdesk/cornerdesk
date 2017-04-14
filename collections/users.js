Meteor.users.allow({
    insert: () => false,
    update: () => false,
    remove: () => false
});

Meteor.users.deny({
    insert: () => true,
    update: () => true,
    remove: () => true
});


if (Meteor.isClient) {
    Meteor.users.helpers({
        isBoardMember() {
            const board = Kanboards.findOne(Session.get('board'));
            return board && board.hasMember(this._id);
        },

        isBoardAdmin() {
            const board = Kanboards.findOne(Session.get('board'));
            return board && board.hasAdmin(this._id);
        },
    });
}