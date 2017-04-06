import insertList from '../../modules/insert-list';
import updateList from '../../modules/update-list';

Meteor.methods({
    insertList(list) {
        check(list, {
            title: String,
            order: Number,
        });
        if (list.kanboard !== undefined) {
            check(list.kanboard, String);
        }
        try {
            insertList(list);
        } catch (exception) {
            throw new Meteor.Error('500', `${ exception }`);
        }
    },

    updateList(listId, modifiers) {
        check(listId, String);
        check(modifiers, { $set: Object });

        //TODO gestion des membres
        let list = Kanlists.findOne(listId);
        if (!list.kanboard) {
            if (!list.ownerId === Meteor.userId()) {
                return;
            }
        }
        try {
            updateList(listId, modifiers);
        } catch (exception) {
            throw new Meteor.Error('500', `${ exception }`);
        }
    }
});