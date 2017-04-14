ModalHelper = {};

ModalHelper.openEmptyEventModal = (start, end, allDay, jsEvent, view) => {
    if (!CalHelper.canInsert()) {
        return;
    }
    if (typeof allDay !== 'boolean') {
        allDay = false;
    }
    let calEvent = CalHelper.eventWithDates({
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
    Modal.show('eventModal', () => { return calEvent; });
};

ModalHelper.openEventModal = (calEvent, jsEvent, view) => {
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
    Modal.show('eventModal', () => { return calEvent; });
};

ModalHelper.showModal = (name, event, view) => {
    Modal.show(name);
};