let _handleSwitch = (template) => {
    if (FlowRouter.getRouteName() !== 'calendar') return;
    let calendar = FlowRouter.getParam('calendar');
    Session.set('calendar', calendar);

    if (calendar) {
        let isDirect = calendar.includes('@');
        template.isDirect.set(isDirect);
    }

    if (isDirect === true) {
        let user = Meteor.users.findOne({ username: calendar.replace('@', '') });
        template.name.set(user._id === Meteor.userId() ? "My calendar" : user.profile.name.first + "'s calendar");
    } else {
        let cal = Calendars.findOne(calendar);
        template.name.set(cal.name);
    }
};

let _setupReactiveVariables = (template) => {
    template.isDirect = new ReactiveVar();
    template.name = new ReactiveVar();
};

export default function(template) {
    _setupReactiveVariables(template);
    Tracker.autorun(() => { _handleSwitch(template); });
}