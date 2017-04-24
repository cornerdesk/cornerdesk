import ModalHelper from '../helpers/template/open-modal';
let _handleInsert = (event, template) => {
    let name = template.find('[name="calendar-name"]').value,
        description = template.find('[name="calendar-description"]').value,
        isPrivate = template.find('[name="calendar-private"]').checked;

    Meteor.call('insertCalendar', {
        name: name,
        description: description,
        isPrivate: isPrivate,
    }, function(error) {
        if (error) {
            Bert.alert(error, 'error');
            return;
        }
        Bert.alert('Your new calendar is ready !', 'success');
        Modal.hide('newCalendarModal');
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