ModalHelper = {};

ModalHelper.openEmptyEventModal = function (start, end, allDay, jsEvent, view) {
  if (typeof allDay !== 'boolean') {
    allDay = false;
  }
  var calEvent = CalHelper.eventWithDates({
    title: '',
    color: '#51c2bf',
    start: start,
    end: end,
    description: '',
    allDay: allDay,
    isPrivate: true,
    ownerId: Meteor.userId()
  });
  Session.set('selectedEvent', calEvent);
  Modal.show('eventModal', function() { return calEvent; });
}

ModalHelper.openEventModal = function (calEvent, jsEvent, view) {
  calEvent = CalHelper.eventWithDates({
    _id: calEvent._id,
    title: calEvent.title,
    color: calEvent.color,
    start: calEvent.start,
    end: calEvent.end,
    description: calEvent.description,
    allDay: calEvent.allDay,
    isPrivate: calEvent.isPrivate,
    ownerId: calEvent.ownerId
  });
  Session.set('selectedEvent', calEvent);
  Modal.show('eventModal', function() { return calEvent; });
}