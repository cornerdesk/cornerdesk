import SimpleSchema from 'simpl-schema';
Kantasks = new Meteor.Collection('kantasks');

Kantasks.allow({
    insert: () => false,
    update: () => false,
    remove: () => false
});

Kantasks.deny({
    insert: () => true,
    update: () => true,
    remove: () => true
});

const KantasksSchema = new SimpleSchema({
    'title': {
        type: String,
        label: 'The name of the task.',
        optional: false
    },
    'description': {
        type: String,
        label: 'The description of the task.',
        optional: true
    },
    'kanlist': {
        type: String,
        label: 'The id of the list the task belongs to.',
        optional: false
    },
    'createdAt': {
        type: Date,
        label: 'System date of the creation of the date',
        optional: false,
        autoValue() { // eslint-disable-line consistent-return
            if (this.isInsert && !this.isSet) {
                return new Date();
            }
        },
    },
    'ownerId': {
        type: String,
        label: 'The id of the user the list belongs to.',
        optional: false,
        autoValue() { // eslint-disable-line consistent-return
            if (this.userId && !this.isSet) {
                return this.userId;
            }
        },
    },
    'members': {
        type: Array,
    },
    'members.$': {
        type: Object,
    },
    'members.$.userId': {
        type: String,
    },
});

Kantasks.attachSchema(KantasksSchema);

Kantasks.helpers({
    getType() {
        return 'kantask';
    },
    activeMembers() {
        return this.members;
    },
    hasMember(memberId) {
        return !!_.findWhere(this.members, { userId: memberId });
    },
    canChangeMembers(memberId) {
        let board = Kanboards.findOne(Kanlists.findOne(this.kanlist));
        return !board || board.hasMember(memberId) || board.isPublic();
    }
});

Kantasks.mutations({
    rename(title) {
        check(title, String);
        return { $set: { title } };
    },

    setDescription(description) {
        check(description, String);
        return { $set: { description } };
    },

    addMember(memberId) {
        if (this.hasMember(memberId) === true) {
            return;
        }
        return {
            $push: {
                members: {
                    userId: memberId,
                },
            },
        };
    },

    removeMember(memberId) {
        check(memberId, String);
        return {
            $pull: {
                members: { userId: memberId },
            },
        };
    },
});