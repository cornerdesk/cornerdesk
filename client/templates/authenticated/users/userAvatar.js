Template.userAvatar.helpers({
    member: () => {
        return Meteor.users.findOne(Template.instance().data.userId);
    },
    initials: () => {
        return Meteor.users.findOne(Template.instance().data.userId).getInitials();
    },
    memberType: () => {
        return Template.instance().data.isAdmin ? 'admin' : 'collab';
    }
})