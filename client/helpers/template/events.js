CalHelper = {};
// Récupère les elements de la collection Events
CalHelper.getEvents = (calendar, start, end) => {
    if (calendar.includes('@')) {
        let calendarOwner = Meteor.users.findOne({ username: calendar.replace('@', '') });
        return Events.find({
            $or: [{
                    start: { $lte: end }
                },
                {
                    end: { $gte: start }
                }
            ],
            $or: [{
                    isPrivate: false
                },
                {
                    isPrivate: true,
                    ownerId: Meteor.userId()
                }
            ],
            ownerId: calendarOwner._id
        });
    }
    return Events.find({
        calendar: calendar,
        $or: [{
                start: { $lte: end }
            },
            {
                end: { $gte: start }
            }
        ],
        $or: [{
                isPrivate: false
            },
            {
                isPrivate: true,
                ownerId: Meteor.userId()
            }
        ]
    });
};
// Mise en forme des Events pour affichage
CalHelper.mapDbEventsToEventSource = (eventCursor) => {
    var eventArray = [];
    eventCursor.forEach((eventData) => {
        var title = eventData.title;

        var event = {
            id: eventData._id,
            title: title,
            color: eventData.color,
            start: moment(eventData.start.toISOString()),
            end: moment(eventData.end.toISOString()),
            description: eventData.description,
            allDay: eventData.allDay,
            isPrivate: eventData.isPrivate,
            ownerId: eventData.ownerId
        };
        eventArray.push(event);
    });
    return eventArray;
};

CalHelper.createEvent = (calendar, title, color, start, end, description, allDay, isPrivate) => {
    let calId = calendar.includes('@') ? null : calendar;

    Events.insert({
        title: title,
        color: color,
        start: start,
        end: end,
        description: description,
        allDay: allDay,
        isPrivate: isPrivate,
        calendar: calId,
        ownerId: Meteor.userId()
    }, function() { Bert.alert('Event saved !', 'success'); });
};

CalHelper.updateEvent = (id, modifier) => {
    Events.update({ _id: id }, { $set: modifier }, function(err) {
        if (err) { Bert.alert('Oups... An error occured...', 'danger'); }
        Bert.alert('Event updated !', 'success');
    });
};

CalHelper.eventWithDates = (calEvent) => {
    calEvent.start = CalHelper.momentToDate(calEvent.start);
    calEvent.end = CalHelper.momentToDate(calEvent.end);
    return calEvent;
};

CalHelper.eventWithMomentDates = (calEvent) => {
    calEvent.start = CalHelper.dateToMoment(calEvent.start);
    calEvent.end = CalHelper.dateToMoment(calEvent.end);
    return calEvent;
};

CalHelper.momentToDate = (moment) => {
    if (typeof moment.toDate === 'function') {
        moment = moment.toDate();
    }
    return moment;
};

CalHelper.dateToMoment = (date) => {
    return moment(date);
};


CalHelper.canInsert = () => {
    let userId = Meteor.userId(),
        calendar = Session.get('item');

    if (calendar.includes('@')) {
        let owner = Meteor.users.findOne({ username: calendar.replace('@', '') });
        return owner._id === userId;
    }
    return Meteor.user().isItemMember();
};