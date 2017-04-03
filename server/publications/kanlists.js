Meteor.publish('kanlist', function(kanlist) {
    check(kanlist, String);

    let selectedKanlist = Kanlists.findOne(kanlist);
    return Kantasks.find({ kanlist: selectedKanlist._id });
});

// Meteor.publish('kanlist', function(isDirect, kanboard) {
//     check(isDirect, Boolean);
//     check(kanboard, String);
//     let selectedKanlists = [];
//     let lists;
//     if (isDirect) {
//         let user = Meteor.users.findOne({ username: kanboard.replace('@', '') });
//         lists = Kanlists.find({ ownerId: user._id })
//     }
//     lists = Kanlists.find({ kanboard: kanboard }).fetch();
//     for (var list in lists) {
//         selectedKanlists.push(list._id);
//     }

//     return Kantasks.find({ kanlist: { $in: selectedKanlists } });
// });