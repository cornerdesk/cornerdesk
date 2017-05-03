Template.newTaskForm.events({
    'keydown  [name="new-task-name"]' (event, template) {
        if (event.keyCode === 13) {
            $(template.find('[name="save-new-task-btn"]')).click();
        }
    },
});

Template.kantask.events({
    'click .kantask-wrapper' (event, template) {
        let task = template.data,
            nextList = $(template.firstNode).parents('.kanlist').next(),
            details = $('.kantask-details');
        if (details.length > 0) {
            Session.set('selectedTask', null);
            Blaze.remove(Blaze.getView(details.get(0)));
            return;
        }
        Session.set('selectedTask', task._id);
        Blaze.render(Template.kantaskDetails, $('.kanlists-container').get(0), nextList.get(0));
    }
});

Template.kantask.onCreated(() => {});

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
});