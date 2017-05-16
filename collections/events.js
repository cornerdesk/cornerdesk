import SimpleSchema from 'simpl-schema';
// Définition de la collection Events dans la base MongoDB
Events = new Meteor.Collection('events');


// Autorisation d'ajout si:
Events.allow({
    insert: function(userId, doc) {
        if (userId) {
            return true;
        }
        return false;
    },
    update: function(userId, doc, fields, modifier) {
        if (userId && doc.ownerId === userId) {
            return true;
        }
    }
});

let EventsSchema = new SimpleSchema({
    'calendar': {
        type: String,
        label: 'The ID of the calendar this event belongs to.',
        optional: true
    },
    'title': {
        type: String,
        label: 'The title of the event.'
    },
    'color': {
        type: String,
        label: 'The color of the event.'
    },
    'start': {
        type: Date,
        label: 'The start date and time of the event.'
    },
    'end': {
        type: Date,
        label: 'The start date and time of the event.'
    },
    'description': {
        type: String,
        label: 'The description of the event.',
        optional: true
    },
    'allDay': {
        type: Boolean,
        label: 'Is the event during all the day.'
    },
    'isPrivate': {
        type: Boolean,
        label: 'Is the event private.'
    },
    'ownerId': {
        type: String,
        label: 'The ID of the user that created this event.'
    },
    'members': {
        type: Array,
        optional: true,
    },
    'members.$': {
        type: Object,
    },
    'members.$.userId': {
        type: String,
    },
});

Events.attachSchema(EventsSchema);

Events.helpers({
    getCalendarName() {
        if (this.calendar !== null) {
            let calendar = Calendars.findOne(this.calendar);
            return calendar.name;
        }
    },
    getType() {
        return 'event';
    },
    activeMembers() {
        return this.members;
    },
    hasMember(memberId) {
        return !!_.findWhere(this.members, { userId: memberId });
    },
    getCalendar() {
        return Calendars.findOne(this.calendar);
    },
    canChangeMembers(memberId) {
        let cal = this.getCalendar();
        return !cal || cal.hasMember(memberId) || cal.isPublic();
    },
    getNonMembers() {
        let cal = this.getCalendar();
        if (!cal || cal.isPublic()) {
            return Meteor.users.find({ _id: { $nin: _.pluck(this.members, 'userId') } });
        }
        return Meteor.users.find({ _id: { $in: _.pluck(cal.activeMembers(), 'userId'), $nin: _.pluck(this.members, 'userId') } });
    },
});

Events.mutations({
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