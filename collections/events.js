// Définition de la collection Events dans la base MongoDB
Events = new Meteor.Collection('events');


// Autorisation d'ajout si:
Events.allow({
  insert: function (userId, doc) {
    if (userId) {
      return true;
    }
    return false;
  },
  update: function (userId, doc, fields, modifier) {
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
  }
});

Events.attachSchema( EventsSchema );