Template.newTaskForm.events({
    'keydown  [name="new-task-name"]' (event, template) {
        if (event.keyCode === 13) {
            $(template.find('[name="save-new-task-btn"]')).click();
        }
    }
});