
let dateFormat = 'DD/MM/YYYY HH:mm';

let _handleInsert = (event, template) => {
    let form = template.find('[name="eventEditorForm"]'),
        title = template.find('#event-title', form).value,
        color = template.find('#event-color', form).value,
        isPrivate = template.find('#event-private', form).checked,
        allDay = template.find('#event-allday', form).checked,
        start = moment(template.find('#event-start', form).value, dateFormat).toDate(),
        end = moment(template.find('#event-end', form).value, dateFormat).toDate(),
        eventId = template.find('#event-id', form).value,
        description = template.find('#event-description', form).value,
        calendar = FlowRouter.getParam('calendar');
    if (eventId === "") {
        CalHelper.createEvent(calendar, title, color, start, end, description, allDay, isPrivate);
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
    event.target.value = '';
};

let _canInsert = () => {
    let userId = Meteor.userId(),
        calendar = FlowRouter.getParam('calendar');

    if(calendar.includes('@')) {
        let owner = Meteor.users.findOne({username: calendar.replace('@','')});
        return owner._id === userId;
    }

    return true;
};

export default function (event, template) {

    if (_canInsert()) {
        _handleInsert(event, template);
    } else {
        Bert.alert('Come on ! It\'s not your calendar. You can\'t do that.' , 'danger');
    }
}