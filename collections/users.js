import extractor from 'article-extractor';
import { check } from 'meteor/check';
let _getItem = (type, itemId) => {
    type = type !== undefined ? type : FlowRouter.getRouteName();
    itemId = itemId !== undefined ? itemId : FlowRouter.getParam('item');
    switch (type) {
        case 'kanboard':
            return Kanboards.findOne(itemId);
        case 'channel':
            return Channels.findOne({ name: itemId });
        case 'calendar':
            return Calendars.findOne(itemId);
        case 'kantask':
            return Kantasks.findOne(itemId);
        case 'event':
            return Events.findOne(itemId);
        default:
            return null;
    }
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
        readMessage(messageId) {
            check(messageId, String);
            Messages.findOne(messageId).read(this.userId);
        },
        hasUnreadMessages(channelId) {
            check(channelId, String);
            return Channels.findOne(channelId).hasUnreadMessages(this.userId);
        },
        addPinnedArticle(url) {
            check(url, String);
            let userId = this.userId;
            const getArticleData = Meteor.wrapAsync(extractor.extractData);
            try {
                var pinnedArticle = getArticleData(url);

                pinnedArticle.url = url;
                pinnedArticle.isPrivate = true;
                pinnedArticle.unread = true;
                pinnedArticle.userId = userId;
                Pins.insert(pinnedArticle);
            } catch (exception) {
                throw new Meteor.Error('500', `${ exception }`);
            }
        }
    });
}