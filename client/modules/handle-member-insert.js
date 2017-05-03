let _handleInsert = (memberId, type, itemId) => {
    Meteor.call('inviteUserTo', type, itemId, memberId, (err) => {
        if (err) {
            Bert.alert('An error occured', 'danger');
            return;
        }
        Bert.alert('Done !', 'success');
    });
};

let _checkIfCanInsert = (type, itemId) => {
    return Meteor.user().canChangeMembers(type, itemId);
};

export default function(memberId, type, itemId) {
    let canInsert = _checkIfCanInsert(type, itemId);

    if (canInsert) {
        _handleInsert(memberId, type, itemId);
    } else {
        Bert.alert('You can\'t add a member here', 'alert');
    }
}