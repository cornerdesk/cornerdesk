var bodyEl,
    content,
    openbtn,
    closebtn,
    isOpen;

function init() {
    bodyEl = document.body;
    content = document.querySelector('.main-panel');
    openbtn = document.getElementById('open-button');
    closebtn = document.getElementById('close-button');
    isOpen = false;

    initEvents();
}

function initEvents() {
    openbtn.addEventListener('click', toggleMenu);
    if (closebtn) {
        closebtn.addEventListener('click', toggleMenu);
    }

    // close the menu element if the target it´s not the menu element or one of its descendants..
    content.addEventListener('click', function(ev) {
        var target = ev.target;
        if (isOpen && target !== openbtn) {
            toggleMenu();
        }
    });
}

function toggleMenu() {
    if (isOpen) {
        $(bodyEl).removeClass('show-menu');
    } else {
        $(bodyEl).addClass('show-menu');
    }
    isOpen = !isOpen;
}

Template.sidebar.onCreated(() => {
    let template = Template.instance();
    template.subscribe('sidebar');
});

Template.sidebar.onRendered(() => {
    init();

    $('#sidebarMenu').perfectScrollbar();
    $('#sidebarMenu').on('mouseenter', () => {
        $('#sidebarMenu').perfectScrollbar('update');
    });
});

Template.sidebar.helpers({
    currentChannel(name) {
        if (FlowRouter.getRouteName() === 'channel') {
            let current = FlowRouter.getParam('item');
            if (current) {
                return current === name || current === `@${name}` ? 'active' : false;
            }
        }
        return false;
    },
    currentCalendar(name) {
        if (FlowRouter.getRouteName() === 'calendar') {
            let current = FlowRouter.getParam('item');
            if (current) {
                return current === name || current === `@${name}` ? 'active' : false;
            }
        }
        return false;
    },
    currentBoard(name) {
        if (FlowRouter.getRouteName() === 'kanboard') {
            let current = FlowRouter.getParam('item');
            if (current) {
                return current === name || current === `@${name}` ? 'active' : false;
            }
        }
        return false;
    },
    currentPins() {
        if (FlowRouter.getRouteName() === 'pins') {
            let current = FlowRouter.getParam('item');
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
    hasUnreadMessages(channel) {
        return channel.hasUnreadMessages(Meteor.userId());
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
    initials(name) {
        return name.first[0].toUpperCase() + name.last[0].toUpperCase()
    },
    fullName(name) {
        if (name) {
            return `${name.first} ${name.last}`;
        }
    },
    presenceStatusClassName(user) {
        const userPresence = presences.findOne({ userId: user._id });
        if (!userPresence)
            return 'offline';
        else
            return userPresence.state;
    },
});

Template.sidebar.events({
    'click [name="new-calendar-button"]': (event, template) => {
        Modal.show('newCalendarModal');

    },
    'click [name="new-channel-button"]': (event, template) => {
        Modal.show('newChannelModal');

    },
    'click [name="new-board-button"]': (event, template) => {
        Modal.show('newBoardModal');
    },
});