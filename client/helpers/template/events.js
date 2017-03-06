CalHelper = {};
// Récupère les elements de la collection Events
CalHelper.getEvents = function (start, end) {
    var events = Events.find({
        start: {
            $gte: start
        },
        end: {
            $lte: end
        }
    });
    return events;
};
// Mise en forme des Events pour affichage
CalHelper.mapDbEventsToEventSource = function (eventCursor) {
    var eventArray = [];
    eventCursor.forEach(function (eventData) {
        var title = '';
        // if (eventData.isPrivate) {
        //     title += '<i class="fa fa-user-secret" aria-hidden="true"></i> ';
        // }
         title += eventData.title;
        
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

CalHelper.createEvent = function (title, color, start, end, description, allDay, isPrivate) {
    Events.insert({
        title: title,
        color: color,
        start: start,
        end: end,
        description: description,
        allDay: allDay,
        isPrivate: isPrivate,
        ownerId: Meteor.userId()
    }, function() { Bert.alert('Event saved !', 'success'); } );
};

CalHelper.updateEvent = function (id, modifier) {
    Events.update({ _id: id }, { $set: modifier}, function() { Bert.alert('Event updated !', 'success'); } );
};

CalHelper.eventWithDates = function (calEvent) {
    calEvent.start = CalHelper.momentToDate(calEvent.start);
    calEvent.end = CalHelper.momentToDate(calEvent.end);
    return calEvent;
}

CalHelper.eventWithMomentDates = function (calEvent) {
    calEvent.start = CalHelper.dateToMoment(calEvent.start);
    calEvent.end = CalHelper.dateToMoment(calEvent.end);
    return calEvent;
}

CalHelper.momentToDate = function (moment) {
    if(typeof moment.toDate === 'function') {
        moment = moment.toDate();
    }
    return moment;
}

CalHelper.dateToMoment = function (date) {
    return moment(date);
}