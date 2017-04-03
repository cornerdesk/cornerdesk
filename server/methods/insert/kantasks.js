import insertTask from '../../modules/insert-task';

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
    }
});