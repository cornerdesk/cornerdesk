Template.sidebar.onCreated(() => {
    let template = Template.instance();
    template.subscribe('sidebar');
});

Template.sidebar.helpers({
    currentChannel(name) {
        if (FlowRouter.getRouteName() === 'channel') {
            let current = FlowRouter.getParam('channel');
            if (current) {
                return current === name || current === `@${name}` ? 'active' : false;
            }
        }
        return false;
    },
    currentCalendar(name) {
        if (FlowRouter.getRouteName() === 'calendar') {
            let current = FlowRouter.getParam('calendar');
            if (current) {
                return current === name || current === `@${name}` ? 'active' : false;
            }
        }
        return false;
    },
    currentBoard(name) {
        if (FlowRouter.getRouteName() === 'kanboard') {
            let current = FlowRouter.getParam('board');
            if (current) {
                return current === name || current === `@${name}` ? 'active' : false;
            }
        }
        return false;
    },
    currentUsername() {
        let currentUser = Meteor.users.findOne({ _id: Meteor.userId() });
        return currentUser.username;
    },
    calendars() {
        let calendars = Calendars.find();
        if (calendars) {
            return calendars;
        }
    },
    channels() {
        let channels = Channels.find();
        if (channels) {
            return channels;
        }
    },
    kanboards() {
        let kanboards = Kanboards.find();
        if (kanboards) {
            return kanboards;
        }
    },
    users() {
        let users = Meteor.users.find({ _id: { $ne: Meteor.userId() } });
        if (users) {
            return users;
        }
    },
    fullName(name) {
        if (name) {
            return `${name.first} ${name.last}`;
        }
    }
});