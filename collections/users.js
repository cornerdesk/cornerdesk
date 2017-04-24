let _getItem = () => {
    let type = FlowRouter.getRouteName(),
        itemId = FlowRouter.getParam('item');
    switch (type) {
        case 'kanboard':
            return Kanboards.findOne(itemId);
            break;
        case 'channel':
            return Channels.findOne({ name: itemId });
            break;
        case 'calendar':
            return Calendars.findOne(itemId);
            break;
    }
    return null;
}

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
        isItemAdmin() {
            let item = _getItem();
            return item.hasAdmin(this._id);
        },
        isItemMember() {
            let item = _getItem();
            return item.hasMember(this._id);
        },
    });
}

if (Meteor.isServer) {
    Meteor.methods({
        inviteUserTo(type, itemId, memberId) {
            check(type, String);
            check(itemId, String);
            check(memberId, String);

            let item;
            switch (type) {
                case 'kanboard':
                    item = Kanboards.findOne(itemId);
                    break;
                case 'channel':
                    item = Channels.findOne(itemId);
                    break;
                case 'calendar':
                    item = Calendars.findOne(itemId);
                    break;
            }
            if (item.memberIndex(memberId) >= 0) {
                throw new Error('User is already a member.');
            }
            item.addMember(memberId);
        },
    });
}