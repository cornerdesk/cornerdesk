import { check } from 'meteor/check';
Meteor.publish('kanlist', function(kanlist) {
    check(kanlist, String);

    let selectedKanlist = Kanlists.findOne(kanlist);
    return Kantasks.find({ kanlist: selectedKanlist._id });
});