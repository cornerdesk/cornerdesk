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
        optional: false
    },
    'ownerId': {
        type: String,
        label: 'The id of the user the list belongs to.',
        optional: false
    },
});

Kantasks.attachSchema(KantasksSchema);