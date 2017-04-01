let _establishSubscription = (template, isDirect, kanboard) => {
    template.subscribe('kanboard', isDirect, kanboard);
};

let _handleSwitch = (template) => {
    let board = FlowRouter.getParam('board');

    if (board) {
        let isDirect = board.includes('@');
        template.isDirect.set(isDirect);

        if (template.isDirect) {
            let user = Meteor.users.findOne({ username: board.replace('@', '') });
            template.name.set(user._id === Meteor.userId() ? "My Kanban board" : user.profile.name.first + "'s Kanban board");
        } else {
            let cal = Kanboards.find({ name: board });
            template.name.set(cal.name);
        }
        _establishSubscription(template, isDirect, board);
    }
};

let _setupReactiveVariables = (template) => {
    template.isDirect = new ReactiveVar();
    template.name = new ReactiveVar();
};

export default function(template) {
    if (FlowRouter.getRouteName() !== 'kanboard') return;
    _setupReactiveVariables(template);
    Tracker.autorun(() => { _handleSwitch(template); });
}