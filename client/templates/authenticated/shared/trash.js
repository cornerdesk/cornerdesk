Template.trash.onRendered(() => {
    // Remove members
    $('.trash-container').droppable({
        hoverClass: 'ui-state-active',
        tolerance: 'pointer',
        accept: function(event, ui) {
            return true;
        },
        drop: function(event, ui) {
            var obj;
            if ($(ui.helper).hasClass('ui-draggable') && $(ui.helper).hasClass('js-member')) {
                var memberId = $(ui.helper).data('user-id');
                // handle remove after confirm
                sweetAlert({
                        title: "Delete?",
                        text: "Do you really wan't to do this ?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, delete it!",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    },
                    (confirmation) => {
                        if (confirmation === false) {
                            $(ui.sender).droppable('cancel');
                            sweetAlert.close();
                            return;
                        }

                        Meteor.call('removeUserFrom',
                            FlowRouter.getRouteName(),
                            FlowRouter.getParam('item'),
                            memberId,
                            (err, result) => {
                                sweetAlert.close();
                                if (err) {
                                    Bert.alert('An error occurred', 'danger');
                                    return;
                                }
                                Bert.alert('Done', 'success');
                            }
                        );
                    });
            }
        }
    });
});