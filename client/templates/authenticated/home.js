Template.home.helpers({
    isReady() {
        return Template.instance().isReady.get();
    },
    kanboards() {
        return Template.instance().items.kanboards;
    },
    calendars() {
        return Template.instance().items.calendars;
    },
    getStylePercentageTasks(list) {
        return 'style="width:' + (list.affectedTasks / list.totalTasks * 100) + '%"';
    }
})

Template.home.onCreated(() => {
    let instance = Template.instance();
    instance.isReady = new ReactiveVar(false);
    Tracker.nonreactive(function() {
        Meteor.call('getDashboardData', function(err, data) {
            if (!err) {
                instance.items = data;
                instance.isReady.set(true);
            }
        });
    });
});