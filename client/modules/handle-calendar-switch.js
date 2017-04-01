let _handleSwitch = (template) => {
    let calendar = FlowRouter.getParam('calendar');

    if (calendar) {
        let isDirect = calendar.includes('@');
        template.isDirect.set(isDirect);
    }

    if (template.isDirect) {
        let user = Meteor.users.findOne({ username: calendar.replace('@', '') });
        template.name.set(user._id === Meteor.userId() ? "My calendar" : user.profile.name.first + "'s calendar");
    } else {
        let cal = Calendars.find({ name: calendar });
        template.name.set(cal.name);
    }
};

let _setupReactiveVariables = (template) => {
    template.isDirect = new ReactiveVar();
    template.name = new ReactiveVar();
};

export default function(template) {
    if (FlowRouter.getRouteName() !== 'calendar') return;
    _setupReactiveVariables(template);
    Tracker.autorun(() => { _handleSwitch(template); });
}