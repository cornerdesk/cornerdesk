import handleMemberInsert from '../../../modules/handle-member-insert';

const getUsers = () => {
    return Meteor.users.find({
        _id: {
            $ne: Meteor.userId()
        }
    }).fetch();
}

Template.userAvatar.helpers({
    member: () => {
        return Meteor.users.findOne(Template.instance().data.userId);
    },
    initials: () => {
        return Meteor.users.findOne(Template.instance().data.userId).getInitials();
    },
    memberType: () => {
        return Template.instance().data.isAdmin ? 'admin' : 'normal';
    },
    userId: () => {
        return Template.instance().data.userId;
    }
});


var substringMatcher = function(users) {
    return function findMatches(q, cb) {
        var matches, substringRegex;

        // an array that will be populated with substring matches
        matches = [];

        // regex used to determine if a string contains the substring `q`
        substrRegex = new RegExp(q, 'i');

        // iterate through the pool of strings and for any string that
        // contains the substring `q`, add it to the `matches` array
        $.each(users, function(i, user) {
            if (substrRegex.test(user.username)) {
                matches.push(user);
            }
        });

        cb(matches);
    };
};


Template.addMemberForm.onRendered(() => {
    this.$('[name="member-selector"]').typeahead({
        hint: true,
        highlight: true,
        minLength: 0,
        classNames: {
            input: 'tt-input',
            menu: 'dropdown-menu',
            hint: 'tt-hint',
            selectable: 'tt-selectable'
        }
    }, {
        name: 'members',
        displayKey: 'username',
        source: substringMatcher(getUsers())
    }).bind('typeahead:select', function(ev, suggestion) {
        handleMemberInsert(suggestion._id);
        let container = document.getElementById('newMember');
        container.innerHTML = '';
        Blaze.render(Template.addMember, container);
    });
});

Template.userAvatar.onRendered(() => {

    let $members = this.$('.js-member');
    $members.draggable({
        cursor: 'pointer',
        revert: 'invalid',
        helper: function() {
            return $(this).clone();
        },
        distance: 20,
        start(evt, ui) {
            $('.trash-container').addClass('dragging');
        },
        stop(evt, ui) {
            $('.trash-container').removeClass('dragging');
        }
    });
});