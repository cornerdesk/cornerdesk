import { check } from 'meteor/check';
Meteor.methods({
    removeList(documentId) {
        check(documentId, String);

        try {
            return Kanlists.remove(documentId);
        } catch (exception) {
            throw new Meteor.Error('500', `${ exception }`);
        }
    }
});