Template.kantaskDetails.events({
    'click [name="close-kantask-details"]' (event, template) {
        Blaze.remove(template.view);
    },
    'click [name="save-task"]' (event, template) {
        Meteor.call('updateTask', template.task.get()._id, { $set: { description: template.find('[name="task-description"]').value } });
    }
});

Template.kantaskDetails.helpers({
    task() {
        return Template.instance().task.get();
    }
});

Template.kantaskDetails.onCreated(() => {
    let template = Template.instance();
    template.task = new ReactiveVar();
    Tracker.autorun(() => {
        template.task.set(Kantasks.findOne(Session.get('selectedTask')));
    });
});

Template.kantaskDetails.onRendered(() => {
    let template = Template.instance();
    template.$('#task-description').editable({
        mode: 'inline',
        anim: '0.3s',
        success: function(response, newValue) {
            template.task.get().setDescription(newValue);
        }
    });
});