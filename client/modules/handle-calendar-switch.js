let _handleSwitch = (template) => {
    let calendar = FlowRouter.getParam('calendar');

    if (calendar) {
        let isDirect = calendar.includes('@');
        template.isDirect.set(isDirect);
    }
    
    if (template.isDirect) {
        var user = Meteor.users.findOne({ username: calendar.replace('@', '') });
        template.name = user.profile.name + "'s calendar";
    } else {
        template.name = calendar;
    }
};

let _setupReactiveVariables = (template) => {
    template.isDirect = new ReactiveVar();
    template.name = new ReactiveVar();
};

export default function (template) {
    _setupReactiveVariables(template);
    Tracker.autorun(() => { _handleSwitch(template); });
}
