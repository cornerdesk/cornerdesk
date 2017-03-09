Calendars = new Mongo.Collection( 'calendars' );

Calendars.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Calendars.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

let CalendarsSchema = new SimpleSchema({
  'name': {
    type: String,
    label: 'The name of the calendar.'
  }
});

Calendars.attachSchema( CalendarsSchema );