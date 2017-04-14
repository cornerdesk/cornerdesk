let _handleInsert = (event, template) => {
    let name = template.find('[name="kanboard-name"]').value,
        description = template.find('[name="kanboard-description"]').value,
        isPrivate = template.find('[name="kanboard-private"]').checked;

    Meteor.call('insertBoard', {
        name: name,
        description: description,
        isPrivate: isPrivate,
    }, function(error) {
        if (error) {
            Bert.alert(error, 'error');
            return;
        }
        Bert.alert('Your new kanban board is ready !', 'success');
    });
    event.target.value = '';
};

let _canInsert = () => {
    if (!Meteor.userId()) return false;

    return true;
};

export default function(event, template) {

    if (_canInsert()) {
        _handleInsert(event, template);
    } else {
        Bert.alert('Come on ! You can\'t do that.', 'danger');
    }
}