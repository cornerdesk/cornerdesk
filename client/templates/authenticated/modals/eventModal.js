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
        debugger;
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
        let $form = this.$('#eventEditorForm');
        let event = Template.instance().data;
        $form.find('#event-title').val(event.title);
        $form.find('#event-color').colorpicker({
            color: event.color,
            format: 'hex',
            colorSelectors: {
                '#f44336': '#f44336', //red
                '#e91e63': '#e91e63', //pink
                '#9c27b0': '#9c27b0', //purple
                '#673ab7': '#673ab7', //deep-purple
                '#3f51b5': '#3f51b5', //indigo
                '#2196f3': '#2196f3', //blue
                '#03a9f4': '#03a9f4', //light-blue
                '#00bcd4': '#00bcd4', //cyan
                '#009688': '#009688', //teal
                '#4caf50': '#4caf50', //green
                '#8bc34a': '#8bc34a', //light-green
                '#cddc39': '#cddc39', //lime
                '#ffeb3b': '#ffeb3b', //yellow
                '#ffc107': '#ffc107', //amber
                '#ff9800': '#ff9800', //orange
                '#ff5722': '#ff5722', //deep-orange
                '#795548': '#795548', //brown
                '#9e9e9e': '#9e9e9e', //grey
                '#607d8b': '#607d8b', //blue-grey
                '#666666': '#666666',
            },
            template: '<div class="colorpicker dropdown-menu colorpicker-hidden colorpicker-horizontal colorpicker-right">' +
                '<div class="colorpicker-selectors" style="display: block;">' +
                '</div>',
            component: '.colorpicker-addon',
            horizontal: true
        }).on('changeColor', function(e) {
            $(e.target).css('color', e.color.toString('hex'));
        }).css('color', event.color);
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
    });
});