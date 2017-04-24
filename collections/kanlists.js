import SimpleSchema from 'simpl-schema';
Kanlists = new Meteor.Collection('kanlists');

Kanlists.allow({
    insert: () => false,
    update: () => false,
    remove: () => false
});

Kanlists.deny({
    insert: () => true,
    update: () => true,
    remove: () => true
});

let KanlistsSchema = new SimpleSchema({
    'title': {
        type: String,
        label: 'The name of the board.',
        optional: false
    },
    'kanboard': {
        type: String,
        label: 'The id of the board the list belongs to.',
        optional: true
    },
    'ownerId': {
        type: String,
        label: 'The id of the user the list belongs to.',
        optional: false
    },
    'order': {
        type: Number,
        label: 'Order of the list',
        optional: true
    }
});

Kanlists.attachSchema(KanlistsSchema);