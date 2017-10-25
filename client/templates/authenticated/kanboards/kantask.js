Template.newTaskForm.events({
    'keydown  [name="new-task-name"]' (event, template) {
        if (event.keyCode === 13) {
            $(template.find('[name="save-new-task-btn"]')).click();
        }
    },
});

Template.kantask.helpers({
    background() {
        let template = Template.instance();
        if (!!template.data.color) {
            return 'border-color:' + template.data.color;
        }
    }
})

Template.kantask.events({
    'click .kantask-wrapper' (event, template) {
        let task = template.data;
        Session.set('selectedTask', task._id);
        ModalHelper.openKantaskModal('kantaskDetails', task);
    }
});

Template.kantask.onCreated(() => {});

Template.kantask.onRendered(() => {
    var template = Template.instance();
    // add member to task
    template.$('.kantask-wrapper').droppable({
        hoverClass: 'ui-state-active',
        tolerance: 'pointer',
        accept: function(event, ui) {
            return true;
        },
        drop: function(event, ui) {
            var obj;
            if ($(ui.helper).hasClass('draggable')) {
                // handle member addition
            }
        }
    });
});