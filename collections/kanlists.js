Kanlists = new Meteor.Collection('kanlists');

Kanlists.allow({
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
});

Kanlists.attachSchema(KanlistsSchema);