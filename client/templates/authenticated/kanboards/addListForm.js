Template.addListForm.events({
    'click [name="new-list-btn"]' (event, template) {
        let nameInput = template.find('[name="new-list-name"]');
        if (nameInput.value !== '') {
            let boardId = FlowRouter.getParam('board');
            var list = null;
            if (boardId.includes('@')) {
                let user = Meteor.users.findOne({ username: boardId.replace('@', '') });
                if (user._id === Meteor.userId()) {
                    list = { title: nameInput.value, order: $('.kanlists-container').find('.kanlist').length };
                }
            } else {
                // TODO Gestion des membres du board
                list = { title: nameInput.value, kanboard: boardId, order: $('.kanlists-container').find('.kanlist').length };
            }
            if (list === null) {
                Bert.alert('You don\'t have the rights to create a list', 'warning');
            } else {
                Meteor.call('insertList', list, (error) => {
                    if (error) {
                        Bert.alert(error.reason, 'danger');
                    } else {
                        event.target.value = '';
                    }
                });
            }
        } else {
            Bert.alert('The list name cannot be empty', 'error');
        }
    }
});