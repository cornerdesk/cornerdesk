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
        let task = template.data,
            ui = $(template.firstNode),
            nextList = ui.parents('.kanlist').next(),
            details = $('.kantask-details');
        if (details.length > 0) {
            $('.kantask-wrapper.active').removeClass('active');
            Session.set('selectedTask', null);
            Blaze.remove(Blaze.getView(details.get(0)));
            return;
        }
        ui.addClass('active');
        Session.set('selectedTask', task._id);
        Blaze.render(Template.kantaskDetails, $('.kanlists-container').get(0), nextList.get(0));
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