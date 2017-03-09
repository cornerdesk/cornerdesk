import handleCalendarSwitch from '../../modules/handle-calendar-switch';

events = [];

var eventDateChanged = function (event, duration) {
    var modifier = {};
    modifier.start = event.start.toDate();
    modifier.end = event.end.toDate();
    CalHelper.updateEvent(event._id, modifier);
};

Template.calendar.onCreated(() => {
    let template = Template.instance();
    handleCalendarSwitch(template);
});

Template.calendar.helpers({
    isDirect() {
        return Template.instance().isDirect.get();
    },
    name() {
        return Template.instance().name.get();
    }
});

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
            let events = CalHelper.mapDbEventsToEventSource(
                CalHelper.getEvents(FlowRouter.getParam( 'calendar' ),
                    start.toDate(),
                    end.toDate()));
            if (events) {
                callback(events);
            }
        },
        eventClick: ModalHelper.openEventModal,
        select: ModalHelper.openEmptyEventModal,
        eventDrop: eventDateChanged,
        eventResize: eventDateChanged,

    });

    let view = fc.fullCalendar('getView')
    Meteor.subscribe('calendar', FlowRouter.getParam( 'calendar' ), view.start.toDate(), view.end.toDate(), () => {
        fc.fullCalendar('refetchEvents');
    });
    Tracker.autorun(() => {
        var $fc = $('#fullcalendar');
        var view = $fc.fullCalendar('getView');
        CalHelper.getEvents(FlowRouter.getParam( 'calendar' ), view.start.toDate(), view.end.toDate()).fetch();
        $fc.fullCalendar('refetchEvents');
    });
});