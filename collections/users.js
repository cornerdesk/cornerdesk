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

        getInitials() {
            const profile = this.profile || {};

            if (profile.name) {
                let initials = profile.name.first[0] + profile.name.last[0];
                return initials.toUpperCase();
            } else {
                return this.username[0].toUpperCase();
            }
        },
        isBoardMember() {
            const board = Kanboards.findOne(Session.get('board'));
            return board && board.hasMember(this._id);
        },

        isBoardAdmin() {
            const board = Kanboards.findOne(Session.get('board'));
            return board && board.hasAdmin(this._id);
        },

        isCalendarMember() {
            const cal = Calendars.findOne(Session.get('calendar'));
            return cal && cal.hasMember(this._id);
        },

        isCalendarAdmin() {
            const cal = Kanboards.findOne(Session.get('calendar'));
            return cal && cal.hasAdmin(this._id);
        },

        isChannelMember() {
            const channel = Kanboards.findOne(Session.get('channel'));
            return channel && channel.hasMember(this._id);
        },

        isChannelAdmin() {
            const channel = Kanboards.findOne(Session.get('channel'));
            return channel && channel.hasAdmin(this._id);
        },
    });
}