var eventDateChanged = function (event, duration) {
    var modifier = {};
    modifier.start = event.start.toDate();
    modifier.end = event.end.toDate();
    CalHelper.updateEvent(event._id, modifier);
};

// Au rendu du template calendar
Template.fcalendar.onRendered(() => {

    var fc = jQuery('#fullcalendar');
    fc.fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        timeFormat: 'HH',
        defaultView: 'agendaWeek',
        editable: true,
        selectable: true,
        aspectRatio: 2,
        events: function (start, end, tz, callback) {
            //find all, because we've already subscribed to a specific range
            let events = CalHelper.mapDbEventsToEventSource(CalHelper.getEvents(start.toDate(), end.toDate()));
            if (events) {
                callback(events);
            }
        },
        eventClick: ModalHelper.openEventModal,
        select: ModalHelper.openEmptyEventModal,
        eventDrop: eventDateChanged,
        eventResize: eventDateChanged,

    });
    
    var view = fc.fullCalendar('getView')
    Meteor.subscribe('events', view.start.toDate(), view.end.toDate(), function () {
        fc.fullCalendar('refetchEvents');
    });

    Tracker.autorun(() => {
        var $fc = $('#fullcalendar');
        var view = $fc.fullCalendar('getView');
        CalHelper.getEvents(view.start.toDate(), view.end.toDate()).fetch();
        $fc.fullCalendar('refetchEvents');
    });
});