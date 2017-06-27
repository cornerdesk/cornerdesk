import handleEventInsert from '../../../modules/handle-event-insert';

let dateFormat = 'DD/MM/YYYY HH:mm';
Template.eventModal.helpers({
    event: () => {
        let event = Template.instance().data;

        if (typeof event !== "undefined") {
            return Events._transform(event);
        } else {
            return Events._transform({
                title: '',
                start: '',
                end: '',
                description: '',
                color: '#51c2bf',
                allDay: false,
                isPrivate: true,
                ownerId: Meteor.userId()
            });
        }
    },
    calendarName: () => {
        let event = Template.instance().data,
            item = Events.findOne(event._id);
        if (item === undefined || item.calendar === null || item.calendar === undefined || item.calendar === Session.get('item')) {
            return '';
        }
        return ' (' + item.getCalendarName() + ')';
    },
    formatDate: (date) => {
        let event = Template.instance().data;
        if (typeof event === 'undefined') {
            return '';
        }
        return moment(date.toISOString()).format(dateFormat);
    },
    isOwner: () => {
        return Template.instance().data.ownerId === Meteor.userId();
    },
    readonly: () => {
        return Template.instance().data.ownerId === Meteor.userId() ? '' : 'disabled';
    }
});

Template.eventModal.events({
    'click #save': (event, template) => {
        handleEventInsert(event, template);

        Modal.hide('eventModal');
    },
    'click .removeEventBtn': (event, template) => {
        let $that = $(event.target);
        sweetAlert({
                title: "Delete?",
                text: "Do you really wan't to do this ?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            (confirmation) => {
                sweetAlert.close();
                if (confirmation === false) {
                    return;
                }
                Meteor.call('removeEvent', $that.data('id'), (err) => {
                    if (!!err) {
                        Bert.alert('An error occured.', 'danger');
                        return;
                    }

                    Bert.alert('Done ! You will not see this event anymore.', 'success');
                    Modal.hide('eventModal');
                });
            });
    }
});

Template.eventModal.onRendered(() => {
    Tracker.autorun(() => {
        let template = Template.instance();
        let $form = this.$('#eventEditorForm');
        let event = template.data;
        $form.find('#event-title').val(event.title);

        // <i style="background-color: rgb(244, 67, 54);"></i><i style="background-color: rgb(233, 30, 99);"></i><i style="background-color: rgb(156, 39, 176);"></i>' +
        //         '<i style="background-color: rgb(103, 58, 183);"></i><i style="background-color: rgb(63, 81, 181);"></i><i style="background-color: rgb(33, 150, 243);"></i><i></i>' +
        //         '<i style="background-color: rgb(0, 188, 212);"></i><i style="background-color: rgb(0, 150, 136);"></i><i style="background-color: rgb(76, 175, 80);"></i>' +
        //         '<i style="background-color: rgb(139, 195, 74);"></i><i style="background-color: rgb(205, 220, 57);"></i><i style="background-color: rgb(255, 235, 59);"></i>' +
        //         '<i style="background-color: rgb(255, 193, 7);"></i><i style="background-color: rgb(255, 152, 0);"></i><i style="background-color: rgb(255, 87, 34);"></i>' +
        //         '<i style="background-color: rgb(121, 85, 72);"></i><i style="background-color: rgb(158, 158, 158);"></i><i style="background-color: rgb(96, 125, 139);"></i></div>' +

        $form.find('#event-private').attr('checked', event.isPrivate);
        $form.find('#event-allday').attr('checked', event.allDay);
        $form.find('#event-start').bootstrapMaterialDatePicker({ format: dateFormat, currentDate: moment(event.start.toISOString()), switchOnClick: true });
        $form.find('#event-end').bootstrapMaterialDatePicker({ format: dateFormat, currentDate: moment(event.end.toISOString()), switchOnClick: true });
        $form.find('#event-id').val(event._id);
        $form.find('#event-description').val(event.description);
        $("#event-start").on("dateSelected", (e) => {
            $('#event-end').bootstrapMaterialDatePicker("setMinDate", e.date);
        });
        autosize(template.find('textarea'));
    });

});