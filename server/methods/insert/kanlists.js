import insertList from '../../modules/insert-list';

Meteor.methods({
    insertList(list) {
        check(list, {
            title: String,
        });
        if (list.kanboard !== undefined) {
            check(list, { kanboard: String });
        }
        try {
            insertList(list);
        } catch (exception) {
            throw new Meteor.Error('500', `${ exception }`);
        }
    }
});