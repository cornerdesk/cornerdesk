import handleEventInsert from '../../../modules/handle-event-insert';

let dateFormat = 'DD/MM/YYYY HH:mm';
Template.eventModal.helpers({
    event: () => {
        let event = Session.get('selectedEvent');

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
    formatDate: (date) => {
        let event = Session.get('selectedEvent');
        if (typeof event === 'undefined') {
            return '';
        }
        return moment(date.toISOString()).format(dateFormat);
    },
    isOwner: () => {
        return Session.get('selectedEvent').ownerId === Meteor.userId();
    },
    readonly: () => {
        return Session.get('selectedEvent').ownerId === Meteor.userId() ? '' : 'disabled';
    }
});

Template.eventModal.events({
    'click #save': (event, template) => {
        handleEventInsert(event, template);

        Modal.hide('eventModal');
    }
});

Template.eventModal.onRendered(() => {
    Tracker.autorun(() => {
        let $form = this.$('#eventEditorForm');
        let event = Session.get('selectedEvent');
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
        $form.find('#event-start').bootstrapMaterialDatePicker({ format: dateFormat, currentDate: moment(event.start.toISOString()), switchOnClick: true });
        $form.find('#event-end').bootstrapMaterialDatePicker({ format: dateFormat, currentDate: moment(event.end.toISOString()), switchOnClick: true });
        $form.find('#event-id').val(event._id);
        $form.find('#event-description').val(event.description);
        $("#event-start").on("dateSelected", (e) => {
            $('#event-end').bootstrapMaterialDatePicker("setMinDate", e.date);
        });
    });
});