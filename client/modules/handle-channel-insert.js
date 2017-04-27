import ModalHelper from '../helpers/template/open-modal';
let _handleInsert = (event, template) => {
    let name = template.find('[name="channel-name"]').value,
        description = template.find('[name="channel-description"]').value,
        isPrivate = template.find('[name="channel-private"]').checked;

    Meteor.call('insertChannel', {
        name: name,
        description: description,
        isPrivate: isPrivate,
    }, function(error) {
        if (error) {
            Bert.alert(error, 'danger');
            return;
        }
        Bert.alert('Your new channel is ready !', 'success');
        Modal.hide('newChannelModal');
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