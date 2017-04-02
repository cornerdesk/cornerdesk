Template.kanlist.events({
    'click .removeListBtn' (event, template) {
        if (FlowRouter.getParam('board').includes('@') && this.ownerId !== Meteor.userId()) {
            Bert.alert('You can\'t remove this list.', 'warning');
        }
        let listId = this._id;
        Meteor.call('removeList', listId, (err) => {
            if (err) {
                Bert.alert('An error occured while removing the list.', 'error');
                return;
            }
            Bert.alert('The list is now removed.', 'success');
        });
    }
})