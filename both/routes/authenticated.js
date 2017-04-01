const authenticatedRoutes = FlowRouter.group({
    name: 'authenticated',
    triggersEnter: [function(context, redirect) {
        if (Meteor.userId() === null) {
            FlowRouter.go('login');
        }
    }]
});

authenticatedRoutes.route('/', {
    name: 'home',
    action() {
        BlazeLayout.render('default', { yield: 'home' });
    }
});

authenticatedRoutes.route('/messages/:channel', {
    name: 'channel',
    action() {
        BlazeLayout.render('default', { yield: 'channel' });
    }
});

authenticatedRoutes.route('/calendars/:calendar', {
    name: 'calendar',
    action() {
        BlazeLayout.render('default', { yield: 'calendar' });
    }
});

// authenticatedRoutes.route('/kanboards/:board', {
//     name: 'directboard',
//     action(params) {
//         const slug = params.slug;
//         const isDirect = slug.includes('@');
//         const currentBoard = Boards.findOne({ slug: slug.replace('@', '') });
//         const currentUser = Meteor.users.findOne(Meteor.userId());
//         if (currentBoard === undefined) {
//             Boards.insert({
//                 slug: slug.replace('@', ''),
//                 title: slug.replace('@', ''),
//                 permission: 'private'
//             }, (err, id) => {
//                 if (!err) {
//                     Session.set('currentBoard', id);
//                 }
//             });
//         } else {
//             Session.set('currentBoard', currentBoard._id);
//         }
//         if (currentUser.isBoardAdmin()) {
//             FlowRouter.go('board', {
//                 id: currentBoard._id,
//                 slug: currentBoard.slug,
//             });
//         }
//     }
// });

authenticatedRoutes.route('/kanboards/:board', {
    name: 'kanboard',
    action(params) {
        const currentBoard = params.board;

        BlazeLayout.render('default', {
            yield: 'kanboard',
        });
    },
});