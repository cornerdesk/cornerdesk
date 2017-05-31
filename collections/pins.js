import SimpleSchema from 'simpl-schema';
Pins = new Mongo.Collection('pins');

let PinsSchema = new SimpleSchema({
    'title': {
        type: String,
        optional: true,
        label: 'The given name of the article'
    },
    'url': {
        type: String,
        label: 'URL of the original article.'

    },
    'userId': {
        type: String,
        label: 'The user this article belongs to.'
    },
    'isPrivate': {
        type: Boolean,
        label: 'Is the pinned article private.'
    },
    'unread': {
        type: Boolean,
        label: 'Is the article unread'
    },
    'author': {
        type: String,
        label: 'Author of the article',
        optional: true
    },
    'content': {
        type: String,
        label: 'Content of the article',
        optional: true
    },
    'summary': {
        type: String,
        label: 'The summary of the article',
        optional: true
    },
    'domain': {
        type: String,
        label: 'The domain of the article',
        optional: true
    }
});


Pins.attachSchema(PinsSchema);