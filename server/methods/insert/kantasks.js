import insertTask from '../../modules/insert-task';
import updateTask from '../../modules/update-task';

Meteor.methods({
    insertTask(task) {
        check(task, {
            title: String,
            kanlist: String,
        });
        try {
            insertTask(task);
        } catch (exception) {
            throw new Meteor.Error('500', `${ exception }`);
        }
    },

    updateTask(taskId, modifiers) {
        check(taskId, String);
        check(modifiers, { $set: Object });

        try {
            updateTask(taskId, modifiers);
        } catch (exception) {
            throw new Meteor.Error('500', `${ exception }`);
        }
    }
});