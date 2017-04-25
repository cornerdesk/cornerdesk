Meteor.methods({
    removeTask(documentId) {
        check(documentId, String);

        try {
            return Kantasks.remove(documentId);
        } catch (exception) {
            throw new Meteor.Error('500', `${ exception }`);
        }
    }
});