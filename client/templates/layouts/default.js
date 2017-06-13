const handleRedirect = (routes, redirect) => {
    let currentRoute = FlowRouter.getRouteName();
    if (routes.indexOf(currentRoute) > -1) {
        FlowRouter.go(redirect);
        return true;
    }
};

Template.default.onCreated(() => {

});

Template.default.onRendered(() => {
    Tracker.autorun(() => {
        let isChannel = FlowRouter.getParam('channel'),
            bodyClasses = document.body.classList;

        return isChannel ? bodyClasses.add('is-channel') : bodyClasses.remove('is-channel');
    });
});

Template.default.helpers({
    showActionBar() {
        return FlowRouter.getRouteName() === 'calendar' ||
            FlowRouter.getRouteName() === 'kanboard';
    },
    loggingIn() {
        return Meteor.loggingIn();
    },
    authenticated() {
        return !Meteor.loggingIn() && Meteor.user();
    },
    redirectAuthenticated() {
        return handleRedirect([
            'login',
            'signup',
            'recover-password',
            'reset-password'
        ], 'home');
    },
    redirectPublic() {
        return handleRedirect(['channel', 'home', 'calendar', 'kanboard'], '/login');
    },
    route() {
        return FlowRouter.getRouteName();
    }
});

Template.default.events({
    'click .actions-opener' (event, template) {
        let $actionContainer = template.$('.actions-wrapper');
        $actionContainer.toggleClass('open');
        $('.actions-opener i', $actionContainer).toggleClass('ti-angle-up').toggleClass('ti-angle-down');
    }
})