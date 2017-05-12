let _establishSubscription = (template, isDirect, kanboard) => {
    template.subscribe('kanboard', isDirect, kanboard);
};

let _handleSwitch = (template) => {
    let board = FlowRouter.getParam('item');
    if (FlowRouter.getRouteName() !== 'kanboard') return;
    Session.set('item', board);

    if (board) {
        let isDirect = board.includes('@');
        template.isDirect.set(isDirect);

        if (isDirect === true) {
            let user = Meteor.users.findOne({ username: board.replace('@', '') });
            template.name.set(user._id === Meteor.userId() ? "My Kanban board" : user.profile.name.first + "'s Kanban board");
        } else {
            let kanboard = Kanboards.findOne(board);
            if (!Meteor.user().isItemMember() && !kanboard.isPublic()) {
                FlowRouter.go('home');
                Bert.alert('You are not a member of this private board', 'warning');
            }
            template.name.set(kanboard.name);
        }
        _establishSubscription(template, isDirect, board);
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