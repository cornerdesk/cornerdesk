KanlistsHelper = {};

// KanlistsHelper.getLists = (kanboard) => {
//     if (kanboard.includes('@')) {
//         let user = Meteor.users.findOne({ username: kanboard.replace('@', '') });
//         if (user._id === Meteor.userId()) {
//             return Kanlists.find({})
//         }
//     }
// }