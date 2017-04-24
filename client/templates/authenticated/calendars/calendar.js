import handleCalendarSwitch from '../../../modules/handle-calendar-switch';

var eventDateChanged = function(event, duration) {
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
    isPublic() {
        return !Calendars.findOne(FlowRouter.getParam('item')).isPrivate;
    },
    name() {
        return Template.instance().name.get();
    },
    calendar() {
        if (Template.instance().isDirect.get() === true) {
            return null;
        }
        return Calendars.findOne(FlowRouter.getParam('item'));
    }
});

// Au rendu du template calendar
Template.calendar.onRendered(() => {

    Tracker.autorun(() => {
        var $fc = $('#fullcalendar');
        $fc.fullCalendar({
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
            events: function(start, end, tz, callback) {

                //find all, because we've already subscribed to a specific range
                let events = CalHelper.mapDbEventsToEventSource(
                    CalHelper.getEvents(FlowRouter.getParam('calendar'),
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

        var view = $fc.fullCalendar('getView');
        Meteor.subscribe('calendar', Session.get('calendar'), view.start.toDate(), view.end.toDate(), () => {
            $fc.fullCalendar('refetchEvents');
        });
        CalHelper.getEvents(Session.get('calendar'), view.start.toDate(), view.end.toDate()).fetch();
        $fc.fullCalendar('refetchEvents');
    });
});