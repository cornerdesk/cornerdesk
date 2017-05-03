let _getItem = (type, itemId) => {
    type = type !== undefined ? type : FlowRouter.getRouteName();
    itemId = itemId !== undefined ? itemId : FlowRouter.getParam('item');
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
        case 'kantask':
            return Kantasks.findOne(itemId);
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
        isItemAdmin(type, itemId) {
            let item = (!!type && !!itemId) ? _getItem(type, itemId) : _getItem();
            return item.hasAdmin(this._id);
        },
        isItemMember(type, itemId) {
            let item = (!!type && !!itemId) ? _getItem(type, itemId) : _getItem();
            return item.hasMember(this._id);
        },
        canChangeMembers(type, itemId) {
            let item = (!!type && !!itemId) ? _getItem(type, itemId) : _getItem();
            return item.canChangeMembers(this._id);
        }
    });
}

if (Meteor.isServer) {
    Meteor.methods({
        inviteUserTo(type, itemId, memberId) {
            check(type, String);
            check(itemId, String);
            check(memberId, String);

            let item = _getItem(type, itemId);
            if (item.canChangeMembers(this.userId)) {
                item.addMember(memberId);
                return true;
            }
            return false;
        },
        removeUserFrom(type, itemId, memberId) {
            check(type, String);
            check(itemId, String);
            check(memberId, String);

            let item = _getItem(type, itemId);
            if (item.canChangeMembers(this.userId) && item.hasMember(memberId)) {
                item.removeMember(memberId);
                return true;
            }
            return false;
        },
    });
}