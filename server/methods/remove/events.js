import { check } from 'meteor/check';
Meteor.methods({
    removeEvent(documentId) {
        check(documentId, String);

        try {
            return Events.remove(documentId);
        } catch (exception) {
            throw new Meteor.Error('500', `${ exception }`);
        }
    }
});