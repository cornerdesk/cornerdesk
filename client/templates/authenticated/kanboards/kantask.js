Template.newTaskForm.events({
    'keydown  [name="new-task-name"]' (event, template) {
        if (event.keyCode === 13) {
            $(template.find('[name="save-new-task-btn"]')).click();
        }
    }
});

Template.kantask.onRendered(() => {
    // add member to task
    this.$('.kantask-wrapper').droppable({
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
})