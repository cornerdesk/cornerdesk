Template.authenticatedNavigation.helpers({
    reminder() {
        let now = new Date(),
            days = {
                0: 'Sunday',
                1: 'Monday',
                2: 'Tuesday',
                3: 'Wednesday',
                4: 'Thursday',
                5: 'Friday',
                6: 'Saturday'
            };

        return `It's ${ days[ now.getDay() ] } ! It's gonna be a great day !`;
    },
    notificationsCount() {
        return Notifications.find().count();
    },
    notifications() {
        return Notifications.find().fetch();
    }
});

Template.authenticatedNavigation.events({
    'click .logout' (event) {
        event.preventDefault();

        Meteor.logout((error) => {
            if (error) {
                Bert.alert(error.reason, 'warning');
            } else {
                Bert.alert('Logged out!', 'success');
            }
        });
    },
});