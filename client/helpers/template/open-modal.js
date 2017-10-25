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
    Modal.show('eventModal', () => { return Events._transform(calEvent); });
};

ModalHelper.openEventModal = (calEvent, jsEvent, view) => {
    Modal.show('eventModal', () => { return Events.findOne(calEvent._id); });
};

ModalHelper.openKantaskModal = (task, jsEvent, view) => {
    Modal.show('kantaskDetails', () => { return task; });
};