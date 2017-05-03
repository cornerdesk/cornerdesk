import SimpleSchema from 'simpl-schema';
Kanboards = new Meteor.Collection('kanboards');

let KanboardsSchema = new SimpleSchema({
    'name': {
        type: String,
        label: 'The name of the board.',
        optional: false
    },
    'description': {
        type: String,
        label: 'The description of the board.',
        optional: true
    },
    'isPrivate': {
        type: Boolean,
        label: 'Is the event private.'
    },
    'members': {
        type: Array,
        autoValue() { // eslint-disable-line consistent-return
            if (this.isInsert && !this.isSet) {
                return [{
                    userId: this.userId,
                    isAdmin: true,
                    isActive: true,
                }];
            }
        },
    },
    'members.$': {
        type: Object,
    },
    'members.$.userId': {
        type: String,
    },
    'members.$.isAdmin': {
        type: Boolean,
    },
    'members.$.isActive': {
        type: Boolean,
    },
});

Kanboards.attachSchema(KanboardsSchema);

Kanboards.helpers({
    getType() {
        return 'kanboard';
    },
    /**
     * Is supplied user authorized to view this board?
     */
    isVisibleBy(user) {
        if (this.isPublic()) {
            // public boards are visible to everyone
            return true;
        } else {
            // otherwise you have to be logged-in and active member
            return user && this.isActiveMember(user._id);
        }
    },

    /**
     * Is the user one of the active members of the board?
     *
     * @param userId
     * @returns {boolean} the member that matches, or undefined/false
     */
    isActiveMember(userId) {
        if (userId) {
            return this.members.find((member)(member.userId === userId && member.isActive));
        } else {
            return false;
        }
    },

    isPublic() {
        return !this.isPrivate;
    },

    lists() {
        return Kanlists.find({ kanboard: this._id }, { sort: { sort: 1 } });
    },

    // activities() {
    //     return Activities.find({ boardId: this._id }, { sort: { createdAt: -1 } });
    // },

    activeMembers() {
        return _.where(this.members, { isActive: true });
    },

    activeAdmins() {
        return _.where(this.members, { isActive: true, isAdmin: true });
    },

    memberUsers() {
        return Meteor.users.find({ _id: { $in: _.pluck(this.members, 'userId') } });
    },

    labelIndex(labelId) {
        return _.pluck(this.labels, '_id').indexOf(labelId);
    },

    memberIndex(memberId) {
        return _.pluck(this.members, 'userId').indexOf(memberId);
    },

    hasMember(memberId) {
        return !!_.findWhere(this.members, { userId: memberId, isActive: true });
    },

    hasAdmin(memberId) {
        return !!_.findWhere(this.members, { userId: memberId, isActive: true, isAdmin: true });
    },
    canChangeMembers(memberId) {
        return this.hasAdmin(memberId);
    },
    absoluteUrl() {
        return FlowRouter.url('kanboard', { item: this._id });
    },
    getNonMembers() {
        return Meteor.users.find({ _id: { $nin: _.pluck(this.activeMembers(), 'userId') } })
    },
});

Kanboards.mutations({
    rename(title) {
        check(title, String);
        return { $set: { title } };
    },

    setDescription(description) {
        check(description, String);
        return { $set: { description } };
    },

    setVisibility(visibility) {
        check(visibility, Boolean);
        return { $set: { isPrivate: visibility } };
    },

    addMember(memberId) {
        const memberIndex = this.memberIndex(memberId);
        if (memberIndex >= 0) {
            return {
                $set: {
                    [`members.${memberIndex}.isActive`]: true,
                },
            };
        }

        return {
            $push: {
                members: {
                    userId: memberId,
                    isAdmin: false,
                    isActive: true,
                    isCommentOnly: false,
                },
            },
        };
    },

    removeMember(memberId) {
        const memberIndex = this.memberIndex(memberId);
        // we do not allow the only one admin to be removed
        const allowRemove = (!this.members[memberIndex].isAdmin) || (this.activeAdmins().length > 1);
        if (!allowRemove) {
            return {
                $set: {
                    [`members.${memberIndex}.isActive`]: true,
                },
            };
        }

        return {
            $set: {
                [`members.${memberIndex}.isActive`]: false,
                [`members.${memberIndex}.isAdmin`]: false,
            },
        };
    },

    setMemberPermission(memberId, isAdmin) {
        check(memberId, String);
        check(isAdmin, Boolean);
        const memberIndex = this.memberIndex(memberId);

        // do not allow change permission of self
        if (memberId === Meteor.userId()) {
            isAdmin = this.members[memberIndex].isAdmin;
        }

        return {
            $set: {
                [`members.${memberIndex}.isAdmin`]: isAdmin,
            },
        };
    },
});