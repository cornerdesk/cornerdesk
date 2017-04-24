let _handleInsert = (memberId) => {
    Meteor.call('inviteUserTo', FlowRouter.getRouteName(), FlowRouter.getParam('item'), memberId, (err) => {
        if (err) {
            Bert.alert('An error occured', 'error');
            return;
        }
        Bert.alert('Done !', 'success');
    });
};

let _checkIfCanInsert = () => {
    return Meteor.user().isItemAdmin();
};

export default function(memberId) {
    let canInsert = _checkIfCanInsert();

    if (canInsert) {
        _handleInsert(memberId);
    } else {
        Bert.alert('You can\'t add a member here', 'alert');
    }
}