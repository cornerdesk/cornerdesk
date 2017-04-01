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
});

Kanboards.attachSchema(KanboardsSchema);