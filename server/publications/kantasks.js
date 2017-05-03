Meteor.publish('kantask', function(taskId) {
    check(taskId, String);

    return Kantasks.findOne(taskId);
});