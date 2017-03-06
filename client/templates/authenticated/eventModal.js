var dateFormat = 'DD/MM/YYYY HH:mm';
Template.eventModal.helpers({
    event: function () {
        var event = Session.get('selectedEvent');

        if (typeof event !== "undefined") {
            return event;
        } else {
            return {
                title: '',
                start: '',
                end: '',
                description: '',
                color: '#51c2bf',
                allDay: false,
                isPrivate: true,
                ownerId: Meteor.userId()
            }
        }
    },
    formatDate: function (date) {
        var event = Session.get('selectedEvent');
        if (typeof event === 'undefined') {
            return '';
        }
        return moment(date.toISOString()).format(dateFormat);
    },
    isOwner: function () {
        return Session.get('selectedEvent').ownerId === Meteor.userId();
    },
    readonly: function() {
        return Session.get('selectedEvent').ownerId === Meteor.userId() ? '' : 'disabled';
    }
});

Template.eventModal.events({
    'click #save': function (e) {
        e.preventDefault();
        var $form = jQuery('#eventModal form');
        var title = $form.find('#event-title').val();
        var color = $form.find('#event-color').val();
        var isPrivate = $form.find('#event-private').is(':checked');
        var allDay = $form.find('#event-allday').is(':checked');
        var start = moment($form.find('#event-start').val(), dateFormat).toDate();
        var end = moment($form.find('#event-end').val(), dateFormat).toDate();
        var eventId = $form.find('#event-id').val();
        var description = $form.find('#event-description').val();
        if (eventId === "") {
            CalHelper.createEvent(title, color, start, end, description, allDay, isPrivate);
        } else {
            var calEvent = Events.findOne({ _id: eventId });
            var modifier = {};
            if (calEvent.title !== title)
                modifier.title = title;
            if (calEvent.color !== color)
                modifier.color = color;
            if (calEvent.start.toLocaleString() !== start.toLocaleString())
                modifier.start = start;
            if (calEvent.end.toLocaleString() !== end.toLocaleString())
                modifier.end = end;
            if (calEvent.allDay !== allDay)
                modifier.allDay = allDay;
            if (calEvent.isPrivate !== isPrivate)
                modifier.isPrivate = isPrivate;
            if (calEvent.description !== description)
                modifier.description = description;

            CalHelper.updateEvent(calEvent._id, modifier);
        }

        Modal.hide('eventModal');
    }
});

Template.eventModal.onRendered(() => {
    var $form = jQuery('#eventModal form');
    var event = Session.get('selectedEvent');
    $form.find('#event-title').val(event.title);
    $form.find('#eventColorPicker').colorpicker({
        color: event.color,
        colorSelectors: {
            'black': '#000000',
            'white': '#ffffff',
            'red': '#FF0000',
            'default': '#777777',
            'primary': '#337ab7',
            'success': '#5cb85c',
            'info': '#5bc0de',
            'warning': '#f0ad4e',
            'danger': '#d9534f'
        },
        horizontal: true
    });

    $form.find('#event-private').attr('checked', event.isPrivate);
    $form.find('#event-allday').attr('checked', event.allDay);
    $form.find('#event-start').datetimepicker({ format: dateFormat, defaultDate: moment(event.start.toISOString()).format() });
    $form.find('#event-end').datetimepicker({ format: dateFormat, defaultDate: moment(event.end.toISOString()).format() });
    $form.find('#event-id').val(event._id);
    $form.find('#event-description').val(event.description);
    $("#event-start").on("dp.change", function (e) {
        $('#event-end').data("DateTimePicker").minDate(e.date);
    });
});